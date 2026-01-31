"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useTransactionForm } from "@/hooks/forms/useHookForm";
import { TransactionFormStatus } from "./TransactionFormStatus";
import { TransactionFormSkeleton } from "./TransactionFormSkeleton";
import { Loader2 } from "lucide-react";
import { TransactionFormFields } from "./TransactionForm";

interface AddTransactionFormProps {
  defaultCustomerId?: string;
  defaultType?: "DEBIT" | "CREDIT";
  onSuccess?: () => void;
  title?: string;
  description?: string;
}

export default function AddTransactionForm({
  defaultCustomerId,
  defaultType = "DEBIT",
  onSuccess,
  title = "إضافة حركة مالية",
  description = "تسجيل حركة مدين أو دائن",
}: AddTransactionFormProps) {
  const {
    form,
    handleSubmit,
    isSubmitting,
    error,
    success,
    selectedCustomer,
    projectedBalance,
    isNearCreditLimit,
    exceedsCreditLimit,
    loadingTreasuries,
    loadingCustomers,
    treasuries,
    customers,
  } = useTransactionForm({
    defaultCustomerId,
    defaultType,
    onSuccess,
  });

  if (loadingTreasuries || loadingCustomers) {
    return <TransactionFormSkeleton />;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <TransactionFormFields
              //@ts-ignore 
              control={form.control}
              treasuries={treasuries}
              customers={customers}
              selectedCustomer={selectedCustomer}
              projectedBalance={projectedBalance}
              isNearCreditLimit={isNearCreditLimit}
              exceedsCreditLimit={exceedsCreditLimit}
            />

            <TransactionFormStatus
              error={error}
              success={success}
              isSubmitting={isSubmitting}
            />

            <Button
              type="submit"
              disabled={
                isSubmitting || (selectedCustomer ? exceedsCreditLimit : false)
              }
              className="w-full bg-violet-800 "
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                "حفظ الحركة"
              )}
            </Button>

            {selectedCustomer && exceedsCreditLimit && (
              <p className="text-sm text-red-600 text-center">
                لا يمكن إتمام العملية: تتجاوز حد الائتمان
              </p>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
// error here in amount should be fixed in the future 