import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Treasury } from "@/models/Treasury";

export async function GET() {
  try {
    await dbConnect();
    const treasuries = await Treasury.find({ isActive: true });
    return NextResponse.json(treasuries);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const treasury = await Treasury.create(body);
    return NextResponse.json(treasury, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
