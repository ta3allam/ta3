import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { Plus, Check, X, Edit, Trash2, Bell } from "lucide-react";
import { useState } from "react";

const dummyUsers = [
  { id: 1, name: "أحمد علي", role: "طالب" },
  { id: 2, name: "سارة محمد", role: "طالب" },
  { id: 3, name: "أ. خالد", role: "معلم" },
];

const dummyRequests = [
  { id: 101, student: "مها منصور", course: "مبادئ البرمجة" },
  { id: 102, student: "يوسف حسن", course: "الرياضيات المتقدمة" },
];

const initialCourses = [
  { id: "c1", title: "مبادئ البرمجة", students: 24 },
  { id: "c2", title: "الرياضيات المتقدمة", students: 18 },
];

export default function AdminDashboard() {
  const [courses, setCourses] = useState(initialCourses);
  const [newCourse, setNewCourse] = useState("");
  const [requests, setRequests] = useState(dummyRequests);

  const approve = (id: number) => {
    setRequests((r) => r.filter((x) => x.id !== id));
    toast({ title: "تمت الموافقة", description: "تمت الموافقة على طلب الالتحاق." });
  };
  const reject = (id: number) => {
    setRequests((r) => r.filter((x) => x.id !== id));
    toast({ title: "تم الرفض", description: "تم رفض طلب الالتحاق." });
  };

  const addCourse = () => {
    if (!newCourse.trim()) return;
    setCourses((c) => [...c, { id: crypto.randomUUID(), title: newCourse.trim(), students: 0 }]);
    setNewCourse("");
    toast({ title: "أُضيف المقرر", description: "تم إنشاء المقرر بنجاح." });
  };

  const updateCourse = (id: string) => {
    const title = prompt("تحديث اسم المقرر:");
    if (title) setCourses((list) => list.map((c) => (c.id === id ? { ...c, title } : c)));
  };

  const deleteCourse = (id: string) => {
    setCourses((list) => list.filter((c) => c.id !== id));
  };

  const analytics = {
    users: dummyUsers.length,
    courses: courses.length,
    pending: requests.length,
  };

  return (
    <DashboardLayout title="لوحة التحكم - المسؤول">
      <h1 className="text-3xl font-extrabold mb-4">لوحة التحكم - المسؤول</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="animate-fade-in">
          <CardHeader className="pb-2"><CardTitle>المستخدمون</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold">{analytics.users}</CardContent>
        </Card>
        <Card className="animate-fade-in">
          <CardHeader className="pb-2"><CardTitle>المقررات</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold">{analytics.courses}</CardContent>
        </Card>
        <Card className="animate-fade-in">
          <CardHeader className="pb-2"><CardTitle>طلبات معلّقة</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold">{analytics.pending}</CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>المستخدمون المسجّلون</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الاسم</TableHead>
                  <TableHead className="text-right">الدور</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dummyUsers.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="text-right">{u.name}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={u.role === "معلم" ? "default" : "secondary"}>{u.role}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row-reverse flex items-center justify-between">
            <CardTitle>التنبيهات</CardTitle>
            <Bell className="h-5 w-5" />
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>تحديث النظام سيتم الليلة عند الساعة 11 مساءً.</div>
            <Separator />
            <div>تم إضافة ميزات جديدة لإدارة المقررات.</div>
            <Separator />
            <div>مرحبا بك في منصة تعلّم!</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="requests" className="mt-2">
        <TabsList className="grid grid-cols-2 w-full md:w-auto">
          <TabsTrigger value="requests">طلبات الالتحاق</TabsTrigger>
          <TabsTrigger value="courses">إدارة المقررات</TabsTrigger>
        </TabsList>
        <TabsContent value="requests">
          <Card>
            <CardHeader><CardTitle>طلبات الالتحاق المعلّقة</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {requests.length === 0 ? (
                <div className="text-muted-foreground">لا توجد طلبات حالياً.</div>
              ) : (
                requests.map((r) => (
                  <div key={r.id} className="flex items-center justify-between">
                    <div className="text-right">
                      <div className="font-medium">{r.student}</div>
                      <div className="text-sm text-muted-foreground">{r.course}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => reject(r.id)}><X /></Button>
                      <Button variant="default" onClick={() => approve(r.id)}><Check /></Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="courses">
          <Card>
            <CardHeader><CardTitle>المقررات</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 flex-row-reverse">
                <Input placeholder="اسم المقرر" value={newCourse} onChange={(e) => setNewCourse(e.target.value)} className="text-right" />
                <Button variant="hero" onClick={addCourse}><Plus className="ml-1" />إضافة</Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">المقرر</TableHead>
                    <TableHead className="text-right">الطلاب</TableHead>
                    <TableHead className="text-right">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="text-right">{c.title}</TableCell>
                      <TableCell className="text-right">{c.students}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" onClick={() => updateCourse(c.id)}><Edit /></Button>
                          <Button variant="destructive" onClick={() => deleteCourse(c.id)}><Trash2 /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
