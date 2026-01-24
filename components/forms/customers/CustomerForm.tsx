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
import { useCreateCustomerMutation } from "@/store/customers/customersApi";
import { Loader2 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CustomerFormValues, customerSchema } from "@/lib/validation/customer";

interface CustomerFormProps {
  onSuccess?: () => void;
}

export function CustomerForm({ onSuccess }: CustomerFormProps) {
  const [createCustomer, { isLoading }] = useCreateCustomerMutation();

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      creditLimit: 0,
      openingBalance: 0,
      status: "unpaid",
      category: "regular",
      notes: "",
    },
  } as any);

  async function onSubmit(data: CustomerFormValues) {
    try {
      await createCustomer(data).unwrap();
      form.reset();
      onSuccess?.();
    } catch (error: any) {
      console.error("Error creating customer:", error);
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  اسم العميل *
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="أدخل اسم العميل بالكامل"
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
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  رقم الهاتف
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="01xxxxxxxxx"
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  البريد الإلكتروني
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="example@mail.com"
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
            name="creditLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  الحد الائتماني (ج.م)
                </FormLabel>
                <FormControl>
                  <Input type="number" className="h-10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="openingBalance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>رصيد افتتاحي</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  حالة الدفع
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="unpaid">عليه مديونية</SelectItem>
                    <SelectItem value="paid">خالص (مدفوع)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  تصنيف العميل
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="اختر التصنيف" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="regular">عميل عادي</SelectItem>
                    <SelectItem value="vip">عميل VIP</SelectItem>
                    <SelectItem value="wholesale">جملة</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">العنوان</FormLabel>
              <FormControl>
                <Input
                  placeholder="أدخل العنوان بالتفصيل"
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
                  placeholder="أي تفاصيل أو ملاحظات خاصة بالعميل..."
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
              "حفظ العميل"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
