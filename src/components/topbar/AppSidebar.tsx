import React from "react";
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
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarNavItemProps {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isActive: boolean;
  activeColor?: string;
  isCollapsed: boolean;
}

function SidebarNavItem({
  to,
  icon: Icon,
  label,
  isActive,
  activeColor = "bg-[#428177]",
  isCollapsed,
}: SidebarNavItemProps) {
  const content = (
    <NavLink
      to={to}
      title={isCollapsed ? label : undefined}
      className={`flex items-center gap-2.5 font-bold text-xs rounded-xl transition-all ${
        isCollapsed
          ? "justify-center w-9 h-9 p-0 mx-auto"
          : "justify-end py-2 px-3 w-full"
      } ${
        isActive
          ? `${activeColor} text-white shadow-sm`
          : "text-[#EDEBE0]/80 hover:bg-[#054239] hover:text-white"
      }`}
    >
      {!isCollapsed && <span className="truncate">{label}</span>}
      <Icon className={`h-4 w-4 text-[#EDEBE0] shrink-0 ${isCollapsed ? "mx-auto" : ""}`} />
    </NavLink>
  );

  if (isCollapsed) {
    return (
      <SidebarMenuItem className="flex justify-center my-0.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full flex justify-center py-0.5">
              {content}
            </div>
          </TooltipTrigger>
          <TooltipContent
            side="left"
            align="center"
            className="bg-[#002623] text-white border border-[#428177]/40 shadow-xl font-bold text-xs z-50 px-3 py-1.5"
          >
            {label}
          </TooltipContent>
        </Tooltip>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      {content}
    </SidebarMenuItem>
  );
}

export default function AppSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

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
    const courseBase = (user?.role === 'admin' || user?.role === 'creator')
      ? `/courses/${courseId}`
      : `${roleBase}/courses/${courseId}`;
    const dashboardUrl = roleBase;

    return (
      <Sidebar collapsible="icon" side="right" className="border-l border-[#428177]/30 bg-[#002623] text-[#EDEBE0]">
        <SidebarHeader className={`border-b border-[#428177]/20 bg-[#054239]/60 overflow-hidden ${
          isCollapsed ? "p-2 flex flex-col items-center justify-center" : "p-4"
        }`}>
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => navigate(dashboardUrl)}
                  className="w-9 h-9 mx-auto flex items-center justify-center bg-[#054239] hover:bg-[#428177] text-white rounded-xl transition-colors cursor-pointer"
                  aria-label="العودة للوحة التحكم الرئيسية"
                >
                  <ArrowRight className="h-4 w-4 text-[#EDEBE0] rotate-180" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left" align="center" className="bg-[#002623] text-white border border-[#428177]/40 font-bold text-xs px-3 py-1.5">
                العودة للوحة التحكم الرئيسية
              </TooltipContent>
            </Tooltip>
          ) : (
            <button
              onClick={() => navigate(dashboardUrl)}
              className="w-full flex items-center gap-2 justify-end bg-[#054239] hover:bg-[#428177] text-white rounded-xl p-2.5 transition-colors font-bold text-xs"
            >
              <span>العودة للوحة التحكم الرئيسية</span>
              <ArrowRight className="h-4 w-4 text-[#EDEBE0]" />
            </button>
          )}
        </SidebarHeader>

        <SidebarContent className="bg-[#002623] px-2 py-4 overflow-x-hidden">
          <SidebarGroup>
            {!isCollapsed && (
              <SidebarGroupLabel className="text-right text-xs font-extrabold text-[#EDEBE0]/60 px-3 py-2">
                قائمة المقرر الدراسي
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                <SidebarNavItem
                  to={courseBase}
                  icon={Home}
                  label="الرئيسية والإعلانات"
                  isActive={pathname === courseBase}
                  isCollapsed={isCollapsed}
                />
                <SidebarNavItem
                  to={`${courseBase}/timeline`}
                  icon={Calendar}
                  label="التقويم الأكاديمي"
                  isActive={pathname === `${courseBase}/timeline`}
                  isCollapsed={isCollapsed}
                />
                <SidebarNavItem
                  to={`${courseBase}/groups`}
                  icon={Users}
                  label="المجموعات الدراسية"
                  isActive={pathname === `${courseBase}/groups`}
                  isCollapsed={isCollapsed}
                />
                <SidebarNavItem
                  to={`${courseBase}/discussion`}
                  icon={MessageSquare}
                  label="ساحة النقاش والاستفسارات"
                  isActive={pathname === `${courseBase}/discussion`}
                  isCollapsed={isCollapsed}
                />
                <SidebarNavItem
                  to={`${courseBase}/contact`}
                  icon={Mail}
                  label="التواصل والدعم الأكاديمي"
                  isActive={pathname === `${courseBase}/contact`}
                  isCollapsed={isCollapsed}
                />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className={`border-t border-[#428177]/20 bg-[#002623] overflow-hidden ${
          isCollapsed ? "p-2 flex items-center justify-center" : "p-3 text-center text-[10px] text-[#EDEBE0]/50 font-medium"
        }`}>
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-2.5 h-2.5 rounded-full bg-[#428177] mx-auto animate-pulse" />
              </TooltipTrigger>
              <TooltipContent side="left" className="bg-[#002623] text-white border border-[#428177]/40 font-bold text-xs px-2.5 py-1">
                مقرر دراسي نشط
              </TooltipContent>
            </Tooltip>
          ) : (
            <span>مقرر دراسي نشط • تعلّـم</span>
          )}
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
      <SidebarHeader className={`border-b border-[#428177]/25 bg-[#054239]/80 backdrop-blur-md transition-all overflow-hidden ${
        isCollapsed ? "p-2 flex flex-col items-center justify-center" : "p-4"
      }`}>
        {isCollapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => navigate('/profile')}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:ring-2 hover:ring-[#428177] transition-all p-0.5 focus:outline-none cursor-pointer"
                aria-label="الملف الشخصي"
              >
                <Avatar className="w-8 h-8 border-2 border-[#428177] shadow-sm shrink-0">
                  <AvatarImage src={user?.avatar} alt={user?.name || "المستخدم"} />
                  <AvatarFallback className="bg-[#428177] text-white font-black text-xs">
                    {user?.name?.slice(0, 2) || "تـ"}
                  </AvatarFallback>
                </Avatar>
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" align="center" className="bg-[#002623] text-white border border-[#428177]/40 font-bold text-xs px-3 py-1.5 shadow-xl">
              <div className="flex flex-col items-center gap-1 text-center">
                <span className="font-bold">{user?.name || "مستخدم تعلّم"}</span>
                <span className="text-[10px] text-[#988561] font-extrabold">المستوى {user?.level || 1} 🔥</span>
              </div>
            </TooltipContent>
          </Tooltip>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <Avatar className="w-11 h-11 border-2 border-[#428177] shadow-sm shrink-0">
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
          </>
        )}
      </SidebarHeader>

      <SidebarContent className="bg-[#002623] px-2 py-4 space-y-4 overflow-x-hidden">
        {/* Primary General Sections */}
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-right text-[10px] font-extrabold uppercase text-[#EDEBE0]/50 px-3 mb-1">
              الأقسام الرئيسية
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              <SidebarNavItem
                to="/community"
                icon={MessageSquare}
                label="مجتمع تعلّم"
                isActive={pathname === "/community"}
                isCollapsed={isCollapsed}
              />
              <SidebarNavItem
                to="/marketplace"
                icon={ShoppingBag}
                label="سوق الدورات والمقررات"
                isActive={pathname === "/marketplace"}
                isCollapsed={isCollapsed}
              />
              <SidebarNavItem
                to="/cohorts"
                icon={Radio}
                label="الفعاليات وورش العمل"
                isActive={pathname === "/cohorts"}
                isCollapsed={isCollapsed}
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Dedicated Role Section */}
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-right text-[10px] font-extrabold uppercase text-[#EDEBE0]/50 px-3 mb-1">
              مساحة العمل الخاصة
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {/* Admin Links */}
              {(user?.role === "admin" || isAdminPath) && (
                <>
                  <SidebarNavItem
                    to="/admin"
                    icon={LayoutDashboard}
                    label="لوحة التحكم والرقابة"
                    isActive={pathname === "/admin"}
                    activeColor="bg-[#6B1F2A]"
                    isCollapsed={isCollapsed}
                  />
                  <SidebarNavItem
                    to="/analytics"
                    icon={LineChart}
                    label="تحليلات وإحصائيات المنصة"
                    isActive={pathname === "/analytics"}
                    isCollapsed={isCollapsed}
                  />
                </>
              )}

              {/* Teacher Links */}
              {user?.role === "teacher" && !isAdminPath && (
                <>
                  <SidebarNavItem
                    to="/teacher"
                    icon={LayoutDashboard}
                    label="لوحة التحكم الأكاديمية"
                    isActive={pathname === "/teacher"}
                    isCollapsed={isCollapsed}
                  />
                  <SidebarNavItem
                    to="/analytics"
                    icon={LineChart}
                    label="تحليلات أداء المساقات"
                    isActive={pathname === "/analytics"}
                    isCollapsed={isCollapsed}
                  />
                </>
              )}

              {/* Creator Links */}
              {(user?.role === "creator" || isCreatorPath) && (
                <>
                  <SidebarNavItem
                    to="/creator"
                    icon={Sparkles}
                    label="لوحة صانع المحتوى"
                    isActive={pathname === "/creator"}
                    isCollapsed={isCollapsed}
                  />
                  <SidebarNavItem
                    to="/creator/payouts"
                    icon={Wallet}
                    label="محفظة الأرباح والمستحقات"
                    isActive={pathname === "/creator/payouts"}
                    isCollapsed={isCollapsed}
                  />
                  <SidebarNavItem
                    to="/analytics"
                    icon={LineChart}
                    label="إحصائيات المبيعات"
                    isActive={pathname === "/analytics"}
                    isCollapsed={isCollapsed}
                  />
                </>
              )}

              {/* Student Links */}
              {(user?.role === "student" || (!user && !isAdminPath && !isCreatorPath)) && (
                <SidebarNavItem
                  to="/student"
                  icon={BookOpen}
                  label="لوحة المقررات والتعلم"
                  isActive={pathname === "/student"}
                  isCollapsed={isCollapsed}
                />
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className={`border-t border-[#428177]/25 bg-[#002623] transition-all overflow-hidden ${
        isCollapsed ? "p-2 flex items-center justify-center" : "p-3 flex items-center justify-between"
      }`}>
        {isCollapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => { logout(); navigate("/"); }}
                className="w-9 h-9 flex items-center justify-center text-red-400 hover:text-red-300 transition-colors rounded-xl hover:bg-red-950/40 mx-auto cursor-pointer"
                aria-label="تسجيل الخروج"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" align="center" className="bg-[#6B1F2A] text-white border border-[#6B1F2A] font-bold text-xs px-3 py-1.5 shadow-xl">
              تسجيل الخروج
            </TooltipContent>
          </Tooltip>
        ) : (
          <>
            <button
              onClick={() => { logout(); navigate("/"); }}
              className="flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 transition-colors px-2 py-1.5 rounded-lg hover:bg-red-950/30"
            >
              <LogOut className="h-4 w-4" />
              <span>تسجيل الخروج</span>
            </button>
            <span className="text-[10px] text-[#EDEBE0]/50 font-medium">تعلّـم v2.0</span>
          </>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
