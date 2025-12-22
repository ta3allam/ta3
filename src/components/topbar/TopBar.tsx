import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";
import {
  LogOut,
  User as UserIcon,
  Bell
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TopBarProps {
  title?: string;
  hideSidebarTrigger?: boolean;
}

const TopBar = ({ title, hideSidebarTrigger }: TopBarProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-20 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <Helmet>
        <title>{title ? `${title} | تعلّم` : "تعلـم الـيوم, قـد الـغد"}</title>
        <meta name="description" content=" Welcome to Ta3" />
        <link rel="canonical" href={pathname} />
      </Helmet>
      <div className="container h-14 flex items-center justify-between flex-row-reverse">
        {/* User Profile & Actions (Right side in RTL/Reversed flow) */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-background"></span>
          </Button>

          <DropdownMenu dir="rtl">
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarImage src="" alt={user?.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {user?.name?.substring(0, 2) || "يو"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1 text-right">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.username}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer justify-end">
                <span className="ml-2">الملف الشخصي</span>
                <UserIcon className="h-4 w-4" />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer justify-end text-destructive focus:text-destructive" onClick={handleLogout}>
                <span className="ml-2">تسجيل الخروج</span>
                <LogOut className="h-4 w-4" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Brand & Sidebar Trigger (Left side in RTL/Reversed flow) */}
        <div className="flex items-center gap-3">
          {!hideSidebarTrigger && <SidebarTrigger className="order-2" />}
          <NavLink to={user?.role === 'admin' ? '/admin' : user?.role === 'teacher' ? '/teacher' : '/student'} className="text-lg font-extrabold flex items-center gap-2">
            <img
              src="/logo.png"
              alt="تعلّم"
              className="h-8 w-auto inline-block align-middle"
            />
          </NavLink>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
