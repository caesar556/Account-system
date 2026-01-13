"use client";

import { 
  Home, 
  Wallet, 
  Users, 
  Receipt, 
  BarChart3, 
  Settings,
  ChevronLeft,
  LayoutDashboard,
  ShieldCheck,
  CreditCard
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "الرئيسية",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "الخزنة",
    url: "/cash",
    icon: Wallet,
  },
  {
    title: "العملاء",
    url: "/customers",
    icon: Users,
  },
  {
    title: "المدفوعات",
    url: "/payments",
    icon: CreditCard,
  },
  {
    title: "التقارير",
    url: "/reports",
    icon: BarChart3,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar side="right" className="border-l bg-slate-900 text-slate-300">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-900/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-white tracking-tight">نظام الحسابات</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">إصدار 1.0.0</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarSeparator className="bg-slate-800/50" />

      <SidebarContent className="px-4 py-4">
        <SidebarMenu>
          {menuItems.map((item) => {
            const isActive = pathname === item.url;
            return (
              <SidebarMenuItem key={item.title} className="mb-1">
                <SidebarMenuButton 
                  asChild 
                  className={cn(
                    "group relative flex h-11 items-center gap-3 px-3 transition-all duration-200 rounded-lg",
                    isActive 
                      ? "bg-violet-600/10 text-violet-400 font-medium" 
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                  )}
                >
                  <Link href={item.url}>
                    <item.icon className={cn(
                      "h-5 w-5 transition-colors",
                      isActive ? "text-violet-500" : "text-slate-500 group-hover:text-slate-300"
                    )} />
                    <span className="text-[15px]">{item.title}</span>
                    {isActive && (
                      <div className="absolute left-1 h-6 w-1 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="mt-auto p-4">
        <div className="rounded-xl bg-slate-800/40 p-4 border border-slate-700/50">
          <div className="flex flex-col gap-1">
             <div className="flex items-center justify-between text-xs text-slate-500">
                <span>استهلاك المساحة</span>
                <span>65%</span>
             </div>
             <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-700">
                <div className="h-full w-[65%] bg-violet-500" />
             </div>
          </div>
          <Button variant="ghost" size="sm" className="mt-3 w-full justify-start gap-2 h-8 text-[11px] text-slate-400 hover:text-white hover:bg-slate-800 p-0 px-2">
            <Settings className="h-3.5 w-3.5" />
            إعدادات النظام
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
