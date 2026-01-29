"use client";

import { ObligationForm } from "@/components/forms/obligations/ObligationForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Download, Plus } from "lucide-react";

interface ObligationHeaderProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function ObligationHeader({ open, setOpen }: ObligationHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">إدارة الإلتزامات</h1>
        <p className="text-muted-foreground mt-2">
          تابع التزاماتك المالية ومواعيد استحقاقها
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          تصدير
        </Button>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-violet-800 hover:bg-violet-700 transition duration-200">
              <Plus className="h-4 w-4" />
              إضافة إلتزام
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-right mt-6">
                إضافة إلتزام جديد
              </DialogTitle>
            </DialogHeader>
            <ObligationForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
