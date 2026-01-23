"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertCircle,
  Building,
  CheckCircle,
  CreditCard,
  TrendingUp,
  User,
} from "lucide-react";
import { useCustomers } from "@/hooks/data/useCustomers";
import { Progress } from "@/components/ui/progress";

export default function CustomerStats() {
  const { stats } = useCustomers();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <Card className="bg-gradient-to-br from-background to-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                إجمالي العملاء
              </p>
              <p className="text-2xl font-bold mt-1">{stats.totalCustomers}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
          </div>
          <Progress
            value={(stats.activeCustomers / stats.totalCustomers) * 100}
            className="mt-4"
          />
          <p className="text-xs text-muted-foreground mt-2">
            {stats.activeCustomers} عميل نشط
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-background to-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                إجمالي المديونيات
              </p>
              <p className="text-2xl font-bold mt-1 text-red-600">
                {stats.totalDebt.toLocaleString()} ج.م
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-background to-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                إجمالي الأرصدة
              </p>
              <p className="text-2xl font-bold mt-1 text-green-600">
                {stats.totalCredit.toLocaleString()} ج.م
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-background to-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                عملاء VIP
              </p>
              <p className="text-2xl font-bold mt-1">{stats.vipCustomers}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
              <Building className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-background to-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                الحالة
              </p>
              <div className="flex items-center gap-2 mt-1">
                {stats.activeCustomers === stats.totalCustomers ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-bold text-green-600">
                      جميعهم نشطين
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <span className="font-bold">
                      {stats.totalCustomers - stats.activeCustomers} غير نشطين
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
