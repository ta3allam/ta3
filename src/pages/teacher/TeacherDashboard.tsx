import DashboardLayout from "@/components/layout/DashboardLayout";
import { CourseCard } from "@/components/student/CourseCard";
import { AnnouncementCard } from "@/components/student/AnnouncementCard";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// Mock data - will be replaced with Supabase queries
const teacherCourses = [
  {
    id: 1,
    name: "مبادئ البرمجة",
    code: "CS101",
    progress: 65, // Course completion percentage
    semester: "Fall",
    year: 2024,
    backgroundColor: "bg-pine-blue-600",
    studentCount: 45
  },
  {
    id: 2,
    name: "هندسة البرمجيات",
    code: "CS301",
    progress: 45,
    semester: "Fall",
    year: 2024,
    backgroundColor: "bg-evergreen-700",
    studentCount: 32
  },
];

const globalAnnouncements = [
  {
    id: 1,
    title: "تحديث مهم",
    content: "سيتم إغلاق النظام للصيانة يوم الجمعة من الساعة 10 مساءً حتى 2 صباحاً",
    authorName: "الإدارة",
    createdAt: new Date().toISOString(),
    isGlobal: true
  },
];

export default function TeacherDashboard() {
  const overallProgress = Math.round(
    teacherCourses.reduce((sum, course) => sum + course.progress, 0) / teacherCourses.length
  );

  return (
    <DashboardLayout title="لوحة التحكم - المعلم">
      <div className="flex items-center justify-between mb-6">
        <Button>
          <Plus className="h-4 w-4 ml-2" />
          مقرر جديد
        </Button>
        <h1 className="text-3xl font-extrabold text-right">لوحة التحكم - المعلم</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content - Course Cards */}
        <div className="lg:col-span-3 space-y-6">
          {/* Courses Grid */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-right">مقرراتي</h2>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {teacherCourses.map((course) => (
                <div key={course.id} className="relative">
                  <CourseCard
                    id={course.id}
                    name={course.name}
                    code={course.code}
                    progress={course.progress}
                    backgroundColor={course.backgroundColor}
                    basePath="/teacher/courses"
                  />
                  <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-semibold">
                    {course.studentCount} طالب
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Section */}
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-bold mb-4 text-right">متوسط التقدم</h3>
            <Progress value={overallProgress} className="h-3" />
            <p className="mt-2 text-sm text-muted-foreground text-right">
              {overallProgress}% متوسط إكمال المقررات
            </p>
          </div>
        </div>

        {/* Sidebar - Global Announcements */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <h2 className="text-2xl font-bold mb-4 text-right">الإعلانات العامة</h2>
            <div className="space-y-4">
              {globalAnnouncements.map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  title={announcement.title}
                  content={announcement.content}
                  authorName={announcement.authorName}
                  createdAt={announcement.createdAt}
                  isGlobal={announcement.isGlobal}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
