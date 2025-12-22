import DashboardLayout from "@/components/layout/DashboardLayout";
import { useParams } from "react-router-dom";
import coursesJson from "./courses.json";
import { CourseData } from "./types";

export default function CourseGroups() {
    const { courseId } = useParams<{ courseId: string }>();
    const course = (coursesJson as unknown as CourseData)[Number(courseId)];

    return (
        <DashboardLayout title={`المجموعات - ${course?.name || ""}`}>
            <div className="text-right space-y-4">
                <h1 className="text-3xl font-extrabold text-right">المجموعات</h1>
                <p className="text-muted-foreground">هذه الصفحة ستعرض المجموعات الطلابية والعمل الجماعي.</p>
                <div className="h-64 border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
                    سيتم إضافة المجموعات هنا قريباً
                </div>
            </div>
        </DashboardLayout>
    );
}
