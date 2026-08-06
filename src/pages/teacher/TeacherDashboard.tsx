import { useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { CourseCard } from "@/components/student/CourseCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Clock, BookOpen, FileCheck, Users, AlertCircle, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCourseData } from "@/contexts/CourseContext";
import { getAssetUrl } from "@/lib/assetUtils";
import { Link } from "react-router-dom";

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
        submissions: course.submissions || [],
        assignmentsCount: (course.assignments || []).length,
        lecturesCount: (course.lectures || []).length,
        backgroundColor: officialCourseColors[id % officialCourseColors.length]
      };
    }).filter((c): c is NonNullable<typeof c> => c !== null);
  }, [user, courseData]);

  const pendingSubmissions = useMemo(() => {
    const list: Array<{ courseId: number; courseName: string; studentName: string; assignmentId: number; submittedAt: string }> = [];
    myCourses.forEach((c) => {
      if (c && c.submissions) {
        c.submissions.forEach((sub) => {
          if (sub.grade === undefined) {
            list.push({
              courseId: c.id,
              courseName: c.name,
              studentName: sub.studentName,
              assignmentId: sub.assignmentId,
              submittedAt: sub.submittedAt
            });
          }
        });
      }
    });
    return list;
  }, [myCourses]);

  return (
    <DashboardLayout title="لوحة التحكم - المعلم">
      {/* Teacher Profile Banner */}
      <div 
        className="relative overflow-hidden rounded-2xl bg-white border border-[#428177] p-6 md:p-8 mb-8 shadow-sm"
        style={{
          backgroundImage: `linear-gradient(to left, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.82)), url('${getAssetUrl("/dashboard bg/otherbackground.png")}')`,
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
              إدارة المقررات المسندة، متابعة تسليمات الطلاب للواجبات، ورصد التقييمات بكل سهولة.
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

      <div className="space-y-8" dir="rtl">
        {/* Gradebook Overview KPI Matrix */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border border-[#428177]/30 bg-white shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-[#002623]">المقررات المسندة</CardTitle>
              <BookOpen className="h-5 w-5 text-[#428177]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-[#002623]">{myCourses.length}</div>
              <p className="text-xs text-[#3D3A3B] mt-1 font-semibold">مقررات نشطة لهذا الفصل</p>
            </CardContent>
          </Card>

          <Card className="border border-[#428177]/30 bg-white shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-[#002623]">التسليمات بانتظار الرصد</CardTitle>
              <FileCheck className="h-5 w-5 text-[#988561]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-[#6B1F2A]">{pendingSubmissions.length}</div>
              <p className="text-xs text-[#3D3A3B] mt-1 font-semibold">تتطلب التقييم وإدخال الدرجة</p>
            </CardContent>
          </Card>

          <Card className="border border-[#428177]/30 bg-white shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-[#002623]">إجمالي الطلاب المسجلين</CardTitle>
              <Users className="h-5 w-5 text-[#054239]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-[#002623]">48</div>
              <p className="text-xs text-[#3D3A3B] mt-1 font-semibold">طالب وطالبة شعب معتمدة</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Submissions Alert Box */}
        {pendingSubmissions.length > 0 && (
          <Card className="border border-[#988561]/40 bg-[#EDEBE0]/40 shadow-sm rounded-2xl text-right">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-[#002623]">
                <AlertCircle className="w-5 h-5 text-[#6B1F2A]" />
                <CardTitle className="text-lg font-bold">تنبيه: تسليمات طلاب بانتظار التقييم</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-[#3D3A3B] font-medium">يوجد {pendingSubmissions.length} واجبات تم تسليمها مؤخراً وتتطلب تصحيحاً ورصد الدرجات:</p>
              <div className="grid gap-2">
                {pendingSubmissions.map((sub, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-xl border border-[#428177]/20 text-xs">
                    <span className="font-bold text-[#002623]">{sub.studentName} ({sub.courseName})</span>
                    <Button asChild size="sm" className="bg-[#428177] hover:bg-[#054239] text-white font-bold h-7 text-[11px]">
                      <Link to={`/teacher/courses/${sub.courseId}`}>
                        الانتقال لوحة الرصد
                        <ArrowLeft className="w-3 h-3 mr-1" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Assigned Courses Grid */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-right text-[#002623]">المقررات التي تدرسها</h2>
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
