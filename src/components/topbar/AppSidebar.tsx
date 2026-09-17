import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Home,
  MessageSquare,
  Calendar,
  Users,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Wallet,
  LineChart,
  Radio,
  BookOpen,
  FileCheck,
  Mail,
  ShieldCheck,
  GraduationCap
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
  SidebarFooter
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { getAssetUrl } from "@/lib/assetUtils";

export default function AppSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isCoursePath = pathname.includes("/courses/");
  const isAdminPath = pathname.startsWith("/admin");
  const isCreatorPath = pathname.startsWith("/creator");

  // ==========================================
  // 1. Contextual Course View (Strict Isolation)
  // ==========================================
  if (isCoursePath) {
    const roleBase = user?.role === 'teacher' ? "/teacher" : user?.role === 'admin' ? "/admin" : "/student";
    const courseMatch = pathname.match(/(?:student|teacher|admin)?\/courses\/(\d+)/);
    const courseId = courseMatch ? courseMatch[1] : "1";
    const courseBase = `${roleBase}/courses/${courseId}`;
    const dashboardUrl = roleBase;

    return (
      <Sidebar collapsible="icon" side="right" className="border-l border-[#428177]/20 bg-white">
        <SidebarHeader className="p-4 border-b border-[#EDEBE0]">
          <SidebarMenuButton
            onClick={() => navigate(dashboardUrl)}
            className="w-full flex items-center gap-2 justify-end bg-[#EDEBE0]/60 hover:bg-[#EDEBE0] text-[#002623] rounded-xl p-2.5 transition-colors font-bold text-xs"
          >
            <span>العودة للوحة التحكم الرئيسية</span>
            <ArrowRight className="h-4 w-4 text-[#428177]" />
          </SidebarMenuButton>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-right text-xs font-extrabold text-[#428177] px-4 py-2">
              قائمة المقرر الدراسي
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === courseBase}>
                    <NavLink to={courseBase} className="flex items-center gap-2.5 justify-end font-bold text-xs py-2">
                      <span>الرئيسية والإعلانات</span>
                      <Home className="h-4 w-4 text-[#428177]" />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === `${courseBase}/timeline`}>
                    <NavLink to={`${courseBase}/timeline`} className="flex items-center gap-2.5 justify-end font-bold text-xs py-2">
                      <span>التقويم الأكاديمي</span>
                      <Calendar className="h-4 w-4 text-[#428177]" />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === `${courseBase}/groups`}>
                    <NavLink to={`${courseBase}/groups`} className="flex items-center gap-2.5 justify-end font-bold text-xs py-2">
                      <span>المجموعات الدراسية</span>
                      <Users className="h-4 w-4 text-[#428177]" />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === `${courseBase}/discussion`}>
                    <NavLink to={`${courseBase}/discussion`} className="flex items-center gap-2.5 justify-end font-bold text-xs py-2">
                      <span>ساحة النقاش والاستفسارات</span>
                      <MessageSquare className="h-4 w-4 text-[#428177]" />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === `${courseBase}/contact`}>
                    <NavLink to={`${courseBase}/contact`} className="flex items-center gap-2.5 justify-end font-bold text-xs py-2">
                      <span>التواصل والدعم الأكاديمي</span>
                      <Mail className="h-4 w-4 text-[#428177]" />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-3 border-t border-[#EDEBE0] text-center text-[10px] text-muted-foreground font-medium">
          مقرر دراسي نشط • تعلّـم
        </SidebarFooter>
      </Sidebar>
    );
  }

  // ==========================================
  // 2. Global Master Control Panel (Overview)
  // ==========================================
  return (
    <Sidebar collapsible="icon" side="right" className="border-l border-[#428177]/20 bg-white">
      <SidebarHeader className="p-4 border-b border-[#EDEBE0] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img src={getAssetUrl('/logo.png')} alt="تعلّم" className="h-7 w-auto" />
          <span className="font-extrabold text-sm text-[#002623]">منصة تعلّـم</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Administrator Global Menu */}
        {(user?.role === 'admin' || isAdminPath) && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-right text-xs font-extrabold text-[#6B1F2A] px-4 py-2">
              لوحة الرقابة والإشراف العام
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/admin"}>
                    <NavLink to="/admin" className="flex items-center gap-2.5 justify-end font-bold text-xs py-2">
                      <span>لوحة التحكم والرقابة</span>
                      <LayoutDashboard className="h-4 w-4 text-[#6B1F2A]" />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/analytics"}>
                    <NavLink to="/analytics" className="flex items-center gap-2.5 justify-end font-bold text-xs py-2">
                      <span>إحصائيات المنصة والتحويل</span>
                      <LineChart className="h-4 w-4 text-[#428177]" />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/community"}>
                    <NavLink to="/community" className="flex items-center gap-2.5 justify-end font-bold text-xs py-2">
                      <span>مجتمع المعرفة</span>
                      <Users className="h-4 w-4 text-[#428177]" />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/marketplace"}>
                    <NavLink to="/marketplace" className="flex items-center gap-2.5 justify-end font-bold text-xs py-2">
                      <span>سوق الدورات والمقررات</span>
                      <ShoppingBag className="h-4 w-4 text-[#428177]" />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/cohorts"}>
                    <NavLink to="/cohorts" className="flex items-center gap-2.5 justify-end font-bold text-xs py-2">
                      <span>الورش والجلسات المباشرة</span>
                      <Radio className="h-4 w-4 text-[#428177]" />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Teacher Global Menu (Academic Instructor - No Wallet) */}
        {user?.role === 'teacher' && !isAdminPath && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-right text-xs font-extrabold text-[#428177] px-4 py-2">
              لوحة الأستاذ وهيئة التدريس
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/teacher"}>
                    <NavLink to="/teacher" className="flex items-center gap-2.5 justify-end font-bold text-xs py-2">
                      <span>لوحة التحكم الأكاديمية</span>
                      <LayoutDashboard className="h-4 w-4 text-[#428177]" />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/analytics"}>
                    <NavLink to="/analytics" className="flex items-center gap-2.5 justify-end font-bold text-xs py-2">
                      <span>تحليلات أداء المساقات</span>
                      <LineChart className="h-4 w-4 text-[#428177]" />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/cohorts"}>
                    <NavLink to="/cohorts" className="flex items-center gap-2.5 justify-end font-bold text-xs py-2">
                      <span>الورش والجلسات المباشرة</span>
                      <Radio className="h-4 w-4 text-[#428177]" />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/community"}>
                    <NavLink to="/community" className="flex items-center gap-2.5 justify-end font-bold text-xs py-2">
                      <span>مجتمع المعرفة والنقاش</span>
                      <Users className="h-4 w-4 text-[#428177]" />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/marketplace"}>
                    <NavLink to="/marketplace" className="flex items-center gap-2.5 justify-end font-bold text-xs py-2">
                      <span>سوق الدورات التعليمية</span>
                      <ShoppingBag className="h-4 w-4 text-[#428177]" />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Creator Studio & Wallet Menu (Only for Creator pages or Independent Creators) */}
        {isCreatorPath && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-right text-xs font-extrabold text-[#988561] px-4 py-2">
              استوديو صانع المحتوى المستقل
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/creator"}>
                    <NavLink to="/creator" className="flex items-center gap-2.5 justify-end font-bold text-xs py-2">
                      <span>لوحة صانع المحتوى</span>
                      <Sparkles className="h-4 w-4 text-[#428177]" />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/creator/payouts"}>
                    <NavLink to="/creator/payouts" className="flex items-center gap-2.5 justify-end font-bold text-xs py-2">
                      <span>محفظة الأرباح والمستحقات</span>
                      <Wallet className="h-4 w-4 text-[#428177]" />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/analytics"}>
                    <NavLink to="/analytics" className="flex items-center gap-2.5 justify-end font-bold text-xs py-2">
                      <span>إحصائيات المبيعات والتحويل</span>
                      <LineChart className="h-4 w-4 text-[#428177]" />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Student Global Menu */}
        {(user?.role === 'student' || (!user && !isAdminPath)) && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-right text-xs font-extrabold text-[#428177] px-4 py-2">
              لوحة التعلم والتفاعل
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/student" || pathname === "/"}>
                    <NavLink to="/student" className="flex items-center gap-2.5 justify-end font-bold text-xs py-2">
                      <span>لوحة التحكم ومقرراتي</span>
                      <Home className="h-4 w-4 text-[#428177]" />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/community"}>
                    <NavLink to="/community" className="flex items-center gap-2.5 justify-end font-bold text-xs py-2">
                      <span>مجتمع المعرفة التفاعلي</span>
                      <Users className="h-4 w-4 text-[#428177]" />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/marketplace"}>
                    <NavLink to="/marketplace" className="flex items-center gap-2.5 justify-end font-bold text-xs py-2">
                      <span>سوق الدورات والمقررات</span>
                      <ShoppingBag className="h-4 w-4 text-[#428177]" />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/cohorts"}>
                    <NavLink to="/cohorts" className="flex items-center gap-2.5 justify-end font-bold text-xs py-2">
                      <span>الورش والجلسات المباشرة</span>
                      <Radio className="h-4 w-4 text-[#428177]" />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-[#EDEBE0] flex flex-col gap-1 text-right text-[11px]">
        <div className="flex items-center justify-between text-[#002623] font-bold">
          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            متصل الآن
          </span>
          <span className="truncate">{user?.name || "زائر"}</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
