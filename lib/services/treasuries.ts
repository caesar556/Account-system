import dbConnect from "../db";
import { Treasury } from "@/models/Treasury";

export async function getServices() {
  await dbConnect();

  const treasuries = await Treasury.find({ isActive: true })
    .lean();

  return treasuries.map((treasury: any) => ({
    ...treasury,
    _id: treasury._id.toString(),
  }));
}
