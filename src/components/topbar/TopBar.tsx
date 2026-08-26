import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { getAssetUrl } from "@/lib/assetUtils";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";
import {
  LogOut,
  User as UserIcon,
  Bell,
  Search,
  CheckCircle2
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
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface TopBarProps {
  title?: string;
  hideSidebarTrigger?: boolean;
}

const TopBar = ({ title, hideSidebarTrigger }: TopBarProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "تم رفع الواجب الجديد: البرمجة الهيكلية", time: "قبل 10 دقائق", unread: true },
    { id: 2, title: "إعلان جديد: موعد الاختبار النصفي", time: "قبل ساعة", unread: true },
    { id: 3, title: "تم تقييم واجب الرياضيات التطبيقية", time: "أمس", unread: false }
  ]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const targetRoute = user?.role === 'teacher' ? '/teacher' : user?.role === 'admin' ? '/admin' : '/student';
    navigate(`${targetRoute}?q=${encodeURIComponent(searchQuery)}`);
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="sticky top-0 z-20 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <Helmet>
        <title>{title ? `${title} | تعلّم` : "تعلـم الـيوم, قـد الـغد"}</title>
        <meta name="description" content=" Welcome to Ta3" />
        <link rel="canonical" href={pathname} />
      </Helmet>
      <div className="container h-14 flex items-center justify-between flex-row-reverse gap-4">
        {/* User Profile & Actions (Right side in RTL/Reversed flow) */}
        <div className="flex items-center gap-3">
          {/* Global Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative hidden md:flex items-center">
            <Search className="absolute right-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="البحث الشامل..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-3 pr-9 h-9 text-sm w-48 lg:w-64 text-right bg-muted/40 focus-visible:bg-background"
            />
          </form>

          {/* Notifications Dropdown */}
          <DropdownMenu dir="rtl">
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 h-2 w-2 bg-destructive rounded-full border-2 border-background animate-pulse"></span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end">
              <div className="flex items-center justify-between p-3 border-b">
                <span className="font-bold text-sm">الإشعارات</span>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllRead} className="text-xs h-7 text-primary gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    تعليم الكل كـ مقروء
                  </Button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto divide-y">
                {notifications.map((n) => (
                  <div key={n.id} className={`p-3 text-right text-xs space-y-1 ${n.unread ? 'bg-primary/5 font-medium' : ''}`}>
                    <p className="text-foreground">{n.title}</p>
                    <span className="text-muted-foreground block text-[10px]">{n.time}</span>
                  </div>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile Avatar Dropdown */}
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
                  <Badge variant="outline" className="w-fit text-[10px] mt-1">
                    {user?.role === 'admin' ? 'مدير النظام' : user?.role === 'teacher' ? 'مدرس' : 'طالب'}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer justify-end" onClick={() => setProfileDialogOpen(true)}>
                <span className="ml-2">الملف الشخصي والإعدادات</span>
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
              src={getAssetUrl('/logo.png')}
              alt="تعلّم"
              className="h-8 w-auto inline-block align-middle"
            />
          </NavLink>
        </div>
      </div>

      {/* User Profile Settings Modal */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="max-w-md text-right" dir="rtl">
          <DialogHeader>
            <DialogTitle>إعدادات الملف الشخصي</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/20">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                  {user?.name?.substring(0, 2) || "يو"}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-0.5">
                <h4 className="font-bold text-sm">{user?.name}</h4>
                <p className="text-xs text-muted-foreground">{user?.username}</p>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 border-b">
                <span className="text-muted-foreground">نوع الحساب:</span>
                <span className="font-semibold">{user?.role === 'admin' ? 'مدير النظام' : user?.role === 'teacher' ? 'مدرس' : 'طالب'}</span>
              </div>
              <div className="flex justify-between p-2 border-b">
                <span className="text-muted-foreground">حالة الحساب:</span>
                <span className="font-semibold text-emerald-600">نشط ومفعل</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default TopBar;
