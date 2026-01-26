"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  FileText,
  TrendingUp,
  Shield,
  RefreshCw,
} from "lucide-react";

interface AIInsightsMainProps {
  treasuryId: string;
}

interface AdviceResponse {
  treasuryId: string;
  generatedAt: string;
  advice: string;
}

function parseAdvice(advice: string) {
  const sections = {
    executiveSummary: "",
    risks: [] as string[],
    recommendations: [] as string[],
  };

  const lines = advice.split("\n").filter((line) => line.trim());

  let currentSection = "";

  for (const line of lines) {
    const lowerLine = line.toLowerCase();

    if (
      lowerLine.includes("executive summary") ||
      line.includes("الملخص التنفيذي") ||
      line.includes("ملخص تنفيذي")
    ) {
      currentSection = "summary";
      continue;
    }
    if (
      lowerLine.includes("financial risk") ||
      line.includes("المخاطر المالية") ||
      line.includes("المخاطر") ||
      lowerLine.includes("risk")
    ) {
      currentSection = "risks";
      continue;
    }
    if (
      lowerLine.includes("recommendation") ||
      line.includes("التوصيات المحاسبية") ||
      line.includes("التوصيات") ||
      lowerLine.includes("accounting")
    ) {
      currentSection = "recommendations";
      continue;
    }

    const cleanLine = line.replace(/^[-•*]\s*/, "").replace(/^\d+\.\s*/, "").replace(/^\*\*.*?\*\*:?\s*/, "").trim();

    if (!cleanLine || cleanLine.startsWith("**")) continue;

    if (currentSection === "summary") {
      sections.executiveSummary += (sections.executiveSummary ? " " : "") + cleanLine;
    } else if (currentSection === "risks") {
      sections.risks.push(cleanLine);
    } else if (currentSection === "recommendations") {
      sections.recommendations.push(cleanLine);
    }
  }

  return sections;
}

export default function AIInsightsMain({ treasuryId }: AIInsightsMainProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adviceData, setAdviceData] = useState<AdviceResponse | null>(null);

  const fetchAdvice = async () => {
    if (!treasuryId) {
      setError("لا يوجد خزينة متاحة للتحليل");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ treasuryId }),
      });

      if (!response.ok) {
        throw new Error("فشل في جلب التحليل المالي");
      }

      const data = await response.json();
      setAdviceData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  const parsedAdvice = adviceData ? parseAdvice(adviceData.advice) : null;

  return (
    <main className="min-h-screen p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg shadow-lg shadow-violet-200">
              <Brain className="h-8 w-8 text-white" />
            </div>
            تحليلات الذكاء الاصطناعي
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">
            احصل على نصائح مالية احترافية مدعومة بالذكاء الاصطناعي
          </p>
        </div>
        <Button
          onClick={fetchAdvice}
          disabled={loading || !treasuryId}
          className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 gap-2 h-12 px-6 text-lg font-bold shadow-lg shadow-violet-200 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              جاري التحليل...
            </>
          ) : adviceData ? (
            <>
              <RefreshCw className="h-5 w-5" />
              تحديث التحليل
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              بدء التحليل المالي
            </>
          )}
        </Button>
      </div>

      {!treasuryId && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="flex items-center gap-3 py-4">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
            <p className="text-amber-800 font-medium">
              لا يوجد خزينة متاحة. يرجى إنشاء خزينة أولاً للحصول على التحليلات.
            </p>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex items-center gap-3 py-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <p className="text-red-800 font-medium">{error}</p>
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-none shadow-lg animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-6 bg-slate-200 rounded w-3/4" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-4 bg-slate-200 rounded" />
                <div className="h-4 bg-slate-200 rounded w-5/6" />
                <div className="h-4 bg-slate-200 rounded w-4/6" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && !adviceData && !error && treasuryId && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="p-6 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full mb-6">
            <Brain className="h-16 w-16 text-violet-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            مستشارك المالي الذكي
          </h2>
          <p className="text-slate-500 max-w-md mb-6">
            اضغط على زر "بدء التحليل المالي" للحصول على تحليل شامل لوضعك المالي
            مع توصيات احترافية مدعومة بالذكاء الاصطناعي
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <FileText className="h-4 w-4 text-violet-500" />
              <span>ملخص تنفيذي</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span>تحليل المخاطر</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>توصيات محاسبية</span>
            </div>
          </div>
        </div>
      )}

      {parsedAdvice && adviceData && (
        <div className="space-y-6 animate-in slide-in-from-bottom duration-700">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <Sparkles className="h-4 w-4 text-violet-500" />
            <span>
              تم إنشاء التقرير في:{" "}
              {new Date(adviceData.generatedAt).toLocaleString("ar-EG", {
                dateStyle: "long",
                timeStyle: "short",
              })}
            </span>
          </div>

          <Card className="border-none shadow-xl bg-gradient-to-br from-violet-600 to-indigo-700 text-white overflow-hidden relative group transition-all hover:shadow-2xl">
            <div className="absolute top-0 left-0 p-4 opacity-10">
              <FileText className="h-32 w-32" />
            </div>
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <FileText className="h-6 w-6" />
                الملخص التنفيذي
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed text-violet-100">
                {parsedAdvice.executiveSummary || "لا يوجد ملخص متاح"}
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-xl bg-white overflow-hidden group transition-all hover:shadow-2xl hover:translate-y-[-2px]">
              <CardHeader className="border-b bg-gradient-to-r from-amber-50 to-orange-50">
                <CardTitle className="text-xl font-bold text-amber-700 flex items-center gap-2">
                  <Shield className="h-6 w-6" />
                  المخاطر المالية
                </CardTitle>
                <CardDescription className="text-amber-600">
                  النقاط التي تحتاج إلى اهتمام
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {parsedAdvice.risks.length > 0 ? (
                  <ul className="space-y-3">
                    {parsedAdvice.risks.map((risk, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 p-3 bg-amber-50/50 rounded-lg border border-amber-100"
                      >
                        <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700">{risk}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500 text-center py-4">
                    لا توجد مخاطر محددة
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-white overflow-hidden group transition-all hover:shadow-2xl hover:translate-y-[-2px]">
              <CardHeader className="border-b bg-gradient-to-r from-emerald-50 to-teal-50">
                <CardTitle className="text-xl font-bold text-emerald-700 flex items-center gap-2">
                  <TrendingUp className="h-6 w-6" />
                  التوصيات المحاسبية
                </CardTitle>
                <CardDescription className="text-emerald-600">
                  خطوات لتحسين الأداء المالي
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {parsedAdvice.recommendations.length > 0 ? (
                  <ul className="space-y-3">
                    {parsedAdvice.recommendations.map((rec, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 p-3 bg-emerald-50/50 rounded-lg border border-emerald-100"
                      >
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500 text-center py-4">
                    لا توجد توصيات محددة
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-lg bg-slate-800 text-white">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <FileText className="h-5 w-5 text-slate-400" />
                التقرير الكامل
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-sm leading-relaxed text-slate-300 font-sans">
                {adviceData.advice}
              </pre>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
