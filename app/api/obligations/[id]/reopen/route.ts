import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Obligation from "@/models/Obligation";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;
    const obligation = await Obligation.findById(id);

    if (!obligation) {
      return NextResponse.json(
        { message: "Obligation not found" },
        { status: 404 },
      );
    }

    obligation.status = "OPEN";
    obligation.doneAt = null;

    await obligation.save();

    return NextResponse.json(obligation);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to reopen obligation" },
      { status: 500 },
    );
  }
}
