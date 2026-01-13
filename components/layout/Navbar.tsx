"use client";

import { Bell, Search, User, Settings, HelpCircle, LogOut } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b bg-white px-4 shadow-sm md:px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
        <div className="hidden md:flex relative w-64">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="بحث سريع..."
            className="w-full pr-9 bg-muted/40 border-none focus-visible:ring-1 focus-visible:ring-violet-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground"
        >
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 p-0 text-[10px] text-white">
            3
          </Badge>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="hidden sm:flex text-muted-foreground hover:text-foreground"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>

        <div className="h-8 w-[1px] bg-border mx-1 hidden sm:block"></div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative flex items-center gap-2 px-2 hover:bg-muted/50 transition-colors"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                <User className="h-4 w-4" />
              </div>
              <div className="hidden flex-col items-start text-right sm:flex">
                <span className="text-sm font-semibold leading-none">
                  بلال حسين
                </span>
                <span className="text-[10px] text-muted-foreground">
                  مدير النظام
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-2">
            <DropdownMenuLabel className="text-right">حسابي</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex-row-reverse gap-2 cursor-pointer">
              <User className="h-4 w-4" />
              <span>الملف الشخصي</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex-row-reverse gap-2 cursor-pointer">
              <Settings className="h-4 w-4" />
              <span>الإعدادات</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex-row-reverse gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
              <LogOut className="h-4 w-4" />
              <span>تسجيل الخروج</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
