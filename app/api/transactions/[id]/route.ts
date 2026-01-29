import dbConnect from "@/lib/db";

export async function DELETE({ params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const { id } = await params;
  } catch (err) {}
}
