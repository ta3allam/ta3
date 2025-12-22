import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Home,
  MessageSquare,
  Calendar,
  Users,
  ArrowRight
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";

const AppSidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isCoursePath = pathname.includes("/courses/");
  const isDashboardPath = pathname === "/student" || pathname === "/teacher";
  const isAdminPath = pathname.startsWith("/admin");

  // Don't show sidebar for student/teacher on dashboard as requested
  if ((user?.role === 'student' || user?.role === 'teacher') && isDashboardPath) {
    return null;
  }

  // Admin always sees the sidebar (as the request says ignore admin for now, keeping it basic)
  if (user?.role === 'admin' || isAdminPath) {
    return (
      <Sidebar collapsible="icon" side="right">
        <SidebarHeader className="p-4 flex items-center justify-center">
          <h2 className="font-bold text-xl">تعلّم</h2>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-right">الإدارة</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/admin"}>
                    <NavLink to="/admin" className="flex items-center gap-2 justify-end">
                      <span>لوحة التحكم</span>
                      <LayoutDashboard className="h-4 w-4" />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
  }

  // Inside a course view for student/teacher
  if (isCoursePath) {
    const dashboardUrl = user?.role === 'teacher' ? "/teacher" : "/student";
    const courseMatch = pathname.match(/\/courses\/(\d+)/);
    const courseId = courseMatch ? courseMatch[1] : "";
    const roleBase = user?.role === 'teacher' ? "/teacher" : "/student";
    const courseBase = `${roleBase}/courses/${courseId}`;

    return (
      <Sidebar collapsible="icon" side="right">
        <SidebarHeader className="p-4 border-b">
          <SidebarMenuButton onClick={() => navigate(dashboardUrl)} className="w-full flex items-center gap-2 justify-end hover:bg-accent rounded-md p-2 transition-colors">
            <span className="font-semibold">العودة للوحة التحكم</span>
            <ArrowRight className="h-5 w-5" />
          </SidebarMenuButton>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-right">قائمة المقرر</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === courseBase}>
                    <NavLink to={courseBase} className="flex items-center gap-2 justify-end">
                      <span>الرئيسية</span>
                      <Home className="h-4 w-4" />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {user?.role === 'student' && (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === `${courseBase}/contact`}>
                      <NavLink to={`${courseBase}/contact`} className="flex items-center gap-2 justify-end">
                        <span>التواصل مع المعلم</span>
                        <MessageSquare className="h-4 w-4" />
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}

                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === `${courseBase}/timeline`}>
                    <NavLink to={`${courseBase}/timeline`} className="flex items-center gap-2 justify-end">
                      <span>الجدول الزمني</span>
                      <Calendar className="h-4 w-4" />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === `${courseBase}/groups`}>
                    <NavLink to={`${courseBase}/groups`} className="flex items-center gap-2 justify-end">
                      <span>المجموعات</span>
                      <Users className="h-4 w-4" />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === `${courseBase}/discussion`}>
                    <NavLink to={`${courseBase}/discussion`} className="flex items-center gap-2 justify-end">
                      <span>النقاشات</span>
                      <MessageSquare className="h-4 w-4" />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar collapsible="icon" side="right">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-right">التنقل</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/"}>
                  <NavLink to="/" className="flex items-center gap-2 justify-end">
                    <span>الرئيسية</span>
                    <Home className="h-4 w-4" />
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
