import DashboardLayout from "@/components/layout/DashboardLayout";
import { CourseCard } from "@/components/student/CourseCard";
import { AnnouncementCard } from "@/components/student/AnnouncementCard";
import { useAuth } from "@/contexts/AuthContext";
import coursesJson from "../courses/courses.json";
import { CourseData } from "../courses/types";
import { useMemo } from "react";

// Mock global announcements
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

const courseColors = [
  "bg-pine-blue-600",
  "bg-rich-mahogany-500",
  "bg-evergreen-700",
  "bg-wine-plum-600",
  "bg-marine-teal-600"
];

export default function StudentDashboard() {
  const { user } = useAuth();

  // Memoize the course data logic
  const myCourses = useMemo(() => {
    if (!user || user.role !== 'student' || !user.enrolledCourses) return [];

    const allCourses = coursesJson as unknown as CourseData;

    return user.enrolledCourses.map(courseId => {
      const course = allCourses[courseId];
      if (!course) return null;

      return {
        id: courseId,
        name: course.name,
        code: course.code,
        category: course.category,
        rating: course.rating,
        difficulty: course.difficulty,
        teacher: course.teacher,
        language: course.language,
        backgroundColor: courseColors[courseId % courseColors.length]
      };
    }).filter(c => c !== null);
  }, [user]);

  return (
    <DashboardLayout title="لوحة التحكم - الطالب">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-right">لوحة التحكم - الطالب</h1>
        <span className="text-muted-foreground">مرحباً، {user?.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content - Course Cards */}
        <div className="lg:col-span-3 space-y-6">
          {/* Courses Grid */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-right">المقررات الحالية</h2>
            {myCourses.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {myCourses.map((course) => (
                  course && <CourseCard
                    key={course.id}
                    id={course.id}
                    name={course.name}
                    code={course.code}
                    category={course.category}
                    rating={course.rating}
                    difficulty={course.difficulty}
                    teacher={course.teacher}
                    language={course.language}
                    backgroundColor={course.backgroundColor}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg bg-slate-50">
                <p className="text-muted-foreground">لست مسجلاً في أي مقررات حالياً</p>
              </div>
            )}
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
