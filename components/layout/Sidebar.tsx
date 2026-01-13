import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

const items = [
  {
    title: "الرئيسية",
    url: "/",
    icon: Home,
  },
  {
    title: "الخزنة",
    url: "/cash",
    icon: Calendar,
  },
  {
    title: "العملاء",
    url: "/customers",
    icon: Search,
  },
  {
    title: "المدفوعات",
    url: "/payments",
    icon: Settings,
  },
  {
    title: "التقارير",
    url: "/reports",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar side="right">
      <SidebarContent className="bg-gray-800  text-white">
        <SidebarGroup>
          <SidebarGroupLabel className="flex gap-2 justify-center items-center mb-6 text-xl font-bold">
            <h2 className="text-gray-200" >لوحة التحكم </h2>
            <span className="text-gray-200 text-sm "> (إدارة النظام) </span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem className="mb-6" key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
