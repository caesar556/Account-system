import { openai } from "@/lib/openai";
import { FinancialAdviceInput } from "@/lib/types/financialTypes";

export class FinancialAdviceService {
  static async generateAdvice(input: FinancialAdviceInput): Promise<string> {
    const prompt = `
     You are a certified financial controller.

     You will receive structured financial indicators.
     Your role is advisory only.
     Do NOT calculate.
     Do NOT invent numbers.
     Do NOT reference system internals.

     Financial Snapshot:
     ${JSON.stringify(input, null, 2)}

     Required Output:
     1. Executive Summary (2 lines)
     2. Financial Risks (bullet points)
     3. Accounting Recommendations (bullet points)

     Tone:
     Professional, clear, concise
     `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    return response.choices[0].message.content || "No advice generated";
  }
}
