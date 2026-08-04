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
      {/* Welcome Banner using official otherbackground.png */}
      <div 
        className="relative overflow-hidden rounded-2xl bg-cover bg-center text-white p-6 md:p-8 mb-8 shadow-xl border border-stone-700/30"
        style={{ backgroundImage: `linear-gradient(to left, rgba(38, 15, 20, 0.85), rgba(0, 38, 35, 0.85)), url('/dashboard bg/otherbackground.png')` }}
        dir="rtl"
      >
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B9A779]/20 text-[#EDEBE0] text-xs font-semibold mb-3 border border-[#B9A779]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#988561]" />
              <span>لوحة التحكم الخاصة بأعضاء هيئة التدريس</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#EDEBE0]">أهلاً بك، {user?.name || "الأستاذ الفاضل"} 👨‍🏫</h1>
            <p className="text-[#EDEBE0]/80 mt-2 text-sm max-w-xl">
              إدارة المقررات الدراسية، نشر المحاضرات والواجبات، ومتابعة تواصل الطلاب بكل مرونة.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 text-xs font-medium text-[#EDEBE0]">
              <Clock className="w-4 h-4 text-[#988561]" />
              <span>{new Date().toLocaleDateString("ar-EG", { weekday: "long", day: "numeric", month: "long" })}</span>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#428177] hover:bg-[#054239] text-white border-none shadow-md">
                  <Plus className="h-4 w-4 ml-2" />
                  مقرر جديد
                </Button>
              </DialogTrigger>
              <DialogContent dir="rtl">
                <DialogHeader>
                  <DialogTitle className="text-right text-[#002623]">مقرر جديد</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateCourse} className="stack-md text-right space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="block text-right text-[#002623]">اسم المقرر</Label>
                    <Input id="name" name="name" required className="text-right" placeholder="مثال: مبادئ البرمجة بلغة بايثون" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code" className="block text-right text-[#002623]">رمز المقرر</Label>
                    <Input id="code" name="code" required className="text-right" placeholder="مثال: CS202" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category" className="block text-right text-[#002623]">التصنيف</Label>
                    <Input id="category" name="category" className="text-right" placeholder="مثال: علوم الحاسوب" />
                  </div>
                  <Button type="submit" className="w-full mt-4 bg-[#428177] hover:bg-[#054239] text-white">إنشاء المقرر</Button>
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
            <div className="text-center py-16 border border-dashed rounded-2xl bg-[#EDEBE0]/40">
              <BookOpen className="w-12 h-12 text-[#988561] mx-auto mb-3" />
              <p className="text-[#002623] font-medium">لا تدرس أي مقررات حالياً</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
