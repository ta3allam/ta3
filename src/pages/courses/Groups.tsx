import DashboardLayout from "@/components/layout/DashboardLayout";
import { useParams } from "react-router-dom";
import coursesJson from "./courses.json";
import { CourseData } from "./types";

export default function CourseGroups() {
    const { courseId } = useParams<{ courseId: string }>();
    const course = (coursesJson as unknown as CourseData)[Number(courseId)];

    return (
        <DashboardLayout title={`المجموعات - ${course?.name || ""}`}>
            <div className="layout-stack">
                <h1 className="page-title">المجموعات</h1>
                <p className="text-muted-foreground">هذه الصفحة ستعرض المجموعات الطلابية والعمل الجماعي.</p>
                <div className="placeholder-container">
                    سيتم إضافة المجموعات هنا قريباً
                </div>
            </div>
        </DashboardLayout>
    );
}
