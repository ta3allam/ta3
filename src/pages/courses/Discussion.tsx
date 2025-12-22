import DashboardLayout from "@/components/layout/DashboardLayout";
import { useParams } from "react-router-dom";
import coursesJson from "./courses.json";
import { CourseData } from "./types";

export default function CourseDiscussion() {
    const { courseId } = useParams<{ courseId: string }>();
    const course = (coursesJson as unknown as CourseData)[Number(courseId)];

    return (
        <DashboardLayout title={`النقاشات - ${course?.name || ""}`}>
            <div className="text-right space-y-4">
                <h1 className="text-3xl font-extrabold text-right">النقاشات</h1>
                <p className="text-muted-foreground">هذه الصفحة ستكون منصة للنقاش بين الطلاب والمعلمين.</p>
                <div className="h-64 border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
                    سيتم إضافة منصة النقاش هنا قريباً
                </div>
            </div>
        </DashboardLayout>
    );
}
