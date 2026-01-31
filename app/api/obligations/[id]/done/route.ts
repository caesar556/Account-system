import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Obligation from "@/models/Obligation";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
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

    if (obligation.status === "DONE") {
      return NextResponse.json(
        { message: "Already marked as done" },
        { status: 400 },
      );
    }

    obligation.status = "DONE";
    obligation.doneAt = new Date();

    await obligation.save();

    return NextResponse.json(obligation);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update obligation" },
      { status: 500 },
    );
  }
}
