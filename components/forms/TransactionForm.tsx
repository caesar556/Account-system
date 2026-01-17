"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  transactionSchema,
  type TransactionInput,
} from "@/lib/validation/transaction";
import {
  useCreateTransactionMutation,
} from "@/store/transactions/transactionsApi";
import { useGetTreasuriesQuery } from "@/store/treasuries/treasuriesApi";
import { useGetCustomersQuery } from "@/store/customers/customersApi";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Banknote,
  Check,
  CreditCard,
  FileText,
  Loader2,
  PlusCircle,
  User,
  Wallet,
} from "lucide-react";

export default function AddTransactionForm() {
  const [createTransaction, { isLoading: isSubmitting }] = useCreateTransactionMutation();
  const { data: treasuriesData } = useGetTreasuriesQuery();
  const { data: customersData } = useGetCustomersQuery();
  const treasuries = treasuriesData || [];
  const customers = customersData || [];
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "IN",
      amount: 0,
      description: "",
      method: "CASH",
      reason: "OTHER",
      treasuryId: "",
      customerId: "",
    },
  });

  async function onSubmit(data: TransactionInput) {
    setSuccess(false);
    setError(null);
    try {
      const payload = {
        ...data,
        customerId: data.customerId === "none" ? null : data.customerId
      };
      await createTransaction(payload).unwrap();
      setSuccess(true);
      form.reset();
    } catch (err: any) {
      setError(err?.data?.error || err.message || "حدث خطأ غير متوقع");
    }
  }

  return (
    <Card className="w-full shadow-lg border-2" dir="rtl">
      <CardHeader className="bg-muted/30 pb-4">
        <div className="flex items-center gap-2">
          <PlusCircle className="h-5 w-5 text-violet-600" />
          <div>
            <CardTitle className="text-xl">إضافة معاملة جديدة</CardTitle>
            <CardDescription>تسجيل حركة دخول أو خروج نقدية</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }: { field: any }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="flex items-center gap-1.5">
                      نوع المعاملة
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="اختر النوع" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="IN">
                          <div className="flex items-center gap-2 text-green-600 font-medium">
                            <ArrowUpCircle className="h-4 w-4" />
                            <span>وارد</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="OUT">
                          <div className="flex items-center gap-2 text-red-600 font-medium">
                            <ArrowDownCircle className="h-4 w-4" />
                            <span>صادر</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reason"
                render={({ field }: { field: any }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="flex items-center gap-1.5">
                      السبب
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="اختر السبب" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="DEAL_PAYMENT">دفعة صفقة</SelectItem>
                        <SelectItem value="EXPENSE">مصروفات</SelectItem>
                        <SelectItem value="WITHDRAW">سحب</SelectItem>
                        <SelectItem value="DEPOSIT">إيداع</SelectItem>
                        <SelectItem value="ADJUSTMENT">تسوية</SelectItem>
                        <SelectItem value="OTHER">أخرى</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }: { field: any }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="flex items-center gap-1.5">
                      المبلغ
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Banknote className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="pl-10 h-11 text-lg font-semibold"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }: { field: any }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-1.5">
                    الوصف / البيان
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        placeholder="اكتب تفاصيل المعاملة هنا..."
                        className="pl-10 h-11"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs font-medium" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="treasuryId"
                render={({ field }: { field: any }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="flex items-center gap-1.5">
                      الخزنة
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="اختر الخزنة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {treasuries.map((t) => (
                          <SelectItem key={t._id} value={t._id}>
                            {t.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerId"
                render={({ field }: { field: any }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="flex items-center gap-1.5">
                      <User className="h-4 w-4" />
                      العميل (اختياري)
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="اختر العميل" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">بدون عميل</SelectItem>
                        {customers.map((c) => (
                          <SelectItem key={c._id} value={c._id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="method"
              render={({ field }: { field: any }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-1.5">
                    طريقة الدفع
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CASH">
                        <div className="flex items-center gap-2">
                          <Wallet className="h-4 w-4 text-orange-500" />
                          <span>نقدي (كاش)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="TRANSFER">
                        <div className="flex items-center gap-2">
                          <Banknote className="h-4 w-4 text-blue-500" />
                          <span>تحويل بنكي</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="CHEQUE">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-purple-500" />
                          <span>شيك</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs font-medium" />
                </FormItem>
              )}
            />

            {error && (
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                <p className="text-sm font-medium text-destructive text-center">
                  {error}
                </p>
              </div>
            )}

            {success && (
              <div className="p-3 rounded-md bg-green-50 border border-green-200 flex items-center justify-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <p className="text-sm font-medium text-green-700">
                  تم حفظ المعاملة بنجاح
                </p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 text-lg font-bold bg-violet-600 hover:bg-violet-700 shadow-md transition-all active:scale-95"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                "حفظ المعاملة"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
