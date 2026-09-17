import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import TopBar from "../topbar/TopBar";
import AppSidebar from "../topbar/AppSidebar";

interface DashboardLayoutProps {
  title?: string;
  children: React.ReactNode;
}

export default function DashboardLayout({ title, children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#EDEBE0]/40">
        <AppSidebar />
        <SidebarInset className="bg-transparent">
          <TopBar title={title} />
          <main className="dashboard-content">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
