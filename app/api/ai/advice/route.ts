import { FinancialInsightsService } from "@/lib/services/ai/financialInsightsService";
import { FinancialAdviceService } from "@/lib/services/ai/financialAdviceService";

export async function POST(req: Request) {
  const { treasuryId } = await req.json();

  if (!treasuryId) {
    return Response.json({ error: "treasuryId is required" }, { status: 400 });
  }

  const adviceInput =
    await FinancialInsightsService.buildAdviceInput(treasuryId);

  const advice = await FinancialAdviceService.generateAdvice(adviceInput);

  return Response.json({
    treasuryId,
    generatedAt: new Date().toISOString(),
    advice,
  });
}
