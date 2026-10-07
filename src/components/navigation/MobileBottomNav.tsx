import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  MessageSquare,
  ShoppingBag,
  BookOpen,
  Calendar,
  Menu,
  Sparkles,
  Radio
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

  const dashboardLabel = user?.role === "admin" ? "الإشراف" : user?.role === "teacher" ? "تدريسي" : user?.role === "creator" ? "الاستوديو" : "مقرراتي";

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
      icon: BookOpen,
      exact: true,
    },
    {
      to: "/cohorts",
      label: "الفعاليات",
      icon: hasLiveSession ? Radio : Calendar,
      badge: hasLiveSession ? "لايف" : undefined,
      exact: false,
    },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#002623]/95 backdrop-blur-lg border-t border-[#428177]/30 pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-4px_20px_rgba(0,0,0,0.25)]"
      dir="rtl"
      aria-label="التنقل السريع للهاتف المحمول"
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
              className={`flex flex-col items-center justify-center h-full relative transition-all duration-150 ${
                isActive
                  ? "text-[#EDEBE0]"
                  : "text-[#EDEBE0]/55 hover:text-[#EDEBE0]/80"
              }`}
            >
              {/* Active Indicator Bar */}
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#428177] rounded-b-full shadow-[0_0_8px_#428177]" />
              )}

              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-150 ${
                    isActive ? "scale-110 text-[#428177]" : ""
                  }`}
                />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2 px-1 py-0.2 rounded-full text-[9px] font-black bg-rose-600 text-white animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[11px] mt-1 font-bold truncate max-w-[64px] ${
                  isActive ? "text-[#EDEBE0]" : ""
                }`}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}

        {/* 5th Action: Open Full Drawer Menu */}
        <button
          type="button"
          onClick={onOpenDrawer}
          className="flex flex-col items-center justify-center h-full text-[#EDEBE0]/55 hover:text-[#EDEBE0] transition-colors"
          aria-label="فتح القائمة الرئيسية"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[11px] mt-1 font-bold">المزيد</span>
        </button>
      </div>
    </nav>
  );
}
