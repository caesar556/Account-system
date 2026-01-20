import { NextResponse } from "next/server";
import { StatementService } from "@/lib/services/statementService";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Customer ID is required" },
        { status: 400 },
      );
    }

    const statement = await StatementService.generateStatement(id);

    return NextResponse.json(statement);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
