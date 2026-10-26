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
  Mail,
  ShieldAlert,
  GraduationCap,
  User as UserIcon,
  LogOut,
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
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { getAssetUrl } from "@/lib/assetUtils";

export default function AppSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isCoursePath = pathname.includes("/courses/");
  const isAdminPath = pathname.startsWith("/admin");
  const isCreatorPath = pathname.startsWith("/creator");

  const getRoleBadgeStyle = (role?: string) => {
    switch (role) {
      case "admin":
        return { label: "مشرف النظام", color: "bg-[#6B1F2A] text-white", icon: ShieldAlert };
      case "teacher":
        return { label: "أستاذ المادة", color: "bg-[#428177] text-white", icon: GraduationCap };
      case "creator":
        return { label: "صانع محتوى", color: "bg-[#988561] text-white", icon: Sparkles };
      case "student":
      default:
        return { label: "طالب علم", color: "bg-[#054239] text-[#EDEBE0]", icon: BookOpen };
    }
  };

  const roleInfo = getRoleBadgeStyle(user?.role);
  const RoleIcon = roleInfo.icon;

  // ==========================================
  // 1. Contextual Course View (Strict Isolation)
  // ==========================================
  if (isCoursePath) {
    const roleBase = user?.role === 'teacher' ? "/teacher" : user?.role === 'admin' ? "/admin" : user?.role === 'creator' ? "/creator" : "/student";
    const courseMatch = pathname.match(/(?:student|teacher|admin)?\/courses\/(\d+)/);
    const courseId = courseMatch ? courseMatch[1] : "1";
    // For admin or creator, course base is /courses/:id; for teacher/student it is /:role/courses/:id
    const courseBase = (user?.role === 'admin' || user?.role === 'creator')
      ? `/courses/${courseId}`
      : `${roleBase}/courses/${courseId}`;
    const dashboardUrl = roleBase;

    return (
      <Sidebar collapsible="icon" side="right" className="border-l border-[#428177]/30 bg-[#002623] text-[#EDEBE0]">
        <SidebarHeader className="p-4 border-b border-[#428177]/20 bg-[#054239]/60">
          <SidebarMenuButton
            onClick={() => navigate(dashboardUrl)}
            className="w-full flex items-center gap-2 justify-end bg-[#054239] hover:bg-[#428177] text-white rounded-xl p-2.5 transition-colors font-bold text-xs"
          >
            <span>العودة للوحة التحكم الرئيسية</span>
            <ArrowRight className="h-4 w-4 text-[#EDEBE0]" />
          </SidebarMenuButton>
        </SidebarHeader>

        <SidebarContent className="bg-[#002623] px-2 py-4">
          <SidebarGroup>
            <SidebarGroupLabel className="text-right text-xs font-extrabold text-[#EDEBE0]/60 px-3 py-2">
              قائمة المقرر الدراسي
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === courseBase}>
                    <NavLink
                      to={courseBase}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 justify-end font-bold text-xs py-2.5 px-3 rounded-xl transition-all ${
                          isActive
                            ? "bg-[#428177] text-white shadow-sm"
                            : "text-[#EDEBE0]/80 hover:bg-[#054239] hover:text-white"
                        }`
                      }
                    >
                      <span>الرئيسية والإعلانات</span>
                      <Home className="h-4 w-4 text-[#EDEBE0]" />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === `${courseBase}/timeline`}>
                    <NavLink
                      to={`${courseBase}/timeline`}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 justify-end font-bold text-xs py-2.5 px-3 rounded-xl transition-all ${
                          isActive
                            ? "bg-[#428177] text-white shadow-sm"
                            : "text-[#EDEBE0]/80 hover:bg-[#054239] hover:text-white"
                        }`
                      }
                    >
                      <span>التقويم الأكاديمي</span>
                      <Calendar className="h-4 w-4 text-[#EDEBE0]" />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === `${courseBase}/groups`}>
                    <NavLink
                      to={`${courseBase}/groups`}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 justify-end font-bold text-xs py-2.5 px-3 rounded-xl transition-all ${
                          isActive
                            ? "bg-[#428177] text-white shadow-sm"
                            : "text-[#EDEBE0]/80 hover:bg-[#054239] hover:text-white"
                        }`
                      }
                    >
                      <span>المجموعات الدراسية</span>
                      <Users className="h-4 w-4 text-[#EDEBE0]" />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === `${courseBase}/discussion`}>
                    <NavLink
                      to={`${courseBase}/discussion`}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 justify-end font-bold text-xs py-2.5 px-3 rounded-xl transition-all ${
                          isActive
                            ? "bg-[#428177] text-white shadow-sm"
                            : "text-[#EDEBE0]/80 hover:bg-[#054239] hover:text-white"
                        }`
                      }
                    >
                      <span>ساحة النقاش والاستفسارات</span>
                      <MessageSquare className="h-4 w-4 text-[#EDEBE0]" />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === `${courseBase}/contact`}>
                    <NavLink
                      to={`${courseBase}/contact`}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 justify-end font-bold text-xs py-2.5 px-3 rounded-xl transition-all ${
                          isActive
                            ? "bg-[#428177] text-white shadow-sm"
                            : "text-[#EDEBE0]/80 hover:bg-[#054239] hover:text-white"
                        }`
                      }
                    >
                      <span>التواصل والدعم الأكاديمي</span>
                      <Mail className="h-4 w-4 text-[#EDEBE0]" />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-3 border-t border-[#428177]/20 bg-[#002623] text-center text-[10px] text-[#EDEBE0]/50 font-medium">
          مقرر دراسي نشط • تعلّـم
        </SidebarFooter>
      </Sidebar>
    );
  }

  // ==========================================
  // 2. Global Unified Green Master Sidebar (Desktop)
  // ==========================================
  return (
    <Sidebar collapsible="icon" side="right" className="border-l border-[#428177]/30 bg-[#002623] text-[#EDEBE0]">
      {/* Pinned User Profile Header at Top */}
      <SidebarHeader className="p-4 border-b border-[#428177]/25 bg-[#054239]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Avatar className="w-11 h-11 border-2 border-[#428177] shadow-sm">
            <AvatarImage src={user?.avatar} alt={user?.name || "المستخدم"} />
            <AvatarFallback className="bg-[#428177] text-white font-black text-sm">
              {user?.name?.slice(0, 2) || "تـ"}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1 min-w-0 flex-1 text-right">
            <h3 className="font-extrabold text-sm text-white truncate">
              {user?.name || "مستخدم تعلّم"}
            </h3>
            <div className="flex items-center gap-1.5 justify-end flex-wrap">
              <Badge variant="outline" className={`text-[10px] px-2 py-0.5 rounded-full font-bold border-transparent ${roleInfo.color}`}>
                <RoleIcon className="w-3 h-3 ml-1 inline" />
                {roleInfo.label}
              </Badge>
              <span className="text-[10px] font-bold text-[#988561] bg-[#EDEBE0]/15 px-2 py-0.5 rounded-full">
                المستوى {user?.level || 1} 🔥
              </span>
            </div>
          </div>
        </div>

        {/* Profile Settings Quick Button */}
        <Button
          onClick={() => navigate('/profile')}
          variant="outline"
          size="sm"
          className="w-full mt-3 text-xs font-bold border-[#428177]/40 text-[#EDEBE0] hover:bg-[#428177] hover:text-white rounded-xl bg-transparent transition-colors"
        >
          <UserIcon className="w-3.5 h-3.5 ml-1.5 text-[#EDEBE0]" />
          الملف الشخصي والإعدادات
        </Button>
      </SidebarHeader>

      <SidebarContent className="bg-[#002623] px-2 py-4 space-y-4">
        {/* Primary General Sections */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-right text-[10px] font-extrabold uppercase text-[#EDEBE0]/50 px-3 mb-1">
            الأقسام الرئيسية
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/community"}>
                  <NavLink
                    to="/community"
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 justify-end font-bold text-xs py-2 px-3 rounded-xl transition-all ${
                        isActive
                          ? "bg-[#428177] text-white shadow-sm"
                          : "text-[#EDEBE0]/80 hover:bg-[#054239] hover:text-white"
                      }`
                    }
                  >
                    <span>مجتمع تعلّم</span>
                    <MessageSquare className="h-4 w-4 text-[#EDEBE0]" />
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/marketplace"}>
                  <NavLink
                    to="/marketplace"
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 justify-end font-bold text-xs py-2 px-3 rounded-xl transition-all ${
                        isActive
                          ? "bg-[#428177] text-white shadow-sm"
                          : "text-[#EDEBE0]/80 hover:bg-[#054239] hover:text-white"
                      }`
                    }
                  >
                    <span>سوق الدورات والمقررات</span>
                    <ShoppingBag className="h-4 w-4 text-[#EDEBE0]" />
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/cohorts"}>
                  <NavLink
                    to="/cohorts"
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 justify-end font-bold text-xs py-2 px-3 rounded-xl transition-all ${
                        isActive
                          ? "bg-[#428177] text-white shadow-sm"
                          : "text-[#EDEBE0]/80 hover:bg-[#054239] hover:text-white"
                      }`
                    }
                  >
                    <span>الفعاليات وورش العمل</span>
                    <Radio className="h-4 w-4 text-[#EDEBE0]" />
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Dedicated Role Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-right text-[10px] font-extrabold uppercase text-[#EDEBE0]/50 px-3 mb-1">
            مساحة العمل الخاصة
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {/* Admin Links */}
              {(user?.role === "admin" || isAdminPath) && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/admin"}>
                      <NavLink
                        to="/admin"
                        className={({ isActive }) =>
                          `flex items-center gap-2.5 justify-end font-bold text-xs py-2 px-3 rounded-xl transition-all ${
                            isActive
                              ? "bg-[#6B1F2A] text-white shadow-sm"
                              : "text-[#EDEBE0]/80 hover:bg-[#054239] hover:text-white"
                          }`
                        }
                      >
                        <span>لوحة التحكم والرقابة</span>
                        <LayoutDashboard className="h-4 w-4 text-[#EDEBE0]" />
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/analytics"}>
                      <NavLink
                        to="/analytics"
                        className={({ isActive }) =>
                          `flex items-center gap-2.5 justify-end font-bold text-xs py-2 px-3 rounded-xl transition-all ${
                            isActive
                              ? "bg-[#428177] text-white shadow-sm"
                              : "text-[#EDEBE0]/80 hover:bg-[#054239] hover:text-white"
                          }`
                        }
                      >
                        <span>تحليلات وإحصائيات المنصة</span>
                        <LineChart className="h-4 w-4 text-[#EDEBE0]" />
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}

              {/* Teacher Links */}
              {user?.role === "teacher" && !isAdminPath && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/teacher"}>
                      <NavLink
                        to="/teacher"
                        className={({ isActive }) =>
                          `flex items-center gap-2.5 justify-end font-bold text-xs py-2 px-3 rounded-xl transition-all ${
                            isActive
                              ? "bg-[#428177] text-white shadow-sm"
                              : "text-[#EDEBE0]/80 hover:bg-[#054239] hover:text-white"
                          }`
                        }
                      >
                        <span>لوحة التحكم الأكاديمية</span>
                        <LayoutDashboard className="h-4 w-4 text-[#EDEBE0]" />
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/analytics"}>
                      <NavLink
                        to="/analytics"
                        className={({ isActive }) =>
                          `flex items-center gap-2.5 justify-end font-bold text-xs py-2 px-3 rounded-xl transition-all ${
                            isActive
                              ? "bg-[#428177] text-white shadow-sm"
                              : "text-[#EDEBE0]/80 hover:bg-[#054239] hover:text-white"
                          }`
                        }
                      >
                        <span>تحليلات أداء المساقات</span>
                        <LineChart className="h-4 w-4 text-[#EDEBE0]" />
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}

              {/* Creator Links */}
              {(user?.role === "creator" || isCreatorPath) && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/creator"}>
                      <NavLink
                        to="/creator"
                        className={({ isActive }) =>
                          `flex items-center gap-2.5 justify-end font-bold text-xs py-2 px-3 rounded-xl transition-all ${
                            isActive
                              ? "bg-[#428177] text-white shadow-sm"
                              : "text-[#EDEBE0]/80 hover:bg-[#054239] hover:text-white"
                          }`
                        }
                      >
                        <span>لوحة صانع المحتوى</span>
                        <Sparkles className="h-4 w-4 text-[#EDEBE0]" />
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/creator/payouts"}>
                      <NavLink
                        to="/creator/payouts"
                        className={({ isActive }) =>
                          `flex items-center gap-2.5 justify-end font-bold text-xs py-2 px-3 rounded-xl transition-all ${
                            isActive
                              ? "bg-[#428177] text-white shadow-sm"
                              : "text-[#EDEBE0]/80 hover:bg-[#054239] hover:text-white"
                          }`
                        }
                      >
                        <span>محفظة الأرباح والمستحقات</span>
                        <Wallet className="h-4 w-4 text-[#EDEBE0]" />
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/analytics"}>
                      <NavLink
                        to="/analytics"
                        className={({ isActive }) =>
                          `flex items-center gap-2.5 justify-end font-bold text-xs py-2 px-3 rounded-xl transition-all ${
                            isActive
                              ? "bg-[#428177] text-white shadow-sm"
                              : "text-[#EDEBE0]/80 hover:bg-[#054239] hover:text-white"
                          }`
                        }
                      >
                        <span>إحصائيات المبيعات</span>
                        <LineChart className="h-4 w-4 text-[#EDEBE0]" />
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}

              {/* Student Links */}
              {(user?.role === "student" || (!user && !isAdminPath && !isCreatorPath)) && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/student"}>
                    <NavLink
                      to="/student"
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 justify-end font-bold text-xs py-2 px-3 rounded-xl transition-all ${
                          isActive
                            ? "bg-[#428177] text-white shadow-sm"
                            : "text-[#EDEBE0]/80 hover:bg-[#054239] hover:text-white"
                        }`
                      }
                    >
                      <span>لوحة المقررات والتعلم</span>
                      <BookOpen className="h-4 w-4 text-[#EDEBE0]" />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-[#428177]/25 bg-[#002623] flex items-center justify-between">
        <button
          onClick={() => { logout(); navigate("/"); }}
          className="flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 transition-colors px-2 py-1.5 rounded-lg hover:bg-red-950/30"
        >
          <LogOut className="h-4 w-4" />
          <span>تسجيل الخروج</span>
        </button>
        <span className="text-[10px] text-[#EDEBE0]/50 font-medium">تعلّـم v2.0</span>
      </SidebarFooter>
    </Sidebar>
  );
}
