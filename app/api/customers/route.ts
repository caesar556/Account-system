import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Customer from "@/models/Customer";
import { CashTransaction } from "@/models/CashTransaction";
import CustomerRecord from "@/models/CustomerRecord";
import { ICreateCustomerDto } from "@/lib/types/customer";

export async function GET(request: Request) {
  try {
    await dbConnect();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = { isActive: true };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (category && category !== "all") {
      filter.category = category;
    }

    if (status === "overdue") {
      // We'll filter later after fetching
    }

    // Get customers with pagination
    const [customers, totalCount] = await Promise.all([
      Customer.find(filter)
        .sort({ currentBalance: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Customer.countDocuments(filter),
    ]);

    // Enhance with additional data
    const customersWithDetails = await Promise.all(
      customers.map(async (customer: any) => {
        const customerId = customer._id.toString();

        // Get recent transactions count
        const recentTransactionsCount = await CashTransaction.countDocuments({
          customerId,
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Last 30 days
        });

        // Get open records count
        const openRecordsCount = await CustomerRecord.countDocuments({
          customerId,
          status: { $in: ["OPEN", "PARTIAL"] },
        });

        // Calculate total purchases (from records)
        const totalPurchases = await CustomerRecord.aggregate([
          { $match: { customerId: customer._id } },
          { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]);

        // Determine customer status
        let status: "active" | "overdue" | "inactive" = "active";

        if (!customer.isActive) {
          status = "inactive";
        } else if (customer.currentBalance > customer.creditLimit * 0.8) {
          status = "overdue";
        }

        // Check for overdue records
        const hasOverdueRecords = await CustomerRecord.exists({
          customerId,
          status: { $in: ["OPEN", "PARTIAL"] },
          dueDate: { $lt: new Date() },
        });

        if (hasOverdueRecords) {
          status = "overdue";
        }

        return {
          ...customer,
          _id: customerId,
          status,
          totalPurchases: totalPurchases[0]?.total || 0,
          recentTransactionsCount,
          openRecordsCount,
          totalDebt: Math.max(0, customer.currentBalance),
          totalCredit: Math.max(0, -customer.currentBalance),
          // Format for display
          balanceDisplay:
            customer.currentBalance > 0
              ? `عليه ${customer.currentBalance.toLocaleString()} ج.م`
              : customer.currentBalance < 0
                ? `له ${Math.abs(customer.currentBalance).toLocaleString()} ج.م`
                : "متوازن",
        };
      }),
    );

    // Apply status filter if needed
    let filteredCustomers = customersWithDetails;
    if (status === "overdue") {
      filteredCustomers = customersWithDetails.filter(
        (c) => c.status === "overdue",
      );
    }

    return NextResponse.json({
      success: true,
      data: filteredCustomers,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page * limit < totalCount,
        hasPrev: page > 1,
      },
    });
  } catch (error: any) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch customers",
        code: "CUSTOMERS_FETCH_ERROR",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body: ICreateCustomerDto = await request.json();

    // Validate required fields
    if (!body.name || body.name.trim().length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: "Customer name is required and must be at least 2 characters",
          code: "VALIDATION_ERROR",
        },
        { status: 400 },
      );
    }

    // Check for duplicate customer (by name or phone)
    const existingCustomer = await Customer.findOne({
      $or: [
        { name: body.name.trim() },
        ...(body.phone ? [{ phone: body.phone.trim() }] : []),
      ],
    });

    if (existingCustomer) {
      return NextResponse.json(
        {
          success: false,
          error: "Customer with this name or phone already exists",
          code: "DUPLICATE_CUSTOMER",
        },
        { status: 409 },
      );
    }

    // Create customer
    const customer = await Customer.create({
      ...body,
      name: body.name.trim(),
      phone: body.phone?.trim(),
      email: body.email?.trim(),
      address: body.address?.trim(),
      creditLimit: body.creditLimit || 0,
      currentBalance: 0,
      category: body.category || "regular",
      createdBy: "User",
      isActive: true,
    });

    // Return formatted response
    const customerResponse = {
      ...customer.toObject(),
      _id: customer._id.toString(),
      status: "active" as const,
      totalDebt: 0,
      totalCredit: 0,
      recentTransactionsCount: 0,
      openRecordsCount: 0,
      balanceDisplay: "متوازن",
    };

    return NextResponse.json(
      {
        success: true,
        data: customerResponse,
        message: "Customer created successfully",
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating customer:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        {
          success: false,
          error: errors.join(", "),
          code: "VALIDATION_ERROR",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create customer",
        code: "CUSTOMER_CREATE_ERROR",
      },
      { status: 500 },
    );
  }
}
