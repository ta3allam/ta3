import DashboardLayout from "@/components/layout/DashboardLayout";
import { useParams } from "react-router-dom";
import coursesJson from "./courses.json";
import { CourseData } from "./types";

export default function CourseContact() {
    const { courseId } = useParams<{ courseId: string }>();
    const course = (coursesJson as unknown as CourseData)[Number(courseId)];

    return (
        <DashboardLayout title={`التواصل مع المعلم - ${course?.name || ""}`}>
            <div className="text-right space-y-4">
                <h1 className="text-3xl font-extrabold text-right">التواصل مع المعلم</h1>
                <p className="text-muted-foreground">يمكنك هنا إرسال رسائل مباشرة للمعلم المشرف على المقرر.</p>
                <div className="h-64 border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
                    سيتم إضافة نموذج التواصل هنا قريباً
                </div>
            </div>
        </DashboardLayout>
    );
}
