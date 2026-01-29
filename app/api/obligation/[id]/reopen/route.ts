import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Obligation from "@/models/Obligation";

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await dbConnect();

    const obligation = await Obligation.findById(params.id);

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