import DashboardLayout from "@/components/layout/DashboardLayout";
import { useParams } from "react-router-dom";
import coursesJson from "./courses.json";
import { CourseData } from "./types";

export default function CourseDiscussion() {
    const { courseId } = useParams<{ courseId: string }>();
    const course = (coursesJson as unknown as CourseData)[Number(courseId)];

    return (
        <DashboardLayout title={`النقاشات - ${course?.name || ""}`}>
            <div className="layout-stack">
                <h1 className="page-title">النقاشات</h1>
                <p className="text-muted-foreground">هذه الصفحة ستكون منصة للنقاش بين الطلاب والمعلمين.</p>
                <div className="placeholder-container">
                    سيتم إضافة منصة النقاش هنا قريباً
                </div>
            </div>
        </DashboardLayout>
    );
}
