import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  MessageSquare,
  ShoppingBag,
  BookOpen,
  Calendar,
  Menu,
  Radio,
  GraduationCap,
  Sparkles,
  ShieldAlert,
} from "lucide-react";

interface MobileBottomNavProps {
  onOpenDrawer?: () => void;
  hasLiveSession?: boolean;
}

export function MobileBottomNav({ onOpenDrawer, hasLiveSession = false }: MobileBottomNavProps) {
  const location = useLocation();
  const { user } = useAuth();

  const getDashboardPath = () => {
    if (user?.role === "admin") return "/admin";
    if (user?.role === "teacher") return "/teacher";
    if (user?.role === "creator") return "/creator";
    return "/student";
  };

  const getDashboardIcon = () => {
    if (user?.role === "admin") return ShieldAlert;
    if (user?.role === "teacher") return GraduationCap;
    if (user?.role === "creator") return Sparkles;
    return BookOpen;
  };

  const dashboardLabel =
    user?.role === "admin"
      ? "الإشراف"
      : user?.role === "teacher"
      ? "تدريسي"
      : user?.role === "creator"
      ? "الاستوديو"
      : "مقرراتي";

  const DashboardIcon = getDashboardIcon();

  const navItems = [
    {
      to: "/community",
      label: "المجتمع",
      icon: MessageSquare,
      exact: false,
    },
    {
      to: "/marketplace",
      label: "السوق",
      icon: ShoppingBag,
      exact: false,
    },
    {
      to: getDashboardPath(),
      label: dashboardLabel,
      icon: DashboardIcon,
      exact: true,
    },
    {
      to: "/cohorts",
      label: "الفعاليات",
      icon: hasLiveSession ? Radio : Calendar,
      badge: hasLiveSession ? "مباشر" : undefined,
      exact: false,
    },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-3 left-3 right-3 z-50 bg-[#002623] border border-[#428177]/60 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] pb-[env(safe-area-inset-bottom,0px)]"
      dir="rtl"
      aria-label="شريط التنقل السفلي"
    >
      <div className="grid grid-cols-5 items-center h-16 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center h-full relative transition-all duration-200 ${
                isActive
                  ? "text-white font-extrabold"
                  : "text-white/70 hover:text-white font-semibold"
              }`}
            >
              {/* Active Indicator Bar */}
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-white rounded-b-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              )}

              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? "scale-110 text-white" : "text-white/80"
                  }`}
                />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2 px-1 py-0.2 rounded-full text-[9px] font-black bg-rose-600 text-white animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[11px] mt-1 truncate max-w-[64px] ${
                  isActive ? "text-white font-black" : "text-white/75"
                }`}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}

        {/* 5th Action: Open Consolidated Green Menu */}
        <button
          type="button"
          onClick={onOpenDrawer}
          className="flex flex-col items-center justify-center h-full text-white/70 hover:text-white transition-colors"
          aria-label="فتح القائمة الكاملة"
        >
          <Menu className="w-5 h-5 text-white/80" />
          <span className="text-[11px] mt-1 font-bold text-white/75">المزيد</span>
        </button>
      </div>
    </nav>
  );
}
