import { FinancialInsightsService } from "@/lib/services/ai/financialInsightsService";
import { FinancialAdviceService } from "@/lib/services/ai/financialAdviceService";
import dbConnect from "@/lib/db";
import redis from "@/lib/redis";

const CACHE_TTL = 60 * 30;

type AdviceCachePayload = {
  treasuryId: string;
  generatedAt: string;
  advice: string;
};

export async function POST(req: Request) {
  try {
    const { treasuryId, forceRefresh } = await req.json();

    if (!treasuryId) {
      return Response.json(
        { error: "treasuryId is required" },
        { status: 400 },
      );
    }

    await dbConnect();

    const cacheKey = `ai:advice:treasury:${treasuryId}:v1`;

    if (!forceRefresh) {
      const cached = await redis.get<AdviceCachePayload>(cacheKey);

      if (cached) {
        return Response.json({
          ...cached,
          cached: true,
        });
      }
    }

    const adviceInput =
      await FinancialInsightsService.buildAdviceInput(treasuryId);

    const advice = await FinancialAdviceService.generateAdvice(adviceInput);

    const payload: AdviceCachePayload = {
      treasuryId,
      generatedAt: new Date().toISOString(),
      advice,
    };
    await redis.set(cacheKey, payload, {
      ex: CACHE_TTL,
    });

    return Response.json({
      ...payload,
      cached: false,
    });
  } catch (error) {
    console.error("AI Advice Error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "حدث خطأ في التحليل" },
      { status: 500 },
    );
  }
}
