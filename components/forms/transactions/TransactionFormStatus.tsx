import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Check } from "lucide-react";

interface TransactionFormStatusProps {
  error: string | null;
  success: boolean;
  isSubmitting: boolean;
}

export function TransactionFormStatus({
  error,
  success,
  isSubmitting,
}: TransactionFormStatusProps) {
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (success) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <Check className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          تم حفظ الحركة المالية بنجاح
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}
