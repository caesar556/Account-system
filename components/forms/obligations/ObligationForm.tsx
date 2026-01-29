"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateObligationMutation } from "@/store/obligations/obligationsApi";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { obligationSchema, ObligationFormValues } from "@/lib/validation/obligation";

interface ObligationFormProps {
  onSuccess?: () => void;
}

export function ObligationForm({ onSuccess }: ObligationFormProps) {
  const [createObligation, { isLoading }] = useCreateObligationMutation();

  const form = useForm<ObligationFormValues>({
    resolver: zodResolver(obligationSchema),
    defaultValues: {
      title: "",
      description: "",
      amount: 0,
      partyName: "",
      dueDate: "",
      notes: "",
    },
  } as any);

  async function onSubmit(data: ObligationFormValues) {
    try {
      await createObligation(data).unwrap();
      form.reset();
      onSuccess?.();
    } catch (error: any) {
      console.error("Error creating obligation:", error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 pt-4"
        dir="rtl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  عنوان الإلتزام *
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="مثال: إيجار المحل"
                    className="h-10"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="partyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  اسم الطرف *
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="مثال: شركة الكهرباء"
                    className="h-10"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  المبلغ (ج.م) *
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    className="h-10"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  تاريخ الاستحقاق *
                </FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    className="h-10"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">الوصف</FormLabel>
              <FormControl>
                <Input
                  placeholder="وصف مختصر للإلتزام"
                  className="h-10"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">
                ملاحظات إضافية
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="أي تفاصيل أو ملاحظات إضافية..."
                  className="min-h-[100px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full md:w-32 h-10 text-base font-medium"
          >
            {isLoading ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                جاري الحفظ
              </>
            ) : (
              "حفظ الإلتزام"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
