import { FinancialInsightsService } from "@/lib/services/ai/financialInsightsService";
import { FinancialAdviceService } from "@/lib/services/ai/financialAdviceService";
import dbConnect from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { treasuryId } = await req.json();

    if (!treasuryId) {
      return Response.json({ error: "treasuryId is required" }, { status: 400 });
    }

    await dbConnect();

    const adviceInput =
      await FinancialInsightsService.buildAdviceInput(treasuryId);

    const advice = await FinancialAdviceService.generateAdvice(adviceInput);

    return Response.json({
      treasuryId,
      generatedAt: new Date().toISOString(),
      advice,
    });
  } catch (error) {
    console.error("AI Advice Error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "حدث خطأ في التحليل" },
      { status: 500 }
    );
  }
}
