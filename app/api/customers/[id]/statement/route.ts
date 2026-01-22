import { NextRequest, NextResponse } from "next/server";
import { StatementService } from "@/lib/services/statementService";
import { connectDB } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Customer ID is required" },
        { status: 400 },
      );
    }

    const statement = await StatementService.generate(id);

    return NextResponse.json(statement);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
