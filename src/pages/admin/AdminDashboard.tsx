import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
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
        <div>
          <h1 className="dashboard-header-title">
            لوحة تحكم المسؤول ⚙️
          </h1>
          <p className="dashboard-header-sub">
            إدارة المستخدمين والمقررات والطلبات الأكاديمية بنقرة واحدة.
          </p>
        </div>

        <AdminMetricsOverview
          totalStudents={totalStudents}
          totalTeachers={totalTeachers}
          totalCourses={courses.length}
          pendingRequests={requests.length}
        />

        <Card className="card-container">
          <CardHeader className="card-section-header">
            <CardTitle className="card-section-title">مركز الإدارة والعمليات</CardTitle>
          </CardHeader>
          <CardContent className="card-body-padded">
            <Tabs defaultValue="users" dir="rtl">
              <TabsList className="grid grid-cols-3 mb-6 max-w-md">
                <TabsTrigger value="users">المستخدمون ({users.length})</TabsTrigger>
                <TabsTrigger value="requests">الطلبات ({requests.length})</TabsTrigger>
                <TabsTrigger value="courses">المقررات ({courses.length})</TabsTrigger>
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
