import { useRef } from "react";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useFormState, useFormStatus } from "react-dom";
import { createTransaction } from "@/app/(root)/cash/actions";
import { 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Banknote, 
  Check, 
  CreditCard, 
  FileText, 
  Loader2, 
  PlusCircle, 
  Wallet 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const initialState = {
  success: false,
  errors: {} as Record<string, string[]>,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full h-12 text-lg font-bold bg-violet-600 hover:bg-violet-700 shadow-md transition-all active:scale-95"
    >
      {pending ? (
        <>
          <Loader2 className="ml-2 h-5 w-5 animate-spin" />
          جاري الحفظ...
        </>
      ) : (
        "حفظ المعاملة"
      )}
    </Button>
  );
}

export default function AddTransactionForm() {
  const [state, formAction] = useFormState(createTransaction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

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
        <form ref={formRef} action={formAction} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                نوع المعاملة
              </Label>
              <Select name="type" required>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="اختر النوع" />
                </SelectTrigger>
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
              {state.errors?.type && (
                <p className="text-xs font-medium text-destructive">{state.errors.type[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="flex items-center gap-1.5">
                المبلغ
              </Label>
              <div className="relative">
                <Banknote className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="pl-10 h-11 text-lg font-semibold"
                  min={0.01}
                  required
                />
              </div>
              {state.errors?.amount && (
                <p className="text-xs font-medium text-destructive">{state.errors.amount[0]}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-1.5">
              الوصف / البيان
            </Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                id="description"
                name="description"
                placeholder="اكتب تفاصيل المعاملة هنا..."
                className="pl-10 h-11"
                required
              />
            </div>
            {state.errors?.description && (
              <p className="text-xs font-medium text-destructive">
                {state.errors.description[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              طريقة الدفع
            </Label>
            <Select name="method" defaultValue="CASH">
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
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
            {state.errors?.method && (
              <p className="text-xs font-medium text-destructive">{state.errors.method[0]}</p>
            )}
          </div>

          {state.errors?._form && (
            <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
              <p className="text-sm font-medium text-destructive text-center">
                {state.errors._form[0]}
              </p>
            </div>
          )}

          {state.success && (
            <div className="p-3 rounded-md bg-green-50 border border-green-200 flex items-center justify-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <p className="text-sm font-medium text-green-700">
                تم حفظ المعاملة بنجاح
              </p>
            </div>
          )}

          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
