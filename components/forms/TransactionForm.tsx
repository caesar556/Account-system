"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormState } from "react-dom";
import { createTransaction } from "@/app/(root)/cash/actions";

const initialState = {
  success: false,
  errors: {} as Record<string, string[]>,
};

export default function AddTransactionForm() {
  const [state, formAction] = useFormState(createTransaction, initialState);

  return (
    <Card className="w-full" dir="rtl">
      <CardHeader>
        <CardTitle>إضافة معاملة جديدة</CardTitle>
      </CardHeader>

      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-1">
            <Label>نوع المعاملة</Label>
            <Select name="type">
              <SelectTrigger>
                <SelectValue placeholder="اختر نوع المعاملة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IN">داخل</SelectItem>
                <SelectItem value="OUT">خارج</SelectItem>
              </SelectContent>
            </Select>
            {state.errors?.type && (
              <p className="text-sm text-red-600">{state.errors.type[0]}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="amount">المبلغ</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              placeholder="أدخل المبلغ"
              min={1}
            />
            {state.errors?.amount && (
              <p className="text-sm text-red-600">{state.errors.amount[0]}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="description">الوصف</Label>
            <Input
              id="description"
              name="description"
              placeholder="سبب الدخول أو الخروج"
            />
            {state.errors?.description && (
              <p className="text-sm text-red-600">
                {state.errors.description[0]}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label>وسيلة الدفع</Label>
            <Select name="method" defaultValue="CASH">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CASH">كاش</SelectItem>
                <SelectItem value="TRANSFER">تحويل</SelectItem>
                <SelectItem value="CHEQUE">شيك</SelectItem>
              </SelectContent>
            </Select>
            {state.errors?.method && (
              <p className="text-sm text-red-600">{state.errors.method[0]}</p>
            )}
          </div>

          {state.errors?._form && (
            <p className="text-sm text-red-600 text-center">
              {state.errors._form[0]}
            </p>
          )}

          {state.success && (
            <p className="text-sm text-green-600 text-center">
              تم حفظ المعاملة بنجاح
            </p>
          )}

          <Button
            type="submit"
            className="w-full bg-violet-800 hover:bg-violet-700"
          >
            حفظ المعاملة
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
