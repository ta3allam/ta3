import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Helmet } from "react-helmet-async";

interface TopBarProps { title?: string }

const roleFromPath = (path: string) => {
  if (path.startsWith("/admin")) return "admin";
  if (path.startsWith("/teacher")) return "teacher";
  if (path.startsWith("/student")) return "student";
  return "";
};

const TopBar = ({ title }: TopBarProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const currentRole = roleFromPath(pathname);

  return (
    <header className="sticky top-0 z-20 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <Helmet>
        <title>{title ? `${title} | تعلّم` : "تعلـم الـيوم, قـد الـغد"}</title>
        <meta name="description" content=" Welcome to Ta3" />
        <link rel="canonical" href={pathname} />
      </Helmet>
      <div className="container h-14 flex items-center justify-between flex-row-reverse">
        {/* Right section: Brand */}
        <div className="flex items-center gap-3">
          <SidebarTrigger className="order-2" />
          <NavLink to="/" className="text-lg font-extrabold">
            {/* <span className="bg-gradient-primary bg-clip-text text-transparent animate-gradient-x">تعلّم</span> */}
            <img
              src="/ta3/logo.png"
              alt="تعلّم"
              className="h-8 w-auto inline-block align-middle"
            />
          </NavLink>
        </div>

        {/* Left section: role switcher */}
        <div className="flex items-center gap-3">
          {currentRole && (
            <Badge variant="secondary" className="rounded-md">
              الوضع التجريبي
            </Badge>
          )}
          <Select
            value={currentRole}
            onValueChange={(v) => navigate(v ? `/${v}` : "/")}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="اختر الدور" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">مسؤول النظام</SelectItem>
              <SelectItem value="teacher">المعلم</SelectItem>
              <SelectItem value="student">الطالب</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
