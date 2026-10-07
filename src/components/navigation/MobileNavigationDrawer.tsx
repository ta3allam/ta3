import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  ShoppingBag,
  BookOpen,
  Calendar,
  Layers,
  Users,
  Clock,
  BarChart3,
  CreditCard,
  User as UserIcon,
  LogOut,
  ShieldAlert,
  GraduationCap,
  Sparkles,
  ExternalLink,
  Wallet,
  Settings
} from "lucide-react";

interface MobileNavigationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenProfile?: () => void;
}

export function MobileNavigationDrawer({
  open,
  onOpenChange,
  onOpenProfile
}: MobileNavigationDrawerProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    onOpenChange(false);
    logout();
    navigate("/");
  };

  const handleProfileClick = () => {
    onOpenChange(false);
    if (onOpenProfile) {
      onOpenProfile();
    } else {
      navigate("/profile");
    }
  };

  const getRoleBadgeStyle = (role?: string) => {
    switch (role) {
      case "admin":
        return { label: "مشرف عام النظام", color: "bg-[#6B1F2A] text-white", icon: ShieldAlert };
      case "teacher":
        return { label: "معلّم أكاديمي", color: "bg-[#428177] text-white", icon: GraduationCap };
      case "creator":
        return { label: "صانع محتوى", color: "bg-[#988561] text-white", icon: Sparkles };
      case "student":
      default:
        return { label: "طالب مسجل", color: "bg-[#988561] text-white", icon: BookOpen };
    }
  };

  const roleInfo = getRoleBadgeStyle(user?.role);
  const RoleIcon = roleInfo.icon;

  const mainLinks = [
    { to: "/community", label: "مجتمع تعلّم (Community)", icon: MessageSquare },
    { to: "/marketplace", label: "السوق والدورات (Marketplace)", icon: ShoppingBag },
    { to: "/cohorts", label: "الفعاليات والجلسات الحية (Live)", icon: Calendar },
    { to: "/timeline", label: "الجدول الزمني والمهام (Timeline)", icon: Clock },
    { to: "/groups", label: "مجموعات الدراسة (Study Groups)", icon: Users },
  ];

  const roleLinks =
    user?.role === "admin"
      ? [{ to: "/admin", label: "لوحة حوكمة النظام (Admin)", icon: ShieldAlert }]
      : user?.role === "teacher"
      ? [
          { to: "/teacher", label: "إدارة المقررات والطلاب", icon: GraduationCap },
          { to: "/teacher/analytics", label: "تحليلات الأداء الأكاديمي", icon: BarChart3 },
        ]
      : user?.role === "creator"
      ? [
          { to: "/creator", label: "استوديو صانع المحتوى", icon: Sparkles },
          { to: "/creator/payouts", label: "محفظة الأرباح والسحوبات", icon: Wallet },
          { to: "/creator/analytics", label: "إحصائيات المبيعات", icon: BarChart3 },
        ]
      : [{ to: "/student", label: "لوحة المقررات والتقدم", icon: BookOpen }];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[85vw] max-w-sm bg-[#002623] text-[#EDEBE0] p-0 border-l border-[#428177]/30 flex flex-col justify-between overflow-y-auto"
        dir="rtl"
      >
        {/* Profile Header */}
        <div>
          <div className="p-5 border-b border-[#428177]/25 bg-[#054239]/90">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12 border-2 border-[#428177] shadow-sm">
                <AvatarImage src={user?.avatar} alt={user?.name || "المستخدم"} />
                <AvatarFallback className="bg-[#428177] text-white font-black text-sm">
                  {user?.name?.slice(0, 2) || "تـ"}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm text-white truncate max-w-[170px]">
                    {user?.name || "مستخدم تعلّم"}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Badge variant="outline" className={`text-[10px] px-2 py-0.2 rounded-full font-bold border-transparent ${roleInfo.color}`}>
                    <RoleIcon className="w-3 h-3 ml-1" />
                    {roleInfo.label}
                  </Badge>
                  <span className="text-[10px] font-bold text-[#988561] bg-[#EDEBE0]/15 px-2 py-0.2 rounded-full">
                    المستوى {user?.level || 1} 🔥
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Profile View Button */}
            <Button
              onClick={handleProfileClick}
              variant="outline"
              size="sm"
              className="w-full mt-3 text-xs font-bold border-[#428177]/40 text-[#EDEBE0] hover:bg-[#428177]/20 rounded-xl"
            >
              <UserIcon className="w-3.5 h-3.5 ml-1.5 text-[#428177]" />
              عرض الملف الشخصي والإعدادات
            </Button>
          </div>

          {/* Navigation Sections */}
          <div className="p-4 space-y-5">
            {/* Main Sections */}
            <div className="space-y-1">
              <p className="text-[10px] font-extrabold uppercase text-[#EDEBE0]/50 px-3 mb-1">
                الأقسام الرئيسية
              </p>
              {mainLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => onOpenChange(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? "bg-[#428177] text-white shadow-sm"
                          : "text-[#EDEBE0]/80 hover:bg-[#054239] hover:text-white"
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 text-[#EDEBE0]" />
                    <span>{link.label}</span>
                  </NavLink>
                );
              })}
            </div>

            {/* Role Dedicated Section */}
            <div className="space-y-1 pt-2 border-t border-[#428177]/20">
              <p className="text-[10px] font-extrabold uppercase text-[#EDEBE0]/50 px-3 mb-1">
                مساحة العمل الخاصة
              </p>
              {roleLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => onOpenChange(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? "bg-[#428177] text-white shadow-sm"
                          : "text-[#EDEBE0]/80 hover:bg-[#054239] hover:text-white"
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 text-[#EDEBE0]" />
                    <span>{link.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-[#428177]/25 bg-[#002623]/80 space-y-2">
          <div className="text-[10px] text-center text-[#EDEBE0]/60 font-medium">
            تعلّـم v2.0 • منصة التعليم وصنّاع المحتوى
          </div>

          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-xl justify-start gap-2"
          >
            <LogOut className="w-4 h-4 ml-1" />
            تسجيل الخروج من الحساب
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
