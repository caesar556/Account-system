import dbConnect from "../db";
import { Treasury } from "@/models/Treasury";

export async function getServices() {
  await dbConnect();

  const treasuries = await Treasury.find()
    .select("title description icon features")
    .lean();

  return treasuries.map((treasury) => ({
    _id: treasury._id.toString(),
  }));
}
