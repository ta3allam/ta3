import { useState, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { CourseCard } from "@/components/student/CourseCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCourseData } from "@/contexts/CourseContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const courseColors = [
  "bg-pine-blue-600",
  "bg-rich-mahogany-500",
  "bg-evergreen-700",
  "bg-wine-plum-600",
  "bg-marine-teal-600"
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
        backgroundColor: courseColors[id % courseColors.length]
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
      <div className="section-between mb-6" dir="rtl">
        <h1 className="page-title">لوحة التحكم - المعلم</h1>
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground hidden md:inline">مرحباً، {user?.name}</span>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 ml-2" />
                مقرر جديد
              </Button>
            </DialogTrigger>
            <DialogContent dir="rtl">
              <DialogHeader>
                <DialogTitle className="text-right">مقرر جديد</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateCourse} className="stack-md text-right space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="block text-right">اسم المقرر</Label>
                  <Input id="name" name="name" required className="text-right" placeholder="مثال: مبادئ البرمجة بلغة بايثون" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code" className="block text-right">رمز المقرر</Label>
                  <Input id="code" name="code" required className="text-right" placeholder="مثال: CS202" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="block text-right">التصنيف</Label>
                  <Input id="category" name="category" className="text-right" placeholder="مثال: علوم الحاسوب" />
                </div>
                <Button type="submit" className="w-full mt-4">إنشاء المقرر</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="stack-md" dir="rtl">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-right">المقررات التي تدرسها</h2>
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
            <div className="text-center py-12 border rounded-lg bg-slate-50">
              <p className="text-muted-foreground">لا تدرس أي مقررات حالياً</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
