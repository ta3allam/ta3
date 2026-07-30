import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus, Check, X, Edit, Trash2, Bell, Users, BarChart3, TrendingUp, UserCheck } from "lucide-react";
import { useState, useEffect } from "react";
import UserManagementDialog from "@/components/admin/UserManagementDialog";

export default function AdminDashboard() {
  const [users, setUsers] = useState<{ id: number; name: string; role: string; username: string }[]>([]);
  const [courses, setCourses] = useState<{ id: string; title: string; students: number }[]>([]);
  const [requests, setRequests] = useState<{ id: number; student: string; course: string }[]>([]);
  const [newCourse, setNewCourse] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  // Initialize and synchronize states from local storage
  useEffect(() => {
    const savedUsers = localStorage.getItem("ta3_admin_users");
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      const defaultUsers = [
        { id: 1, name: "أحمد علي", role: "طالب", username: "student" },
        { id: 2, name: "سارة محمد", role: "طالب", username: "student2" },
        { id: 3, name: "د. خالد", role: "معلم", username: "teacher" },
      ];
      setUsers(defaultUsers);
      localStorage.setItem("ta3_admin_users", JSON.stringify(defaultUsers));
    }

    const savedCourses = localStorage.getItem("ta3_admin_courses");
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses));
    } else {
      const defaultCourses = [
        { id: "c1", title: "مبادئ البرمجة", students: 24 },
        { id: "c2", title: "الرياضيات المتقدمة", students: 18 },
        { id: "c3", title: "اللغة العربية لغير الناطقين بها", students: 12 },
      ];
      setCourses(defaultCourses);
      localStorage.setItem("ta3_admin_courses", JSON.stringify(defaultCourses));
    }

    const savedRequests = localStorage.getItem("ta3_admin_requests");
    if (savedRequests) {
      setRequests(JSON.parse(savedRequests));
    } else {
      const defaultRequests = [
        { id: 101, student: "مها منصور", course: "مبادئ البرمجة" },
        { id: 102, student: "يوسف حسن", course: "الرياضيات المتقدمة" },
      ];
      setRequests(defaultRequests);
      localStorage.setItem("ta3_admin_requests", JSON.stringify(defaultRequests));
    }
  }, []);

  const saveUsers = (updatedUsers: typeof users) => {
    setUsers(updatedUsers);
    localStorage.setItem("ta3_admin_users", JSON.stringify(updatedUsers));
  };

  const saveCourses = (updatedCourses: typeof courses) => {
    setCourses(updatedCourses);
    localStorage.setItem("ta3_admin_courses", JSON.stringify(updatedCourses));
  };

  const saveRequests = (updatedRequests: typeof requests) => {
    setRequests(updatedRequests);
    localStorage.setItem("ta3_admin_requests", JSON.stringify(updatedRequests));
  };

  const approve = (id: number) => {
    const target = requests.find((x) => x.id === id);
    if (target) {
      // Increment students for the course if matches title
      const updatedCourses = courses.map((c) =>
        c.title === target.course ? { ...c, students: c.students + 1 } : c
      );
      saveCourses(updatedCourses);
    }
    const updatedRequests = requests.filter((x) => x.id !== id);
    saveRequests(updatedRequests);
    toast.success("تمت الموافقة على طلب الالتحاق بنجاح");
  };

  const reject = (id: number) => {
    const updatedRequests = requests.filter((x) => x.id !== id);
    saveRequests(updatedRequests);
    toast.error("تم رفض طلب الالتحاق");
  };

  const addCourse = () => {
    if (!newCourse.trim()) return;
    const updated = [...courses, { id: crypto.randomUUID(), title: newCourse.trim(), students: 0 }];
    saveCourses(updated);
    setNewCourse("");
    toast.success("تم إنشاء المقرر الجديد بنجاح");
  };

  const updateCourse = (id: string) => {
    const title = prompt("تحديث اسم المقرر:");
    if (title && title.trim()) {
      const updated = courses.map((c) => (c.id === id ? { ...c, title: title.trim() } : c));
      saveCourses(updated);
      toast.success("تم تحديث اسم المقرر");
    }
  };

  const deleteCourse = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا المقرر؟")) {
      const updated = courses.filter((c) => c.id !== id);
      saveCourses(updated);
      toast.success("تم حذف المقرر");
    }
  };

  const handleAddUser = (newUser: { name: string; role: string; username: string }) => {
    const userObj = {
      id: Math.max(0, ...users.map((u) => u.id)) + 1,
      name: newUser.name,
      role: newUser.role,
      username: newUser.username,
    };
    const updated = [...users, userObj];
    saveUsers(updated);
    toast.success(`تمت إضافة المستخدم ${newUser.name} بنجاح`);
  };

  const handleDeleteUser = (id: number) => {
    if (confirm("هل أنت متأكد من رغبتك في حذف هذا المستخدم؟")) {
      const updated = users.filter((u) => u.id !== id);
      saveUsers(updated);
      toast.success("تم حذف المستخدم");
    }
  };

  const analytics = {
    users: users.length,
    courses: courses.length,
    pending: requests.length,
  };

  return (
    <DashboardLayout title="لوحة التحكم - المسؤول">
      <div className="space-y-6" dir="rtl">
        {/* Title and top header */}
        <div className="flex justify-between items-center border-b border-border/40 pb-4">
          <h1 className="text-3xl font-extrabold text-foreground">لوحة التحكم - إدارة النظام</h1>
          <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1 font-semibold text-xs">
            الوصول: مشرف عام
          </Badge>
        </div>

        {/* Analytics cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="border border-border/60 hover:shadow-sm transition-shadow">
            <CardHeader className="pb-2 flex-row justify-between items-center text-right">
              <Users className="h-5 w-5 text-indigo-600" />
              <CardTitle className="text-sm font-semibold text-muted-foreground">إجمالي المستخدمين</CardTitle>
            </CardHeader>
            <CardContent className="stat-value font-extrabold text-3xl text-foreground pb-4">{analytics.users}</CardContent>
          </Card>
          <Card className="border border-border/60 hover:shadow-sm transition-shadow">
            <CardHeader className="pb-2 flex-row justify-between items-center text-right">
              <BarChart3 className="h-5 w-5 text-emerald-600" />
              <CardTitle className="text-sm font-semibold text-muted-foreground">المقررات الدراسية</CardTitle>
            </CardHeader>
            <CardContent className="stat-value font-extrabold text-3xl text-foreground pb-4">{analytics.courses}</CardContent>
          </Card>
          <Card className="border border-border/60 hover:shadow-sm transition-shadow">
            <CardHeader className="pb-2 flex-row justify-between items-center text-right">
              <UserCheck className="h-5 w-5 text-amber-600" />
              <CardTitle className="text-sm font-semibold text-muted-foreground">طلبات معلّقة</CardTitle>
            </CardHeader>
            <CardContent className="stat-value font-extrabold text-3xl text-foreground pb-4">{analytics.pending}</CardContent>
          </Card>
        </div>

        {/* Lightweight Pure CSS SVG Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Enrollment Bar Chart */}
          <Card className="border border-border/60 shadow-sm">
            <CardHeader className="pb-2 text-right">
              <CardTitle className="text-base font-bold text-foreground">توزيع الطلاب على المقررات</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 flex flex-col justify-center items-center">
              {courses.length > 0 ? (
                <div className="w-full space-y-4">
                  {courses.map((c) => {
                    const maxVal = Math.max(1, ...courses.map((x) => x.students));
                    const percentage = (c.students / maxVal) * 100;
                    return (
                      <div key={c.id} className="space-y-1 text-right">
                        <div className="flex justify-between items-center text-xs font-semibold">
                          <span className="text-muted-foreground">{c.students} طالب</span>
                          <span className="text-foreground">{c.title}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-border/20">
                          <div
                            className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-muted-foreground text-xs italic py-8">لا توجد مقررات لعرض إحصاءاتها.</div>
              )}
            </CardContent>
          </Card>

          {/* Activity Timeline Mini Chart */}
          <Card className="border border-border/60 shadow-sm">
            <CardHeader className="pb-2 text-right">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-1.5 justify-end">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                <span>معدل النشاط الأسبوعي</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              {/* Pure SVG Line Chart */}
              <div className="h-[140px] w-full flex items-center justify-center">
                <svg viewBox="0 0 400 120" className="w-full h-full text-emerald-600 overflow-visible" dir="ltr">
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgb(16, 185, 129)" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="rgb(16, 185, 129)" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Grid Lines */}
                  <line x1="0" y1="20" x2="400" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="60" x2="400" y2="60" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="100" x2="400" y2="100" stroke="#f1f5f9" strokeWidth="1" />

                  {/* Area path */}
                  <path
                    d="M 10 100 L 80 80 L 150 95 L 220 50 L 290 65 L 390 10 Q 390 100 390 100 Z"
                    fill="url(#gradient)"
                  />
                  {/* Line path */}
                  <path
                    d="M 10 100 L 80 80 L 150 95 L 220 50 L 290 65 L 390 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Dots */}
                  <circle cx="10" cy="100" r="4" fill="#ffffff" stroke="currentColor" strokeWidth="2.5" />
                  <circle cx="80" cy="80" r="4" fill="#ffffff" stroke="currentColor" strokeWidth="2.5" />
                  <circle cx="150" cy="95" r="4" fill="#ffffff" stroke="currentColor" strokeWidth="2.5" />
                  <circle cx="220" cy="50" r="4" fill="#ffffff" stroke="currentColor" strokeWidth="2.5" />
                  <circle cx="290" cy="65" r="4" fill="#ffffff" stroke="currentColor" strokeWidth="2.5" />
                  <circle cx="390" cy="10" r="4" fill="#ffffff" stroke="currentColor" strokeWidth="2.5" />
                </svg>
              </div>
              <div className="flex justify-between items-center text-[10px] text-muted-foreground font-semibold px-2 border-t border-border/20 pt-2">
                <span>السبت</span>
                <span>الأحد</span>
                <span>الاثنين</span>
                <span>الثلاثاء</span>
                <span>الأربعاء</span>
                <span>الخميس</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main interactive sections */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Registered Users Management */}
          <Card className="md:col-span-2 border border-border/60">
            <CardHeader className="flex flex-row justify-between items-center text-right pb-3 border-b border-border/40">
              <Button onClick={() => setIsAddUserOpen(true)} size="sm" className="font-bold flex items-center gap-1">
                <Plus className="h-4 w-4" />
                مستخدم جديد
              </Button>
              <CardTitle className="text-base font-bold text-foreground">إدارة مستخدمي المنصة</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">الاسم</TableHead>
                      <TableHead className="text-right">الدور</TableHead>
                      <TableHead className="text-right">اسم المستخدم</TableHead>
                      <TableHead className="text-center">إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.id} className="hover:bg-slate-50/50">
                        <TableCell className="text-right font-semibold text-foreground">{u.name}</TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant={u.role === "معلم" ? "default" : u.role === "مشرف" ? "destructive" : "secondary"}
                            className="font-semibold text-xs"
                          >
                            {u.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground font-mono">{u.username}</TableCell>
                        <TableCell className="text-center">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteUser(u.id)}
                            className="text-rose-600 hover:text-rose-800 hover:bg-rose-50 h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* System Notifications Box */}
          <Card className="border border-border/60">
            <CardHeader className="flex-row justify-between flex items-center text-right pb-3 border-b border-border/40">
              <Bell className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-bold text-foreground">تنبيهات النظام</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs font-semibold text-muted-foreground pt-4">
              <div>تحديث خوادم الاستضافة سيتم الليلة عند الساعة 11 مساءً لتعزيز الأداء للمناطق ذات سرعات الإنترنت الضعيفة.</div>
              <Separator />
              <div>تم إصدار وتفعيل ميزة تصحيح الواجبات ورصد الدرجات لجميع المعلمين.</div>
              <Separator />
              <div>تم ترقية منتدى نقاشات الطلاب ليكون تفاعلياً بشكل كامل.</div>
            </CardContent>
          </Card>
        </div>

        {/* Requests and Courses tabs */}
        <Tabs defaultValue="requests" className="mt-2">
          <TabsList className="grid grid-cols-2 w-full md:w-[350px]">
            <TabsTrigger value="requests" className="font-bold">طلبات الالتحاق</TabsTrigger>
            <TabsTrigger value="courses" className="font-bold">إدارة المقررات</TabsTrigger>
          </TabsList>

          <TabsContent value="requests">
            <Card className="border border-border/60">
              <CardHeader><CardTitle className="text-base font-bold">طلبات الالتحاق المعلّقة</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {requests.length === 0 ? (
                  <div className="text-muted-foreground text-center py-6 text-xs italic">
                    لا توجد طلبات معلّقة حالياً.
                  </div>
                ) : (
                  requests.map((r) => (
                    <div key={r.id} className="flex justify-between items-center p-3 border border-border/40 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                      <div className="text-right">
                        <div className="font-bold text-sm text-foreground">{r.student}</div>
                        <div className="text-xs text-muted-foreground font-semibold">المقرر: {r.course}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => reject(r.id)} className="h-8 w-8 p-0 text-rose-600 border-rose-200">
                          <X className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="default" onClick={() => approve(r.id)} className="h-8 w-8 p-0">
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses">
            <Card className="border border-border/60">
              <CardHeader><CardTitle className="text-base font-bold">تعديل وإضافة المقررات الدراسية</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-2">
                  <Button variant="default" onClick={addCourse} className="font-bold h-10 px-6">
                    <Plus className="h-4 w-4 ml-1.5" />
                    إنشاء مقرر
                  </Button>
                  <Input
                    placeholder="اسم المقرر الدراسي الجديد..."
                    value={newCourse}
                    onChange={(e) => setNewCourse(e.target.value)}
                    className="text-right focus-visible:ring-primary/50 h-10 text-sm flex-1"
                  />
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">اسم المقرر</TableHead>
                        <TableHead className="text-right">عدد الطلاب</TableHead>
                        <TableHead className="text-center">خيارات التعديل</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courses.map((c) => (
                        <TableRow key={c.id} className="hover:bg-slate-50/50">
                          <TableCell className="text-right font-semibold text-foreground">{c.title}</TableCell>
                          <TableCell className="text-right text-xs text-muted-foreground font-semibold">{c.students} طالب</TableCell>
                          <TableCell className="text-center">
                            <div className="flex gap-2 justify-center">
                              <Button variant="outline" size="sm" onClick={() => updateCourse(c.id)} className="h-8 w-8 p-0">
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => deleteCourse(c.id)} className="h-8 w-8 p-0">
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <UserManagementDialog
        open={isAddUserOpen}
        onOpenChange={setIsAddUserOpen}
        onSave={handleAddUser}
      />
    </DashboardLayout>
  );
}
