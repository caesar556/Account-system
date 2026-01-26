import dbConnect from "@/lib/db";
import { Treasury } from "@/models/Treasury";
import AIInsightsMain from "@/components/pages/ai-insights/AIInsightsMain";

export default async function AIInsightsPage() {
  await dbConnect();
  const treasury = await Treasury.findOne();

  return (
    <section dir="rtl" className="min-h-dvh bg-slate-50/50">
      <AIInsightsMain treasuryId={treasury?._id?.toString() || ""} />
    </section>
  );
}
