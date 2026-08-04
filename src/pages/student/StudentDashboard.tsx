import { useState, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { CourseCard } from "@/components/student/CourseCard";
import { AnnouncementCard } from "@/components/student/AnnouncementCard";
import { useAuth } from "@/contexts/AuthContext";
import { useCourseData } from "@/contexts/CourseContext";
import { BookOpen, FileCheck, Award, Clock, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Mock global announcements
const initialAnnouncements = [
  {
    id: 1,
    title: "تحديث مهم للنظام",
    content: "سيتم إغلاق النظام للصيانة الدورية يوم الجمعة القادم من الساعة 10 مساءً وحتى 2 صباحاً.",
    authorName: "إدارة تعلّم",
    createdAt: new Date().toISOString(),
    isGlobal: true,
  },
  {
    id: 2,
    title: "بدء مواعيد تسجيل المقررات",
    content: "التسجيل للفصل الدراسي الصيفي يفتح رسمياً يوم الأحد المقبل من خلال البوابة.",
    authorName: "شؤون الطلاب",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    isGlobal: true,
  },
];

const courseColors = [
  "bg-gradient-to-r from-blue-700 to-indigo-800",
  "bg-gradient-to-r from-emerald-700 to-teal-800",
  "bg-gradient-to-r from-amber-700 to-orange-800",
  "bg-gradient-to-r from-rose-700 to-pink-800",
  "bg-gradient-to-r from-purple-700 to-violet-800",
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const { courseData } = useCourseData();
  const [readAnnouncements, setReadAnnouncements] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem("ta3_read_announcements");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleReadAnnouncement = (id: number) => {
    setReadAnnouncements((prev) => {
      const updated = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      localStorage.setItem("ta3_read_announcements", JSON.stringify(updated));
      return updated;
    });
  };

  const myCourses = useMemo(() => {
    if (!user || user.role !== "student" || !user.enrolledCourses) return [];

    return user.enrolledCourses
      .map((courseId) => {
        const course = courseData[courseId];
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
          assignmentsCount: course.assignments?.length || 0,
          lecturesCount: course.lectures?.length || 0,
          backgroundColor: courseColors[courseId % courseColors.length],
        };
      })
      .filter((c): c is NonNullable<typeof c> => c !== null);
  }, [user, courseData]);

  const totalAssignments = useMemo(() => {
    return myCourses.reduce((acc, c) => acc + c.assignmentsCount, 0);
  }, [myCourses]);

  const totalLectures = useMemo(() => {
    return myCourses.reduce((acc, c) => acc + c.lecturesCount, 0);
  }, [myCourses]);

  return (
    <DashboardLayout title="لوحة التحكم - الطالب">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 md:p-8 mb-8 shadow-xl border border-indigo-900/50" dir="rtl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>مرحباً بك مجدداً في تعلّم</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">أهلاً، {user?.name || "طالب العلم"} 👋</h1>
            <p className="text-slate-300 mt-2 text-sm max-w-xl">
              تتبع تقدمك الأكاديمي، واطلع على المحاضرات والواجبات المطلوبة لهذا الأسبوع بكل سهولة.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 text-xs font-medium">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>{new Date().toLocaleDateString("ar-EG", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>
          </div>
        </div>
      </div>

      {/* KPI Metrics Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8" dir="rtl">
        <Card className="bg-card hover:shadow-md transition-shadow border-slate-200/80">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">المقررات المسجلة</p>
              <h3 className="text-2xl font-bold mt-1">{myCourses.length}</h3>
            </div>
            <div className="p-3 bg-blue-500/10 text-blue-600 rounded-xl">
              <BookOpen className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card hover:shadow-md transition-shadow border-slate-200/80">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">إجمالي الواجبات</p>
              <h3 className="text-2xl font-bold mt-1">{totalAssignments}</h3>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl">
              <FileCheck className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card hover:shadow-md transition-shadow border-slate-200/80">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">المحاضرات المتاحة</p>
              <h3 className="text-2xl font-bold mt-1">{totalLectures}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl">
              <BookOpen className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card hover:shadow-md transition-shadow border-slate-200/80">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">المعدل العام التقديري</p>
              <h3 className="text-2xl font-bold mt-1 text-emerald-600"> ممتاز 🌟</h3>
            </div>
            <div className="p-3 bg-purple-500/10 text-purple-600 rounded-xl">
              <Award className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Courses vs Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8" dir="rtl">
        {/* Main Content - Course Cards */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">المقررات الحالية</h2>
            <span className="text-xs text-muted-foreground">تصفح موادك الدراسية وسجلات التعلم</span>
          </div>

          {myCourses.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {myCourses.map((course) => (
                <CourseCard
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
            <div className="text-center py-16 border border-dashed rounded-2xl bg-slate-50/50">
              <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600 font-medium">لست مسجلاً في أي مقررات حالياً</p>
              <p className="text-xs text-slate-400 mt-1">تواصل مع شؤون الطلاب لإضافة مقرراتك</p>
            </div>
          )}
        </div>

        {/* Sidebar - Global Announcements */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">الإعلانات العامة</h2>
            <div className="space-y-4">
              {initialAnnouncements.map((announcement) => (
                <div key={announcement.id} onClick={() => toggleReadAnnouncement(announcement.id)}>
                  <AnnouncementCard
                    title={announcement.title}
                    content={announcement.content}
                    authorName={announcement.authorName}
                    createdAt={announcement.createdAt}
                    isGlobal={announcement.isGlobal}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
