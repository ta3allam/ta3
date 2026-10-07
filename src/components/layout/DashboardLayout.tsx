import React, { useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import TopBar from "../topbar/TopBar";
import AppSidebar from "../topbar/AppSidebar";
import { MobileBottomNav } from "../navigation/MobileBottomNav";
import { MobileNavigationDrawer } from "../navigation/MobileNavigationDrawer";
import { MobileOfflineBanner } from "../common/MobileOfflineBanner";

interface DashboardLayoutProps {
  title?: string;
  children: React.ReactNode;
}

export default function DashboardLayout({ title, children }: DashboardLayoutProps) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full bg-[#EDEBE0]/40" dir="rtl">
        {/* Offline Status Top Banner */}
        <MobileOfflineBanner />

        <div className="flex flex-1 w-full">
          <AppSidebar />
          <SidebarInset className="bg-transparent flex flex-col min-w-0 flex-1">
            <TopBar title={title} onOpenMobileMenu={() => setMobileDrawerOpen(true)} />
            <main className="dashboard-content flex-1 p-4 md:p-6 pb-24 md:pb-8 max-w-7xl w-full mx-auto">
              {children}
            </main>
          </SidebarInset>
        </div>

        {/* Mobile One-Thumb Bottom Navigation */}
        <MobileBottomNav onOpenDrawer={() => setMobileDrawerOpen(true)} />

        {/* Mobile Sliding Navigation Drawer */}
        <MobileNavigationDrawer
          open={mobileDrawerOpen}
          onOpenChange={setMobileDrawerOpen}
        />
      </div>
    </SidebarProvider>
  );
}
