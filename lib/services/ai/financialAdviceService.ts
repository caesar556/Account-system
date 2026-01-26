import { openai } from "@/lib/openai";
import { FinancialAdviceInput } from "@/lib/types/financialTypes";

export class FinancialAdviceService {
  static async generateAdvice(input: FinancialAdviceInput): Promise<string> {
    const prompt = `
     أنت مراقب مالي معتمد ومستشار محاسبي محترف.

     ستتلقى مؤشرات مالية منظمة.
     دورك استشاري فقط.
     لا تقم بأي حسابات.
     لا تختلق أرقاماً.
     لا تذكر تفاصيل النظام الداخلية.

     البيانات المالية:
     ${JSON.stringify(input, null, 2)}

     المخرجات المطلوبة:
     1. الملخص التنفيذي (سطرين)
     2. المخاطر المالية (نقاط)
     3. التوصيات المحاسبية (نقاط)

     الأسلوب:
     احترافي، واضح، موجز
     يجب أن يكون الرد باللغة العربية بالكامل
     `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    return response.choices[0].message.content || "No advice generated";
  }
}
