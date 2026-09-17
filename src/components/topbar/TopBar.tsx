import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { getAssetUrl } from "@/lib/assetUtils";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Helmet } from "react-helmet-async";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import {
  LogOut,
  User as UserIcon,
  Bell,
  Search,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  GraduationCap,
  BookOpen,
  ArrowRightLeft,
  ChevronDown
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
import { toast } from "sonner";

interface TopBarProps {
  title?: string;
  hideSidebarTrigger?: boolean;
}

const TopBar = ({ title, hideSidebarTrigger }: TopBarProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, logout, login } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "تم رفع الواجب الجديد: البرمجة الهيكلية الموزعة", time: "قبل 10 دقائق", unread: true },
    { id: 2, title: "إعلان جديد: موعد ورشة البث المباشر (TUS Protocol)", time: "قبل ساعة", unread: true },
    { id: 3, title: "تم تقييم واجب الرياضيات وحساب المعدل التراكمي", time: "أمس", unread: false }
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
    toast.success("تم تعليم جميع الإشعارات كمقروءة");
  };

  const handleQuickRoleSwitch = (newRole: UserRole) => {
    if (newRole === user?.role) return;
    // Fast switcher for mockup demonstrations
    const mockCredentials: Record<UserRole, { user: string; pass: string; route: string }> = {
      student: { user: "student", pass: "password", route: "/student" },
      teacher: { user: "teacher", pass: "password", route: "/teacher" },
      admin: { user: "admin", pass: "password", route: "/admin" }
    };

    const target = mockCredentials[newRole];
    login(target.user, target.pass);
    navigate(target.route);
    toast.info(`تم التبديل إلى منظور: ${newRole === 'admin' ? 'مدير النظام' : newRole === 'teacher' ? 'المعلّم وصانع المحتوى' : 'الطالب'}`);
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  const getRoleBadgeStyle = (role?: string) => {
    switch (role) {
      case 'admin':
        return { label: 'مدير النظام', color: 'bg-[#6B1F2A] text-white border-[#6B1F2A]/60', icon: ShieldAlert };
      case 'teacher':
        return { label: 'معلّم / صانع محتوى', color: 'bg-[#428177] text-white border-[#428177]/60', icon: GraduationCap };
      case 'student':
      default:
        return { label: 'طالب', color: 'bg-[#988561] text-white border-[#988561]/60', icon: BookOpen };
    }
  };

  const roleInfo = getRoleBadgeStyle(user?.role);
  const RoleIcon = roleInfo.icon;

  return (
    <header className="sticky top-0 z-30 bg-[#002623] text-[#EDEBE0] border-b border-[#428177]/30 shadow-md">
      <Helmet>
        <title>{title ? `${title} | تعلّم` : "تعلّـم | منصة التعليم وصنّاع المحتوى"}</title>
        <meta name="description" content="منصة تعلّم للتعليم التفاعلي والمجتمعات التعليمية في الشرق الأوسط" />
        <link rel="canonical" href={pathname} />
      </Helmet>

      <div className="container h-16 flex items-center justify-between flex-row-reverse gap-4 px-4 md:px-6">
        {/* User Profile, Role Switcher & Actions (Right side in reversed flow) */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Global Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative hidden md:flex items-center">
            <Search className="absolute right-3 h-4 w-4 text-[#988561] pointer-events-none" />
            <Input
              type="search"
              placeholder="البحث في المساقات والمحتوى..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-3 pr-9 h-9 text-xs w-48 lg:w-64 text-right bg-[#053833]/90 text-[#EDEBE0] placeholder:text-[#988561]/80 border-[#428177]/40 focus-visible:border-[#428177] focus-visible:ring-1 focus-visible:ring-[#428177] rounded-xl"
            />
          </form>

          {/* Quick Mockup Role Switcher */}
          <DropdownMenu dir="rtl">
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex items-center gap-1.5 h-8 px-2.5 text-xs font-bold bg-[#053833] text-[#EDEBE0] border-[#428177]/40 hover:bg-[#428177]/20 hover:text-white rounded-xl shadow-xs"
              >
                <RoleIcon className="h-3.5 w-3.5 text-[#988561]" />
                <span>{roleInfo.label}</span>
                <ChevronDown className="h-3 w-3 text-muted-foreground mr-0.5 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-52 text-right bg-white text-[#002623] border border-[#428177]/30 shadow-lg rounded-xl" align="end">
              <DropdownMenuLabel className="text-xs font-extrabold text-muted-foreground flex items-center gap-1.5 p-2.5">
                <ArrowRightLeft className="h-3.5 w-3.5 text-[#428177]" />
                <span>تبديل المنظور للعرض (Mockup Preview)</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#EDEBE0]" />
              <DropdownMenuItem
                className={`cursor-pointer justify-between text-xs py-2 ${user?.role === 'student' ? 'bg-[#EDEBE0]/60 font-bold' : ''}`}
                onClick={() => handleQuickRoleSwitch('student')}
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5 text-[#988561]" />
                  <span>منظور الطالب (Student)</span>
                </span>
                {user?.role === 'student' && <CheckCircle2 className="h-3.5 w-3.5 text-[#428177]" />}
              </DropdownMenuItem>

              <DropdownMenuItem
                className={`cursor-pointer justify-between text-xs py-2 ${user?.role === 'teacher' ? 'bg-[#EDEBE0]/60 font-bold' : ''}`}
                onClick={() => handleQuickRoleSwitch('teacher')}
              >
                <span className="flex items-center gap-2">
                  <GraduationCap className="h-3.5 w-3.5 text-[#428177]" />
                  <span>منظور المعلّم وصانع المحتوى</span>
                </span>
                {user?.role === 'teacher' && <CheckCircle2 className="h-3.5 w-3.5 text-[#428177]" />}
              </DropdownMenuItem>

              <DropdownMenuItem
                className={`cursor-pointer justify-between text-xs py-2 ${user?.role === 'admin' ? 'bg-[#EDEBE0]/60 font-bold' : ''}`}
                onClick={() => handleQuickRoleSwitch('admin')}
              >
                <span className="flex items-center gap-2">
                  <ShieldAlert className="h-3.5 w-3.5 text-[#6B1F2A]" />
                  <span>منظور المشرف العام (Admin)</span>
                </span>
                {user?.role === 'admin' && <CheckCircle2 className="h-3.5 w-3.5 text-[#428177]" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications Dropdown */}
          <DropdownMenu dir="rtl">
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-[#EDEBE0] hover:bg-[#053833] hover:text-white rounded-xl h-9 w-9"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-[#6B1F2A] rounded-full ring-2 ring-[#002623] animate-pulse"></span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 bg-white text-[#002623] border border-[#428177]/30 shadow-xl rounded-2xl p-0 overflow-hidden" align="end">
              <div className="flex items-center justify-between p-3.5 bg-[#002623] text-[#EDEBE0] border-b border-[#428177]/20">
                <span className="font-extrabold text-xs flex items-center gap-1.5">
                  <Bell className="h-3.5 w-3.5 text-[#988561]" />
                  مركز الإشعارات ({unreadCount})
                </span>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllRead}
                    className="text-[11px] h-6 px-2 text-[#EDEBE0] hover:bg-[#053833] gap-1 font-bold rounded-lg"
                  >
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    تعليم الكل كمقروء
                  </Button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-[#EDEBE0]">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 text-right text-xs space-y-1 transition-colors hover:bg-[#EDEBE0]/40 ${
                      n.unread ? 'bg-[#428177]/10 font-bold' : ''
                    }`}
                  >
                    <p className="text-[#002623]">{n.title}</p>
                    <span className="text-muted-foreground block text-[10px] font-medium">{n.time}</span>
                  </div>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile Avatar Dropdown */}
          <DropdownMenu dir="rtl">
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full p-0 ring-2 ring-[#428177]/50 hover:ring-[#428177] transition-all"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src="" alt={user?.name} />
                  <AvatarFallback className="bg-[#428177] text-white font-extrabold text-xs">
                    {user?.name?.substring(0, 2) || "يو"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60 bg-white text-[#002623] border border-[#428177]/30 shadow-xl rounded-2xl p-2" align="end" forceMount>
              <DropdownMenuLabel className="font-normal p-2">
                <div className="flex flex-col space-y-1 text-right">
                  <p className="text-sm font-extrabold leading-none text-[#002623]">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground font-medium">
                    @{user?.username}
                  </p>
                  <Badge variant="outline" className={`w-fit text-[10px] mt-1.5 font-bold ${roleInfo.color}`}>
                    {roleInfo.label}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#EDEBE0]" />
              <DropdownMenuItem
                className="cursor-pointer justify-end text-xs font-bold rounded-xl py-2 hover:bg-[#EDEBE0]"
                onClick={() => setProfileDialogOpen(true)}
              >
                <span className="ml-2">الملف الشخصي والإعدادات</span>
                <UserIcon className="h-4 w-4 text-[#428177]" />
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#EDEBE0]" />
              <DropdownMenuItem
                className="cursor-pointer justify-end text-xs font-bold rounded-xl py-2 text-rose-700 hover:bg-rose-50"
                onClick={handleLogout}
              >
                <span className="ml-2">تسجيل الخروج</span>
                <LogOut className="h-4 w-4 text-rose-600" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Brand & Sidebar Trigger (Left side in reversed flow) */}
        <div className="flex items-center gap-3">
          {!hideSidebarTrigger && (
            <SidebarTrigger className="order-2 text-[#EDEBE0] hover:bg-[#053833] hover:text-white rounded-xl h-9 w-9" />
          )}
          <NavLink
            to={user?.role === 'admin' ? '/admin' : user?.role === 'teacher' ? '/teacher' : '/student'}
            className="text-lg font-extrabold flex items-center gap-2.5 transition-transform hover:scale-105"
          >
            <img
              src={getAssetUrl('/logo.png')}
              alt="تعلّم"
              className="h-8 w-auto inline-block align-middle brightness-110"
            />
          </NavLink>
        </div>
      </div>

      {/* User Profile Settings Modal */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="max-w-md text-right bg-white rounded-2xl border border-[#428177]/30 shadow-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold text-[#002623] flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#428177]" />
              إعدادات الحساب والملف الشخصي
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-3 p-3.5 border border-[#428177]/20 rounded-2xl bg-[#EDEBE0]/40">
              <Avatar className="h-12 w-12 border border-[#428177]/30">
                <AvatarFallback className="bg-[#428177] text-white font-black text-sm">
                  {user?.name?.substring(0, 2) || "يو"}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-[#002623]">{user?.name}</h4>
                <p className="text-xs text-muted-foreground font-medium">@{user?.username}</p>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2.5 border-b border-[#EDEBE0]">
                <span className="text-muted-foreground font-medium">نوع الحساب:</span>
                <span className="font-bold text-[#002623]">{roleInfo.label}</span>
              </div>
              <div className="flex justify-between p-2.5 border-b border-[#EDEBE0]">
                <span className="text-muted-foreground font-medium">حالة الحساب:</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  نشط وموثق
                </span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default TopBar;
