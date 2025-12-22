import DashboardLayout from "@/components/layout/DashboardLayout";
import { CourseCard } from "@/components/student/CourseCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import coursesJson from "../courses/courses.json";
import { CourseData } from "../courses/types";
import { useMemo } from "react";

const courseColors = [
  "bg-pine-blue-600",
  "bg-rich-mahogany-500",
  "bg-evergreen-700",
  "bg-wine-plum-600",
  "bg-marine-teal-600"
];

export default function TeacherDashboard() {
  const { user } = useAuth();

  // Memoize the course data logic
  const myCourses = useMemo(() => {
    if (!user || user.role !== 'teacher' || !user.enrolledCourses) return [];

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
    <DashboardLayout title="لوحة التحكم - المعلم">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-right">لوحة التحكم - المعلم</h1>
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground hidden md:inline">مرحباً، {user?.name}</span>
          <Button>
            <Plus className="h-4 w-4 ml-2" />
            مقرر جديد
          </Button>
        </div>
      </div>

      <div className="space-y-6">
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
