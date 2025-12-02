import { useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnnouncementCard } from "@/components/student/AnnouncementCard";
import { CourseEvents } from "@/components/student/CourseEvents";
import { LecturesList } from "@/components/student/LecturesList";
import { LectureDetail } from "@/components/student/LectureDetail";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock data - same as student view
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
        ],
        events: [
            {
                id: 1,
                title: "واجب الأسبوع 3",
                description: "حل تمارين الفصل الثالث",
                event_type: "assignment" as const,
                due_date: new Date(Date.now() + 259200000).toISOString(),
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
                ],
            },
        ],
    },
};

export default function TeacherCourseDetail() {
    const { courseId } = useParams<{ courseId: string }>();
    const course = courseData[Number(courseId) as keyof typeof courseData];
    const [selectedLectureId, setSelectedLectureId] = useState<number | undefined>();

    // Dialog states
    const [announcementDialogOpen, setAnnouncementDialogOpen] = useState(false);
    const [eventDialogOpen, setEventDialogOpen] = useState(false);
    const [lectureDialogOpen, setLectureDialogOpen] = useState(false);
    const [editLectureDialogOpen, setEditLectureDialogOpen] = useState(false);
    const [editingLecture, setEditingLecture] = useState<typeof course.lectures[0] | null>(null);

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

    const handleCreateAnnouncement = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        toast({
            title: "تم إنشاء الإعلان",
            description: `${formData.get('title')}`,
        });
        setAnnouncementDialogOpen(false);
    };

    const handleCreateEvent = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        toast({
            title: "تم إنشاء الحدث",
            description: `${formData.get('title')}`,
        });
        setEventDialogOpen(false);
    };

    const handleCreateLecture = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        // Get file counts
        const pdfFiles = formData.getAll('pdf_files');
        const imageFiles = formData.getAll('image_files');
        const otherFiles = formData.getAll('other_files');
        const totalFiles = pdfFiles.length + imageFiles.length + otherFiles.length;

        toast({
            title: "تم إنشاء المحاضرة",
            description: `${formData.get('title')} - ${totalFiles} ملف`,
        });
        setLectureDialogOpen(false);
    };

    const handleEditLecture = (lecture: typeof course.lectures[0]) => {
        setEditingLecture(lecture);
        setEditLectureDialogOpen(true);
    };

    const handleUpdateLecture = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        // Get file counts
        const pdfFiles = formData.getAll('pdf_files');
        const imageFiles = formData.getAll('image_files');
        const otherFiles = formData.getAll('other_files');
        const totalFiles = pdfFiles.length + imageFiles.length + otherFiles.length;

        toast({
            title: "تم تحديث المحاضرة",
            description: `${formData.get('title')} - ${totalFiles} ملف جديد`,
        });
        setEditLectureDialogOpen(false);
        setEditingLecture(null);
    };

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
                                <div className="flex items-center justify-between">
                                    <Dialog open={announcementDialogOpen} onOpenChange={setAnnouncementDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button>
                                                <Plus className="h-4 w-4 ml-2" />
                                                إعلان جديد
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle className="text-right">إعلان جديد</DialogTitle>
                                            </DialogHeader>
                                            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="title" className="text-right block">العنوان</Label>
                                                    <Input id="title" name="title" required className="text-right" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="content" className="text-right block">المحتوى</Label>
                                                    <Textarea id="content" name="content" required className="text-right" rows={4} />
                                                </div>
                                                <Button type="submit" className="w-full">نشر</Button>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                    <h2 className="text-2xl font-bold text-right">إعلانات المقرر</h2>
                                </div>
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
                            <div className="lg:col-span-1 space-y-4">
                                <div className="flex items-center justify-between">
                                    <Dialog open={eventDialogOpen} onOpenChange={setEventDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button size="sm">
                                                <Plus className="h-3 w-3 ml-1" />
                                                حدث
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle className="text-right">حدث جديد</DialogTitle>
                                            </DialogHeader>
                                            <form onSubmit={handleCreateEvent} className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="event-title" className="text-right block">العنوان</Label>
                                                    <Input id="event-title" name="title" required className="text-right" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="event-type" className="text-right block">النوع</Label>
                                                    <Select name="event_type" required>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="اختر النوع" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="assignment">واجب</SelectItem>
                                                            <SelectItem value="quiz">اختبار قصير</SelectItem>
                                                            <SelectItem value="exam">امتحان</SelectItem>
                                                            <SelectItem value="other">أخرى</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="due-date" className="text-right block">تاريخ الاستحقاق</Label>
                                                    <Input id="due-date" name="due_date" type="datetime-local" required />
                                                </div>
                                                <Button type="submit" className="w-full">إنشاء</Button>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                    <h3 className="text-lg font-bold text-right">الأحداث</h3>
                                </div>
                                <CourseEvents events={course.events} />
                            </div>
                        </div>
                    </TabsContent>

                    {/* Content Tab - Lectures Sidebar + Detail */}
                    <TabsContent value="content">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            {/* Lectures Sidebar */}
                            <div className="lg:col-span-1 space-y-4">
                                <div className="flex items-center justify-between">
                                    <Dialog open={lectureDialogOpen} onOpenChange={setLectureDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button size="sm">
                                                <Plus className="h-3 w-3 ml-1" />
                                                محاضرة
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle className="text-right">محاضرة جديدة</DialogTitle>
                                            </DialogHeader>
                                            <form onSubmit={handleCreateLecture} className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="lecture-title" className="text-right block">العنوان</Label>
                                                    <Input id="lecture-title" name="title" required className="text-right" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="lecture-desc" className="text-right block">الوصف</Label>
                                                    <Textarea
                                                        id="lecture-desc"
                                                        name="description"
                                                        className="text-right"
                                                        rows={3}
                                                        placeholder="يمكنك إضافة روابط في الوصف مثل: https://example.com"
                                                    />
                                                    <p className="text-xs text-muted-foreground text-right">
                                                        يمكنك إضافة روابط مباشرة في الوصف
                                                    </p>
                                                </div>

                                                {/* File Upload Section */}
                                                <div className="space-y-2">
                                                    <Label className="text-right block">المواد التعليمية</Label>
                                                    <div className="border-2 border-dashed rounded-lg p-4 space-y-3">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="pdf-upload" className="text-right block text-sm">
                                                                ملفات PDF
                                                            </Label>
                                                            <Input
                                                                id="pdf-upload"
                                                                name="pdf_files"
                                                                type="file"
                                                                accept=".pdf"
                                                                multiple
                                                                className="text-right"
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label htmlFor="image-upload" className="text-right block text-sm">
                                                                صور
                                                            </Label>
                                                            <Input
                                                                id="image-upload"
                                                                name="image_files"
                                                                type="file"
                                                                accept="image/*"
                                                                multiple
                                                                className="text-right"
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label htmlFor="other-upload" className="text-right block text-sm">
                                                                ملفات أخرى
                                                            </Label>
                                                            <Input
                                                                id="other-upload"
                                                                name="other_files"
                                                                type="file"
                                                                multiple
                                                                className="text-right"
                                                            />
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground text-right">
                                                        يمكنك اختيار ملفات متعددة لكل نوع
                                                    </p>
                                                </div>

                                                <Button type="submit" className="w-full">إنشاء المحاضرة</Button>
                                            </form>
                                        </DialogContent>
                                    </Dialog>

                                    {/* Edit Lecture Dialog */}
                                    <Dialog open={editLectureDialogOpen} onOpenChange={setEditLectureDialogOpen}>
                                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle className="text-right">تعديل المحاضرة</DialogTitle>
                                            </DialogHeader>
                                            <form onSubmit={handleUpdateLecture} className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="edit-lecture-title" className="text-right block">العنوان</Label>
                                                    <Input
                                                        id="edit-lecture-title"
                                                        name="title"
                                                        required
                                                        className="text-right"
                                                        defaultValue={editingLecture?.title}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="edit-lecture-desc" className="text-right block">الوصف</Label>
                                                    <Textarea
                                                        id="edit-lecture-desc"
                                                        name="description"
                                                        className="text-right"
                                                        rows={3}
                                                        placeholder="يمكنك إضافة روابط في الوصف مثل: https://example.com"
                                                        defaultValue={editingLecture?.description}
                                                    />
                                                    <p className="text-xs text-muted-foreground text-right">
                                                        يمكنك إضافة روابط مباشرة في الوصف
                                                    </p>
                                                </div>

                                                {/* File Upload Section */}
                                                <div className="space-y-2">
                                                    <Label className="text-right block">إضافة مواد تعليمية جديدة</Label>
                                                    <div className="border-2 border-dashed rounded-lg p-4 space-y-3">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="edit-pdf-upload" className="text-right block text-sm">
                                                                ملفات PDF
                                                            </Label>
                                                            <Input
                                                                id="edit-pdf-upload"
                                                                name="pdf_files"
                                                                type="file"
                                                                accept=".pdf"
                                                                multiple
                                                                className="text-right"
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label htmlFor="edit-image-upload" className="text-right block text-sm">
                                                                صور
                                                            </Label>
                                                            <Input
                                                                id="edit-image-upload"
                                                                name="image_files"
                                                                type="file"
                                                                accept="image/*"
                                                                multiple
                                                                className="text-right"
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label htmlFor="edit-other-upload" className="text-right block text-sm">
                                                                ملفات أخرى
                                                            </Label>
                                                            <Input
                                                                id="edit-other-upload"
                                                                name="other_files"
                                                                type="file"
                                                                multiple
                                                                className="text-right"
                                                            />
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground text-right">
                                                        يمكنك اختيار ملفات متعددة لكل نوع
                                                    </p>
                                                </div>

                                                <Button type="submit" className="w-full">حفظ التغييرات</Button>
                                            </form>
                                        </DialogContent>
                                    </Dialog>

                                    <h3 className="text-lg font-bold text-right">المحاضرات</h3>
                                </div>
                                <LecturesList
                                    lectures={course.lectures}
                                    selectedLectureId={selectedLectureId}
                                    onSelectLecture={setSelectedLectureId}
                                />
                            </div>

                            {/* Lecture Detail */}
                            <div className="lg:col-span-3">
                                <LectureDetail
                                    lecture={selectedLecture || null}
                                    isTeacher={true}
                                    onEdit={handleEditLecture}
                                />
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
