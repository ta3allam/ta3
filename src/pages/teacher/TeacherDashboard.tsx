import { useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { CourseCard } from "@/components/student/CourseCard";
import { Sparkles, Clock, BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCourseData } from "@/contexts/CourseContext";

const officialCourseColors = [
  "bg-[#428177]", // Mountain Teal
  "bg-[#6B1F2A]", // Damask Red
  "bg-[#054239]", // Emerald Shadow
  "bg-[#988561]", // Golden Wheat
  "bg-[#4A151E]", // Black Cherry
  "bg-[#002623]", // Forest
];

function formatStandardDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { courseData } = useCourseData();

  const myCourses = useMemo(() => {
    if (!user || user.role !== 'teacher') return [];

    return Object.entries(courseData).map(([idStr, course]) => {
      const id = Number(idStr);
      const isEnrolled = user.enrolledCourses?.includes(id);
      const isTeacherOfCourse = course.teacher === user.name;

      if (!isEnrolled && !isTeacherOfCourse) return null;

      return {
        id,
        name: course.name,
        code: course.code,
        category: course.category,
        period: "صيف 2026",
        difficulty: course.difficulty,
        teacher: course.teacher,
        language: course.language,
        bgImage: course.bgImage,
        backgroundColor: officialCourseColors[id % officialCourseColors.length]
      };
    }).filter((c): c is NonNullable<typeof c> => c !== null);
  }, [user, courseData]);

  return (
    <DashboardLayout title="لوحة التحكم - المعلم">
      <div 
        className="relative overflow-hidden rounded-2xl bg-white border border-[#428177] p-6 md:p-8 mb-8 shadow-sm"
        style={{
          backgroundImage: `linear-gradient(to left, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.82)), url('/dashboard bg/otherbackground.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        dir="rtl"
      >
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#428177]/10 text-[#428177] text-xs font-bold mb-3 border border-[#428177]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#428177]" />
              <span>لوحة التحكم الخاصة بأعضاء هيئة التدريس</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#002623]">أهلاً بك، {user?.name || "الأستاذ الفاضل"} 👨‍🏫</h1>
            <p className="text-[#3D3A3B] mt-2 text-sm max-w-xl font-medium">
              إدارة المقررات المسندة، نشر المحاضرات والمواد، ومتابعة تسليمات الواجبات ورصد الدرجات.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-3 rounded-xl border border-[#428177]/30 text-xs font-bold text-[#002623] shadow-sm">
              <Clock className="w-4 h-4 text-[#428177]" />
              <span>اليوم: {formatStandardDate(new Date())}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="stack-md" dir="rtl">
        <div>
          <h2 className="text-xl font-bold mb-4 text-right text-[#002623]">المقررات المسندة إليك</h2>
          {myCourses.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {myCourses.map((course) => (
                course && <CourseCard
                  key={course.id}
                  id={course.id}
                  name={course.name}
                  code={course.code}
                  category={course.category}
                  period={course.period}
                  difficulty={course.difficulty}
                  teacher={course.teacher}
                  language={course.language}
                  bgImage={course.bgImage}
                  basePath="/teacher/courses"
                  backgroundColor={course.backgroundColor}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed rounded-2xl bg-white border-[#428177]/30">
              <BookOpen className="w-12 h-12 text-[#988561] mx-auto mb-3" />
              <p className="text-[#002623] font-medium">لا تدرس أي مقررات حالياً (إضافة المقررات تتم حصرياً عبر مدير النظام)</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
