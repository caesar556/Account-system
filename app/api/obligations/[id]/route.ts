import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Obligation from "@/models/Obligation";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();

    const { id } = await params;
    await Obligation.findByIdAndDelete(id);

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete obligation" },
      { status: 500 },
    );
  }
}
