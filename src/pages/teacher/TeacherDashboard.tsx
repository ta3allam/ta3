import { useState, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { CourseCard } from "@/components/student/CourseCard";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles, Clock, BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCourseData } from "@/contexts/CourseContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const officialCourseColors = [
  "bg-[#428177]", // Mountain Teal
  "bg-[#6B1F2A]", // Damask Red
  "bg-[#054239]", // Emerald Shadow
  "bg-[#988561]", // Golden Wheat
  "bg-[#4A151E]", // Black Cherry
  "bg-[#002623]", // Forest
];

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { courseData, addCourse } = useCourseData();
  const [open, setOpen] = useState(false);

  // Memoize the course data logic
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
        rating: course.rating,
        difficulty: course.difficulty,
        teacher: course.teacher,
        language: course.language,
        backgroundColor: officialCourseColors[id % officialCourseColors.length]
      };
    }).filter((c): c is NonNullable<typeof c> => c !== null);
  }, [user, courseData]);

  const handleCreateCourse = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const code = formData.get("code") as string;
    const category = formData.get("category") as string;

    if (!name || !code) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    addCourse({
      name,
      code,
      category: category || "عام",
      teacher: user?.name || "المعلم"
    });

    toast.success("تم إنشاء مقرر جديد بنجاح");
    setOpen(false);
  };

  return (
    <DashboardLayout title="لوحة التحكم - المعلم">
      {/* Profile Card: White background, thin Mountain Teal border (#428177), high-contrast text */}
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
              إدارة المقررات الدراسية، نشر المحاضرات والواجبات، ومتابعة تواصل الطلاب بكل مرونة.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-3 rounded-xl border border-[#428177]/30 text-xs font-bold text-[#002623] shadow-sm">
              <Clock className="w-4 h-4 text-[#428177]" />
              <span>{new Date().toLocaleDateString("ar-EG", { weekday: "long", day: "numeric", month: "long" })}</span>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#428177] hover:bg-[#054239] text-white border-none shadow-md font-bold">
                  <Plus className="h-4 w-4 ml-2" />
                  مقرر جديد
                </Button>
              </DialogTrigger>
              <DialogContent dir="rtl" className="bg-white border border-[#428177]">
                <DialogHeader>
                  <DialogTitle className="text-right text-[#002623]">مقرر جديد</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateCourse} className="stack-md text-right space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="block text-right text-[#002623] font-semibold">اسم المقرر</Label>
                    <Input id="name" name="name" required className="text-right border-[#428177]/40" placeholder="مثال: مبادئ البرمجة بلغة بايثون" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code" className="block text-right text-[#002623] font-semibold">رمز المقرر</Label>
                    <Input id="code" name="code" required className="text-right border-[#428177]/40" placeholder="مثال: CS202" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category" className="block text-right text-[#002623] font-semibold">التصنيف</Label>
                    <Input id="category" name="category" className="text-right border-[#428177]/40" placeholder="مثال: علوم الحاسوب" />
                  </div>
                  <Button type="submit" className="w-full mt-4 bg-[#428177] hover:bg-[#054239] text-white font-bold">إنشاء المقرر</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="stack-md" dir="rtl">
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
                  rating={course.rating}
                  difficulty={course.difficulty}
                  teacher={course.teacher}
                  language={course.language}
                  basePath="/teacher/courses"
                  backgroundColor={course.backgroundColor}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed rounded-2xl bg-white border-[#428177]/30">
              <BookOpen className="w-12 h-12 text-[#988561] mx-auto mb-3" />
              <p className="text-[#002623] font-medium">لا تدرس أي مقررات حالياً</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
