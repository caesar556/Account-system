"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Calendar,
  CheckCircle2,
  CreditCard,
  MoreVertical,
  RotateCcw,
  Trash2,
  User,
} from "lucide-react";
import {
  useGetObligationsQuery,
  useMarkObligationDoneMutation,
  useReopenObligationMutation,
  useDeleteObligationMutation,
} from "@/store/obligations/obligationsApi";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Obligation } from "@/lib/types/obligation";

interface ObligationTableProps {
  filter: "all" | "OPEN" | "DONE" | "overdue";
}

export default function ObligationTable({ filter }: ObligationTableProps) {
  const queryParams = filter === "all" 
    ? undefined 
    : filter === "overdue" 
      ? { overdue: true } 
      : { status: filter as "OPEN" | "DONE" };
  
  const { data: obligations = [], isLoading } = useGetObligationsQuery(queryParams);
  const [markDone] = useMarkObligationDoneMutation();
  const [reopenObligation] = useReopenObligationMutation();
  const [deleteObligation] = useDeleteObligationMutation();
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedObligation, setSelectedObligation] = useState<Obligation | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isOverdue = (dueDate: string, status: string) => {
    return status === "OPEN" && new Date(dueDate) < new Date();
  };

  const handleMarkDone = async (id: string) => {
    try {
      await markDone(id).unwrap();
    } catch (error) {
      console.error("Error marking obligation as done:", error);
    }
  };

  const handleReopen = async (id: string) => {
    try {
      await reopenObligation(id).unwrap();
    } catch (error) {
      console.error("Error reopening obligation:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedObligation) return;
    try {
      await deleteObligation(selectedObligation._id).unwrap();
      setDeleteDialogOpen(false);
      setSelectedObligation(null);
    } catch (error) {
      console.error("Error deleting obligation:", error);
    }
  };

  const confirmDelete = (obligation: Obligation) => {
    setSelectedObligation(obligation);
    setDeleteDialogOpen(true);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-[200px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2 p-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <CardTitle>قائمة الإلتزامات</CardTitle>
              <CardDescription className="mt-1">
                {obligations.length} إلتزام
                {filter !== "all" && ` - تصفية: ${
                  filter === "OPEN" ? "مفتوحة" : 
                  filter === "DONE" ? "مكتملة" : 
                  "متأخرة"
                }`}
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-base px-3 py-1">
              {obligations.length} إلتزام
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-right w-[250px]">الإلتزام</TableHead>
                  <TableHead className="text-right">الطرف</TableHead>
                  <TableHead className="text-right">المبلغ</TableHead>
                  <TableHead className="text-right">تاريخ الاستحقاق</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-left">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {obligations.length > 0 ? (
                  obligations.map((obligation) => {
                    const overdue = isOverdue(obligation.dueDate, obligation.status);
                    
                    return (
                      <TableRow
                        key={obligation._id}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <TableCell className="py-4">
                          <div className="flex flex-col">
                            <div className="font-bold text-base">
                              {obligation.title}
                            </div>
                            {obligation.description && (
                              <div className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
                                {obligation.description}
                              </div>
                            )}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {obligation.partyName}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="font-bold text-base text-red-600">
                            {obligation.amount.toLocaleString()} ج.م
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className={`h-4 w-4 ${overdue ? "text-red-500" : "text-muted-foreground"}`} />
                            <span className={overdue ? "text-red-600 font-semibold" : ""}>
                              {formatDate(obligation.dueDate)}
                            </span>
                          </div>
                          {overdue && (
                            <Badge variant="destructive" className="mt-1 text-[10px]">
                              متأخر
                            </Badge>
                          )}
                        </TableCell>

                        <TableCell>
                          {obligation.status === "DONE" ? (
                            <Badge className="bg-green-100 text-green-700 border-green-200">
                              <CheckCircle2 className="h-3 w-3 ml-1" />
                              مكتمل
                            </Badge>
                          ) : (
                            <Badge 
                              variant="outline" 
                              className={overdue 
                                ? "bg-red-50 text-red-700 border-red-200" 
                                : "bg-blue-50 text-blue-700 border-blue-200"
                              }
                            >
                              مفتوح
                            </Badge>
                          )}
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2 justify-end px-2">
                            {obligation.status === "OPEN" ? (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50 font-bold"
                                onClick={() => handleMarkDone(obligation._id)}
                              >
                                <CheckCircle2 className="ml-1.5 h-4 w-4" />
                                إتمام
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-bold"
                                onClick={() => handleReopen(obligation._id)}
                              >
                                <RotateCcw className="ml-1.5 h-4 w-4" />
                                إعادة فتح
                              </Button>
                            )}

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start">
                                <DropdownMenuLabel>
                                  خيارات الإلتزام
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-red-600 text-right"
                                  onClick={() => confirmDelete(obligation)}
                                >
                                  <Trash2 className="h-4 w-4 ml-2" />
                                  حذف
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-20">
                      <div className="flex flex-col items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                          <CreditCard className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-medium">لا توجد إلتزامات</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            لم يتم إضافة أي إلتزامات بعد
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right">
              هل أنت متأكد من حذف هذا الإلتزام؟
            </AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              سيتم حذف الإلتزام &quot;{selectedObligation?.title}&quot; بشكل نهائي ولا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-2">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
