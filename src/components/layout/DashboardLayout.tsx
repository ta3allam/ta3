import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import TopBar from "../topbar/TopBar";
import AppSidebar from "../topbar/AppSidebar";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardLayoutProps {
  title?: string;
  children: React.ReactNode;
}

const DashboardLayout = ({ title, children }: DashboardLayoutProps) => {
  const { pathname } = useLocation();
  const { user } = useAuth();

  const isCoursePath = pathname.includes("/courses/");
  const isStudentOrTeacher = user?.role === 'student' || user?.role === 'teacher';

  // Determine if we should show the sidebar at all
  const showSidebar = !isStudentOrTeacher || isCoursePath;

  if (!showSidebar) {
    return (
      <div className="min-h-screen flex flex-col w-full">
        <TopBar title={title} hideSidebarTrigger />
        <main className="flex-1 p-6 container text-right space-y-6">
          {children}
        </main>
      </div>
    );
  }

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
