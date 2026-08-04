import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Sparkles, Settings } from 'lucide-react';
import { AdminMetricsOverview } from '@/components/admin/AdminMetricsOverview';
import { UserManagementTable, UserItem } from '@/components/admin/UserManagementTable';
import { CourseRequestsTable, RequestItem } from '@/components/admin/CourseRequestsTable';
import { CourseCatalogTable, CourseCatalogItem } from '@/components/admin/CourseCatalogTable';

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [courses, setCourses] = useState<CourseCatalogItem[]>([]);
  const [requests, setRequests] = useState<RequestItem[]>([]);

  useEffect(() => {
    const savedUsers = localStorage.getItem('ta3_admin_users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      const defaultUsers: UserItem[] = [
        { id: 1, name: 'أحمد علي', role: 'طالب', username: 'student' },
        { id: 2, name: 'سارة محمد', role: 'طالب', username: 'student2' },
        { id: 3, name: 'د. خالد', role: 'معلم', username: 'teacher' },
      ];
      setUsers(defaultUsers);
      localStorage.setItem('ta3_admin_users', JSON.stringify(defaultUsers));
    }

    const savedCourses = localStorage.getItem('ta3_admin_courses');
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses));
    } else {
      const defaultCourses: CourseCatalogItem[] = [
        { id: 'c1', title: 'مبادئ البرمجة', students: 24 },
        { id: 'c2', title: 'الرياضيات المتقدمة', students: 18 },
        { id: 'c3', title: 'اللغة العربية لغير الناطقين بها', students: 12 },
      ];
      setCourses(defaultCourses);
      localStorage.setItem('ta3_admin_courses', JSON.stringify(defaultCourses));
    }

    const savedRequests = localStorage.getItem('ta3_admin_requests');
    if (savedRequests) {
      setRequests(JSON.parse(savedRequests));
    } else {
      const defaultRequests: RequestItem[] = [
        { id: 101, student: 'مها منصور', course: 'مبادئ البرمجة' },
        { id: 102, student: 'يوسف حسن', course: 'الرياضيات المتقدمة' },
      ];
      setRequests(defaultRequests);
      localStorage.setItem('ta3_admin_requests', JSON.stringify(defaultRequests));
    }
  }, []);

  const saveUsers = (updated: UserItem[]) => {
    setUsers(updated);
    localStorage.setItem('ta3_admin_users', JSON.stringify(updated));
  };

  const saveCourses = (updated: CourseCatalogItem[]) => {
    setCourses(updated);
    localStorage.setItem('ta3_admin_courses', JSON.stringify(updated));
  };

  const saveRequests = (updated: RequestItem[]) => {
    setRequests(updated);
    localStorage.setItem('ta3_admin_requests', JSON.stringify(updated));
  };

  const handleAddUser = (user: { name: string; username: string; role: string }) => {
    const newUser: UserItem = {
      id: Date.now(),
      name: user.name,
      username: user.username,
      role: user.role,
    };
    saveUsers([...users, newUser]);
    toast.success('تمت إضافة المستخدم بنجاح');
  };

  const handleDeleteUser = (id: number) => {
    saveUsers(users.filter((u) => u.id !== id));
    toast.success('تم حذف المستخدم بنجاح');
  };

  const handleApproveRequest = (id: number) => {
    const target = requests.find((x) => x.id === id);
    if (target) {
      const updatedCourses = courses.map((c) =>
        c.title === target.course ? { ...c, students: c.students + 1 } : c
      );
      saveCourses(updatedCourses);
    }
    saveRequests(requests.filter((x) => x.id !== id));
    toast.success('تمت الموافقة على طلب الالتحاق بنجاح');
  };

  const handleRejectRequest = (id: number) => {
    saveRequests(requests.filter((x) => x.id !== id));
    toast.error('تم رفض طلب الالتحاق');
  };

  const handleAddCourse = (title: string) => {
    const newCourse: CourseCatalogItem = {
      id: `c-${Date.now()}`,
      title,
      students: 0,
    };
    saveCourses([...courses, newCourse]);
    toast.success('تمت إضافة المقرر الجديد بنجاح');
  };

  const totalStudents = users.filter((u) => u.role === 'طالب').length;
  const totalTeachers = users.filter((u) => u.role === 'معلم').length;

  return (
    <DashboardLayout role="admin">
      <div className="layout-stack" dir="rtl">
        {/* Welcome Banner using official otherbackground.png */}
        <div 
          className="relative overflow-hidden rounded-2xl bg-cover bg-center text-white p-6 md:p-8 mb-4 shadow-xl border border-stone-700/30"
          style={{ backgroundImage: `linear-gradient(to left, rgba(38, 15, 20, 0.85), rgba(0, 38, 35, 0.85)), url('/dashboard bg/otherbackground.png')` }}
        >
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B9A779]/20 text-[#EDEBE0] text-xs font-semibold mb-3 border border-[#B9A779]/30">
                <Settings className="w-3.5 h-3.5 text-[#988561]" />
                <span>إدارة النظام والعمليات المركزية</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[#EDEBE0]">لوحة تحكم المسؤول ⚙️</h1>
              <p className="text-[#EDEBE0]/80 mt-2 text-sm max-w-xl">
                إدارة المستخدمين والمقررات الدراسية وطلبات التسجيل الأكاديمية بنقرة واحدة.
              </p>
            </div>
          </div>
        </div>

        <AdminMetricsOverview
          totalStudents={totalStudents}
          totalTeachers={totalTeachers}
          totalCourses={courses.length}
          pendingRequests={requests.length}
        />

        <Card className="card-container border-[#428177]/20">
          <CardHeader className="card-section-header">
            <CardTitle className="card-section-title text-[#002623]">مركز الإدارة والعمليات</CardTitle>
          </CardHeader>
          <CardContent className="card-body-padded">
            <Tabs defaultValue="users" dir="rtl">
              <TabsList className="grid grid-cols-3 mb-6 max-w-md bg-[#EDEBE0]">
                <TabsTrigger value="users" className="data-[state=active]:bg-[#428177] data-[state=active]:text-white">المستخدمون ({users.length})</TabsTrigger>
                <TabsTrigger value="requests" className="data-[state=active]:bg-[#428177] data-[state=active]:text-white">الطلبات ({requests.length})</TabsTrigger>
                <TabsTrigger value="courses" className="data-[state=active]:bg-[#428177] data-[state=active]:text-white">المقررات ({courses.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="users">
                <UserManagementTable
                  users={users}
                  onAddUser={handleAddUser}
                  onDeleteUser={handleDeleteUser}
                />
              </TabsContent>

              <TabsContent value="requests">
                <CourseRequestsTable
                  requests={requests}
                  onApprove={handleApproveRequest}
                  onReject={handleRejectRequest}
                />
              </TabsContent>

              <TabsContent value="courses">
                <CourseCatalogTable courses={courses} onAddCourse={handleAddCourse} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
