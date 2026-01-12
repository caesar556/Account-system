import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "الرئيسية",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "المخزون",
    url: "/inventory",
    icon: Calendar, // Using Calendar as placeholder or replace with appropriate
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
]

export function AppSidebar() {
  return (
    <Sidebar side="right">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>التطبيق</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}