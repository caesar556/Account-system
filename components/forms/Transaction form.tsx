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

export default function AddTransactionForm() {
  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>إضافة معاملة جديدة </CardTitle>
      </CardHeader>

      <CardContent>
        <form className="space-y-4">
          {/* Type */}
          <div className="space-y-1">
            <Label htmlFor="type">نوع المعاملة</Label>
            <Select name="type" required>
              <SelectTrigger id="type">
                <SelectValue placeholder="أختر نوع المعاملة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CASH-IN"> داخل </SelectItem>
                <SelectItem value="CASH-OUT">خارج </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="amount">المبلغ</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              placeholder="أدخل المبلغ"
              required
              min={1}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="description">وصف</Label>
            <Input
              id="description"
              name="description"
              placeholder="سبب خروج أو دخول المعاملة ?"
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="method">وسيلة الدفع </Label>
            <Select name="method" defaultValue="CASH">
              <SelectTrigger id="method">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CASH">كاش</SelectItem>
                <SelectItem value="TRANSFER">نقل</SelectItem>
                <SelectItem value="CHEQUE">شيك</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full bg-violet-800 hover:bg-violet-700"
          >
            أحفظ المعاملة
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
