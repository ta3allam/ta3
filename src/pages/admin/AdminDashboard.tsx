import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Settings } from 'lucide-react';
import { AdminMetricsOverview } from '@/components/admin/AdminMetricsOverview';
import { UserManagementTable, UserItem } from '@/components/admin/UserManagementTable';
import { CourseRequestsTable, RequestItem } from '@/components/admin/CourseRequestsTable';
import { CourseCatalogTable, CourseCatalogItem } from '@/components/admin/CourseCatalogTable';
import { useCourseData } from '@/contexts/CourseContext';
import { getAssetUrl } from '@/lib/assetUtils';

export default function AdminDashboard() {
  const { courseData, addCourse } = useCourseData();
  const [users, setUsers] = useState<UserItem[]>([]);
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

  const courseCatalogItems: CourseCatalogItem[] = Object.entries(courseData).map(([idStr, c]) => ({
    id: idStr,
    code: c.code,
    title: c.name,
    teacher: c.teacher,
    category: c.category,
    students: c.id === 1 ? 24 : c.id === 2 ? 18 : 12
  }));

  const saveUsers = (updated: UserItem[]) => {
    setUsers(updated);
    localStorage.setItem('ta3_admin_users', JSON.stringify(updated));
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
    saveRequests(requests.filter((x) => x.id !== id));
    toast.success('تمت الموافقة على طلب الالتحاق بنجاح');
  };

  const handleRejectRequest = (id: number) => {
    saveRequests(requests.filter((x) => x.id !== id));
    toast.error('تم رفض طلب الالتحاق');
  };

  const handleAddCourse = (courseDataInput: { name: string; code: string; category: string; teacher: string }) => {
    addCourse({
      name: courseDataInput.name,
      code: courseDataInput.code,
      category: courseDataInput.category,
      teacher: courseDataInput.teacher,
      bgImage: courseDataInput.category.includes('رياضيات') ? '/coursesbg/math.png' : '/coursesbg/coding.png'
    });
    toast.success('تم إنشاء واعتماد المقرر الأكاديمي بنجاح (متاح الآن للمعلمين والطلاب)');
  };

  const totalStudents = users.filter((u) => u.role === 'طالب').length;
  const totalTeachers = users.filter((u) => u.role === 'معلم').length;

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6" dir="rtl">
        {/* Admin Header Banner */}
        <div 
          className="relative overflow-hidden rounded-2xl bg-white border border-[#428177] p-6 md:p-8 mb-4 shadow-sm"
          style={{
            backgroundImage: `linear-gradient(to left, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.82)), url('${getAssetUrl("/dashboard bg/otherbackground.png")}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#428177]/10 text-[#428177] text-xs font-bold mb-3 border border-[#428177]/30">
                <Settings className="w-3.5 h-3.5 text-[#428177]" />
                <span>إدارة النظام والعمليات المركزية</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[#002623]">لوحة تحكم المسؤول ⚙️</h1>
              <p className="text-[#3D3A3B] mt-2 text-sm max-w-xl font-medium">
                إدارة الحسابات، إضافة واعتماد المقررات الأكاديمية حصرياً، ومعالجة طلبات التسجيل الفردية.
              </p>
            </div>
          </div>
        </div>

        <AdminMetricsOverview
          totalStudents={totalStudents}
          totalTeachers={totalTeachers}
          totalCourses={courseCatalogItems.length}
          pendingRequests={requests.length}
        />

        <Card className="border border-[#428177]/30 bg-white shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="bg-[#EDEBE0]/30 border-b border-[#428177]/10">
            <CardTitle className="text-lg font-bold text-[#002623]">مركز الإدارة والعمليات المركزية</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="users" dir="rtl">
              <TabsList className="grid grid-cols-3 mb-6 max-w-md bg-[#EDEBE0] p-1 rounded-xl">
                <TabsTrigger value="users" className="data-[state=active]:bg-[#428177] data-[state=active]:text-white font-bold text-xs">المستخدمون ({users.length})</TabsTrigger>
                <TabsTrigger value="requests" className="data-[state=active]:bg-[#428177] data-[state=active]:text-white font-bold text-xs">الطلبات ({requests.length})</TabsTrigger>
                <TabsTrigger value="courses" className="data-[state=active]:bg-[#428177] data-[state=active]:text-white font-bold text-xs">المقررات ({courseCatalogItems.length})</TabsTrigger>
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
                <CourseCatalogTable courses={courseCatalogItems} onAddCourse={handleAddCourse} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
