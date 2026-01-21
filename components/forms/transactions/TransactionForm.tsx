import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";
import { TransactionInput } from "@/lib/validation/transaction";
import { Banknote, CreditCard, FileText, User, Wallet } from "lucide-react";
import { ICustomer } from "@/lib/types/customer";
import { ITreasury } from "@/lib/types/treasure";

interface TransactionFormFieldsProps {
  control: Control<TransactionInput>;
  treasuries: ITreasury[];
  customers: ICustomer[];
  selectedCustomer: ICustomer | null;
  projectedBalance: number | null;
  isNearCreditLimit: boolean;
  exceedsCreditLimit: boolean;
}

export function TransactionFormFields({
  control,
  treasuries,
  customers,
  selectedCustomer,
  projectedBalance,
  isNearCreditLimit,
  exceedsCreditLimit,
}: TransactionFormFieldsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نوع الحركة</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر النوع" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="DEBIT" className="text-emerald-600">
                    وارد (مقبوضات)
                  </SelectItem>
                  <SelectItem value="CREDIT" className="text-rose-600">
                    صادر (مدفوعات)
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>المبلغ (ج.م)</FormLabel>
              <FormControl>
                <div className="relative">
                  <Banknote className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="pl-10"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>الوصف</FormLabel>
            <FormControl>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  placeholder="اكتب تفاصيل الحركة..."
                  className="pl-10 min-h-[80px]"
                  {...field}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="treasuryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الخزنة</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الخزنة" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {treasuries.map((treasury) => (
                    <SelectItem key={treasury._id} value={treasury._id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{treasury.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {treasury.currentBalance?.toLocaleString()} ج.م
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="customerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <User className="inline h-4 w-4 mr-2" />
                العميل (اختياري)
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر العميل" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="NO_CUSTOMER">بدون عميل</SelectItem>
                  {customers.map((customer) => (
                    <SelectItem key={customer._id} value={customer._id}>
                      <div className="flex items-center justify-between w-full gap-4">
                        <span>{customer.name}</span>
                        <span className="text-xs font-medium">
                          {customer.currentBalance > 0
                            ? `عليه ${customer.currentBalance.toLocaleString()}`
                            : customer.currentBalance < 0
                              ? `له ${Math.abs(customer.currentBalance).toLocaleString()}`
                              : "متوازن"}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {selectedCustomer && (
        <div className="p-4 bg-gray-50 rounded-lg border space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <p className="text-sm text-gray-500">الرصيد الحالي</p>
              <p className="font-semibold">
                {selectedCustomer.currentBalance.toLocaleString()} ج.م
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">حد الائتمان</p>
              <p className="font-semibold">
                {selectedCustomer.creditLimit.toLocaleString()} ج.م
              </p>
            </div>
            {projectedBalance !== null && (
              <>
                <div>
                  <p className="text-sm text-gray-500">الرصيد المتوقع</p>
                  <p
                    className={`font-semibold ${
                      projectedBalance > selectedCustomer.creditLimit
                        ? "text-red-600"
                        : ""
                    }`}
                  >
                    {projectedBalance.toLocaleString()} ج.م
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">الاستخدام</p>
                  <p className="font-semibold">
                    {Math.round(
                      (selectedCustomer.currentBalance /
                        selectedCustomer.creditLimit) *
                        100,
                    )}
                    %
                  </p>
                </div>
              </>
            )}
          </div>

          {isNearCreditLimit && (
            <p className="text-sm text-amber-600">
              ⚠️ العميل قريب من حد الائتمان
            </p>
          )}
          {exceedsCreditLimit && (
            <p className="text-sm text-red-600 font-semibold">
              ❌ هذه الحركة ستتجاوز حد الائتمان المسموح به
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>طريقة الدفع</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="CASH">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-green-600" />
                      <span>نقدي</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="TRANSFER">
                    <div className="flex items-center gap-2">
                      <Banknote className="h-4 w-4 text-orange-700" />
                      <span>تحويل</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="CHEQUE">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-purple-700" />
                      <span>شيك</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="referenceType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نوع المرجع</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="MANUAL">يدوي</SelectItem>
                  <SelectItem value="CUSTOMER_RECORD">سجل عميل</SelectItem>
                  <SelectItem value="ADJUSTMENT">تسوية</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
