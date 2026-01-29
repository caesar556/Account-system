import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Obligation from "@/models/Obligation";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const overdue = searchParams.get("overdue");

    const query: any = {};

    if (status) query.status = status;

    if (overdue === "true") {
      query.status = "OPEN";
      query.dueDate = { $lt: new Date() };
    }

    const obligations = await Obligation.find(query).sort({
      dueDate: 1,
    });

    return NextResponse.json(obligations);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch obligations" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const obligation = await Obligation.create(body);

    return NextResponse.json(obligation, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create obligation" },
      { status: 400 },
    );
  }
}
