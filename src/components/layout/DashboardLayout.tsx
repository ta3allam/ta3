import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import TopBar from "../topbar/TopBar";
import AppSidebar from "../topbar/AppSidebar";

interface DashboardLayoutProps {
  title?: string;
  children: React.ReactNode;
}

const DashboardLayout = ({ title, children }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset>
          <TopBar title={title} />
          <div className="p-6 container text-right space-y-6">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
