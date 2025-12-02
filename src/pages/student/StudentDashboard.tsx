import DashboardLayout from "@/components/layout/DashboardLayout";
import { CourseCard } from "@/components/student/CourseCard";
import { AnnouncementCard } from "@/components/student/AnnouncementCard";
import { Progress } from "@/components/ui/progress";

// Mock data - will be replaced with Supabase queries
const courses = [
  {
    id: 1,
    name: "مبادئ البرمجة",
    code: "CS101",
    progress: 65,
    semester: "Fall",
    year: 2024,
    backgroundColor: "bg-pine-blue-600"
  },
  {
    id: 2,
    name: "الرياضيات المتقدمة",
    code: "MATH201",
    progress: 30,
    semester: "Fall",
    year: 2024,
    backgroundColor: "bg-rich-mahogany-500"
  },
  {
    id: 3,
    name: "هندسة البرمجيات",
    code: "CS301",
    progress: 45,
    semester: "Fall",
    year: 2024,
    backgroundColor: "bg-evergreen-700"
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
  {
    id: 2,
    title: "موعد التسجيل",
    content: "التسجيل للفصل الدراسي القادم يبدأ يوم الأحد القادم",
    authorName: "شؤون الطلاب",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    isGlobal: true
  },
];

export default function StudentDashboard() {
  // Calculate overall progress
  const overallProgress = Math.round(
    courses.reduce((sum, course) => sum + course.progress, 0) / courses.length
  );

  return (
    <DashboardLayout title="لوحة التحكم - الطالب">
      <h1 className="text-3xl font-extrabold mb-6 text-right">لوحة التحكم - الطالب</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content - Course Cards */}
        <div className="lg:col-span-3 space-y-6">
          {/* Courses Grid */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-right">المقررات الحالية</h2>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  name={course.name}
                  code={course.code}
                  progress={course.progress}
                  backgroundColor={course.backgroundColor}
                />
              ))}
            </div>
          </div>

          {/* Progress Section */}
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-xl font-bold mb-4 text-right">التقدم الإجمالي</h3>
            <Progress value={overallProgress} className="h-3" />
            <p className="mt-2 text-sm text-muted-foreground text-right">
              {overallProgress}% مكتمل
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
