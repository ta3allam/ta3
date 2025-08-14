import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, BookOpen, GraduationCap, Home } from "lucide-react";
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

const items = [
  { title: "الصفحة الرئيسية", url: "/", icon: Home },
  { title: "لوحة التحكم - المسؤول", url: "/admin", icon: LayoutDashboard },
  { title: "لوحة التحكم - المعلم", url: "/teacher", icon: BookOpen },
  { title: "لوحة التحكم - الطالب", url: "/student", icon: GraduationCap },
];

const AppSidebar = () => {
  const { pathname } = useLocation();

  return (
    <Sidebar collapsible="icon" side="right">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>التنقل</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <NavLink to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
