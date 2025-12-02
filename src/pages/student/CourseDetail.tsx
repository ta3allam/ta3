import { useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnnouncementCard } from "@/components/student/AnnouncementCard";
import { CourseEvents } from "@/components/student/CourseEvents";
import { LecturesList } from "@/components/student/LecturesList";
import { LectureDetail } from "@/components/student/LectureDetail";

// Mock data - will be replaced with Supabase queries
const courseData = {
    1: {
        name: "مبادئ البرمجة",
        code: "CS101",
        announcements: [
            {
                id: 1,
                title: "واجب الأسبوع الثالث",
                content: "تسليم الواجب يوم الخميس القادم قبل الساعة 11:59 مساءً",
                authorName: "د. أحمد محمد",
                createdAt: new Date().toISOString(),
            },
            {
                id: 2,
                title: "محاضرة إضافية",
                content: "سيتم عقد محاضرة إضافية يوم الأربعاء في القاعة 201",
                authorName: "د. أحمد محمد",
                createdAt: new Date(Date.now() - 172800000).toISOString(),
            },
        ],
        events: [
            {
                id: 1,
                title: "واجب الأسبوع 3",
                description: "حل تمارين الفصل الثالث",
                event_type: "assignment" as const,
                due_date: new Date(Date.now() + 259200000).toISOString(),
            },
            {
                id: 2,
                title: "اختبار قصير 1",
                event_type: "quiz" as const,
                due_date: new Date(Date.now() + 604800000).toISOString(),
            },
        ],
        lectures: [
            {
                id: 1,
                title: "الأسبوع 1: مقدمة في البرمجة",
                description: "نظرة عامة على مفاهيم البرمجة الأساسية",
                materials: [
                    {
                        id: 1,
                        title: "مقدمة.pdf",
                        file_url: "#",
                        file_type: "pdf" as const,
                        file_size: 2400000,
                    },
                    {
                        id: 2,
                        title: "أمثلة.pdf",
                        file_url: "#",
                        file_type: "pdf" as const,
                        file_size: 1800000,
                    },
                ],
            },
            {
                id: 2,
                title: "الأسبوع 2: المتغيرات وأنواع البيانات",
                description: "التعرف على المتغيرات وأنواع البيانات المختلفة",
                materials: [
                    {
                        id: 3,
                        title: "المتغيرات.pdf",
                        file_url: "#",
                        file_type: "pdf" as const,
                        file_size: 3200000,
                    },
                ],
            },
            {
                id: 3,
                title: "الأسبوع 3: الجمل الشرطية",
                description: "استخدام if, else, switch",
                materials: [],
            },
        ],
    },
    2: {
        name: "الرياضيات المتقدمة",
        code: "MATH201",
        announcements: [
            {
                id: 3,
                title: "اختبار منتصف الفصل",
                content: "الاختبار سيكون يوم الأحد القادم، يرجى المراجعة الجيدة",
                authorName: "د. فاطمة علي",
                createdAt: new Date(Date.now() - 86400000).toISOString(),
            },
        ],
        events: [],
        lectures: [],
    },
    3: {
        name: "هندسة البرمجيات",
        code: "CS301",
        announcements: [],
        events: [],
        lectures: [],
    },
};

export default function CourseDetail() {
    const { courseId } = useParams<{ courseId: string }>();
    const course = courseData[Number(courseId) as keyof typeof courseData];
    const [selectedLectureId, setSelectedLectureId] = useState<number | undefined>();

    if (!course) {
        return (
            <DashboardLayout title="المقرر غير موجود">
                <div className="text-center py-12">
                    <h1 className="text-2xl font-bold text-muted-foreground">المقرر غير موجود</h1>
                </div>
            </DashboardLayout>
        );
    }

    const selectedLecture = course.lectures.find(l => l.id === selectedLectureId);

    return (
        <DashboardLayout title={course.name}>
            <div className="space-y-6">
                {/* Course Header */}
                <div className="text-right">
                    <h1 className="text-3xl font-extrabold">{course.name}</h1>
                    <p className="text-muted-foreground">{course.code}</p>
                </div>

                {/* Secondary Navbar with Tabs */}
                <Tabs defaultValue="home" className="w-full" dir="rtl">
                    <div className="bg-secondary rounded-lg p-2 mb-6">
                        <TabsList className="w-full justify-start bg-transparent">
                            <TabsTrigger value="home" className="flex-1">الرئيسية</TabsTrigger>
                            <TabsTrigger value="content" className="flex-1">المحتوى</TabsTrigger>
                            <TabsTrigger value="help" className="flex-1">المساعدة</TabsTrigger>
                        </TabsList>
                    </div>

                    {/* Home Tab - Announcements + Events */}
                    <TabsContent value="home">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Announcements - 2/3 width */}
                            <div className="lg:col-span-2 space-y-4">
                                <h2 className="text-2xl font-bold text-right">إعلانات المقرر</h2>
                                {course.announcements.length > 0 ? (
                                    course.announcements.map((announcement) => (
                                        <AnnouncementCard
                                            key={announcement.id}
                                            title={announcement.title}
                                            content={announcement.content}
                                            authorName={announcement.authorName}
                                            createdAt={announcement.createdAt}
                                        />
                                    ))
                                ) : (
                                    <div className="text-center py-12 text-muted-foreground">
                                        لا توجد إعلانات حالياً
                                    </div>
                                )}
                            </div>

                            {/* Events Sidebar - 1/3 width */}
                            <div className="lg:col-span-1">
                                <CourseEvents events={course.events} />
                            </div>
                        </div>
                    </TabsContent>

                    {/* Content Tab - Lectures Sidebar + Detail */}
                    <TabsContent value="content">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            {/* Lectures Sidebar */}
                            <div className="lg:col-span-1">
                                <h3 className="text-xl font-bold mb-4 text-right">المحاضرات</h3>
                                <LecturesList
                                    lectures={course.lectures}
                                    selectedLectureId={selectedLectureId}
                                    onSelectLecture={setSelectedLectureId}
                                />
                            </div>

                            {/* Lecture Detail */}
                            <div className="lg:col-span-3">
                                <LectureDetail lecture={selectedLecture || null} />
                            </div>
                        </div>
                    </TabsContent>

                    {/* Help Tab - Placeholder */}
                    <TabsContent value="help">
                        <div className="text-center py-12 text-muted-foreground">
                            <h3 className="text-xl font-semibold mb-2">المساعدة</h3>
                            <p>سيتم إضافة قسم المساعدة قريباً</p>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
}
