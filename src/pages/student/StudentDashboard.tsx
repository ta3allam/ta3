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

// Official Ta3 Secondary Palette mapped to Course Card banners
const officialCourseColors = [
  "bg-[#428177]", // Mountain Teal
  "bg-[#6B1F2A]", // Damask Red
  "bg-[#054239]", // Emerald Shadow
  "bg-[#988561]", // Golden Wheat
  "bg-[#4A151E]", // Black Cherry
  "bg-[#002623]", // Forest
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
          backgroundColor: officialCourseColors[courseId % officialCourseColors.length],
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
      {/* Welcome Banner using official student background image */}
      <div 
        className="relative overflow-hidden rounded-2xl bg-cover bg-center text-white p-6 md:p-8 mb-8 shadow-xl border border-stone-700/30"
        style={{ backgroundImage: `linear-gradient(to left, rgba(38, 15, 20, 0.85), rgba(0, 38, 35, 0.85)), url('/dashboard bg/student background.jpg')` }}
        dir="rtl"
      >
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B9A779]/20 text-[#EDEBE0] text-xs font-semibold mb-3 border border-[#B9A779]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#988561]" />
              <span>مرحباً بك مجدداً في تعلّم</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#EDEBE0]">أهلاً، {user?.name || "طالب العلم"} 👋</h1>
            <p className="text-[#EDEBE0]/80 mt-2 text-sm max-w-xl">
              تتبع تقدمك الأكاديمي، واطلع على المحاضرات والواجبات المطلوبة لهذا الأسبوع بكل سهولة.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-black/30 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 text-xs font-medium text-[#EDEBE0]">
            <Clock className="w-4 h-4 text-[#988561]" />
            <span>{new Date().toLocaleDateString("ar-EG", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>
          </div>
        </div>
      </div>

      {/* KPI Metrics Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8" dir="rtl">
        <Card className="bg-card hover:shadow-md transition-shadow border-[#428177]/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">المقررات المسجلة</p>
              <h3 className="text-2xl font-bold mt-1 text-[#002623]">{myCourses.length}</h3>
            </div>
            <div className="p-3 bg-[#428177]/10 text-[#428177] rounded-xl">
              <BookOpen className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card hover:shadow-md transition-shadow border-[#6B1F2A]/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">إجمالي الواجبات</p>
              <h3 className="text-2xl font-bold mt-1 text-[#6B1F2A]">{totalAssignments}</h3>
            </div>
            <div className="p-3 bg-[#6B1F2A]/10 text-[#6B1F2A] rounded-xl">
              <FileCheck className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card hover:shadow-md transition-shadow border-[#054239]/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">المحاضرات المتاحة</p>
              <h3 className="text-2xl font-bold mt-1 text-[#054239]">{totalLectures}</h3>
            </div>
            <div className="p-3 bg-[#054239]/10 text-[#054239] rounded-xl">
              <BookOpen className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card hover:shadow-md transition-shadow border-[#988561]/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">المعدل العام التقديري</p>
              <h3 className="text-2xl font-bold mt-1 text-[#988561]"> ممتاز 🌟</h3>
            </div>
            <div className="p-3 bg-[#988561]/10 text-[#988561] rounded-xl">
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
            <h2 className="text-xl font-bold text-[#002623]">المقررات الحالية</h2>
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
            <div className="text-center py-16 border border-dashed rounded-2xl bg-[#EDEBE0]/40">
              <BookOpen className="w-12 h-12 text-[#988561] mx-auto mb-3" />
              <p className="text-[#002623] font-medium">لست مسجلاً في أي مقررات حالياً</p>
              <p className="text-xs text-slate-500 mt-1">تواصل مع شؤون الطلاب لإضافة مقرراتك</p>
            </div>
          )}
        </div>

        {/* Sidebar - Global Announcements */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-4">
            <h2 className="text-xl font-bold text-[#002623]">الإعلانات العامة</h2>
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
