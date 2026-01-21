"use client";
import { CustomerForm } from "@/components/forms/customers/CustomerForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Download, Plus } from "lucide-react";

interface CustomerHeaderProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function CustomerHeader({ open, setOpen }: CustomerHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">إدارة العملاء</h1>
        <p className="text-muted-foreground mt-2">
          قم بإدارة معلومات عملائك، متابعة الحسابات، وتنظيم الفئات
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          تصدير
        </Button>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              إضافة عميل
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-right">إضافة عميل جديد</DialogTitle>
            </DialogHeader>
            <CustomerForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
