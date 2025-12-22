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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useCourseData } from "@/contexts/CourseContext";

export default function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const isTeacher = user?.role === 'teacher';

  const {
    courseData,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    addLecture,
    updateLecture,
    deleteLecture,
    addEvent,
    updateEvent,
    deleteEvent,
    addAssignment,
    updateAssignment,
    deleteAssignment
  } = useCourseData();

  const course = courseData[Number(courseId)];
  const [selectedLectureId, setSelectedLectureId] = useState<number | undefined>();

  // Dialog states
  const [announcementDialogOpen, setAnnouncementDialogOpen] = useState(false);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [lectureDialogOpen, setLectureDialogOpen] = useState(false);
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);

  // Edit states
  const [editingAnnouncement, setEditingAnnouncement] = useState<typeof course.announcements[0] | null>(null);
  const [editingEvent, setEditingEvent] = useState<typeof course.events[0] | null>(null);
  const [editingLecture, setEditingLecture] = useState<typeof course.lectures[0] | null>(null);
  const [editingAssignment, setEditingAssignment] = useState<typeof course.assignments[0] | null>(null);

  // Delete confirmation states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: number } | null>(null);

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

  // Announcement handlers
  const handleCreateAnnouncement = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    addAnnouncement(Number(courseId), {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      authorName: user?.name || 'المعلم',
      createdAt: new Date().toISOString()
    });

    toast.success("تم إنشاء الإعلان بنجاح");
    setAnnouncementDialogOpen(false);
    e.currentTarget.reset();
  };

  const handleUpdateAnnouncement = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingAnnouncement) return;

    const formData = new FormData(e.currentTarget);
    updateAnnouncement(Number(courseId), editingAnnouncement.id, {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
    });

    toast.success("تم تحديث الإعلان بنجاح");
    setEditingAnnouncement(null);
  };

  // Event handlers
  const handleCreateEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    addEvent(Number(courseId), {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      event_type: formData.get('event_type') as any,
      due_date: new Date(formData.get('due_date') as string).toISOString()
    });

    toast.success("تم إنشاء الحدث بنجاح");
    setEventDialogOpen(false);
    e.currentTarget.reset();
  };

  const handleUpdateEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingEvent) return;

    const formData = new FormData(e.currentTarget);
    updateEvent(Number(courseId), editingEvent.id, {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      event_type: formData.get('event_type') as any,
      due_date: new Date(formData.get('due_date') as string).toISOString()
    });

    toast.success("تم تحديث الحدث بنجاح");
    setEditingEvent(null);
  };

  // Lecture handlers
  const handleCreateLecture = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    addLecture(Number(courseId), {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      materials: []
    });

    toast.success("تم إنشاء المحاضرة بنجاح");
    setLectureDialogOpen(false);
    e.currentTarget.reset();
  };

  const handleUpdateLecture = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingLecture) return;

    const formData = new FormData(e.currentTarget);
    updateLecture(Number(courseId), editingLecture.id, {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
    });

    toast.success("تم تحديث المحاضرة بنجاح");
    setEditingLecture(null);
  };

  // Assignment handlers
  const handleCreateAssignment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get('file') as File;

    addAssignment(Number(courseId), {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      hasFile: file && file.size > 0,
      fileName: file?.name,
      dueDate: new Date(formData.get('dueDate') as string).toISOString()
    });

    toast.success("تم إنشاء الواجب بنجاح");
    setAssignmentDialogOpen(false);
    e.currentTarget.reset();
  };

  const handleUpdateAssignment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingAssignment) return;

    const formData = new FormData(e.currentTarget);
    const file = formData.get('file') as File;

    updateAssignment(Number(courseId), editingAssignment.id, {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      hasFile: file && file.size > 0 ? true : editingAssignment.hasFile,
      fileName: file && file.size > 0 ? file.name : editingAssignment.fileName,
      dueDate: new Date(formData.get('dueDate') as string).toISOString()
    });

    toast.success("تم تحديث الواجب بنجاح");
    setEditingAssignment(null);
  };

  // Delete handler
  const handleDelete = () => {
    if (!deleteTarget) return;

    switch (deleteTarget.type) {
      case 'announcement':
        deleteAnnouncement(Number(courseId), deleteTarget.id);
        toast.success("تم حذف الإعلان");
        break;
      case 'event':
        deleteEvent(Number(courseId), deleteTarget.id);
        toast.success("تم حذف الحدث");
        break;
      case 'lecture':
        deleteLecture(Number(courseId), deleteTarget.id);
        toast.success("تم حذف المحاضرة");
        if (selectedLectureId === deleteTarget.id) {
          setSelectedLectureId(undefined);
        }
        break;
      case 'assignment':
        deleteAssignment(Number(courseId), deleteTarget.id);
        toast.success("تم حذف الواجب");
        break;
    }

    setDeleteConfirmOpen(false);
    setDeleteTarget(null);
  };

  const confirmDelete = (type: string, id: number) => {
    setDeleteTarget({ type, id });
    setDeleteConfirmOpen(true);
  };

  return (
    <DashboardLayout title={course.name}>
      <div className="space-y-6">
        {/* Course Header */}
        <div className="text-right">
          <h1 className="text-3xl font-extrabold">{course.name}</h1>
          <p className="text-muted-foreground">{course.code}</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="home" className="w-full" dir="rtl">
          <div className="bg-secondary rounded-lg p-2 mb-6">
            <TabsList className="w-full justify-start bg-transparent">
              <TabsTrigger value="home" className="flex-1">الرئيسية</TabsTrigger>
              <TabsTrigger value="content" className="flex-1">المحتوى</TabsTrigger>
              <TabsTrigger value="assignments" className="flex-1">الواجبات</TabsTrigger>
              <TabsTrigger value="help" className="flex-1">المساعدة</TabsTrigger>
            </TabsList>
          </div>

          {/* Home Tab */}
          <TabsContent value="home">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Announcements */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  {isTeacher && (
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
                  )}
                  <h2 className="text-2xl font-bold text-right">إعلانات المقرر</h2>
                </div>

                {course.announcements.length > 0 ? (
                  course.announcements.map((announcement) => (
                    <div key={announcement.id} className="relative group">
                      <AnnouncementCard
                        title={announcement.title}
                        content={announcement.content}
                        authorName={announcement.authorName}
                        createdAt={announcement.createdAt}
                      />
                      {isTeacher && (
                        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingAnnouncement(announcement)}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => confirmDelete('announcement', announcement.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    لا توجد إعلانات حالياً
                  </div>
                )}
              </div>

              {/* Events Sidebar */}
              <div className="lg:col-span-1 space-y-4">
                <div className="flex items-center justify-between">
                  {isTeacher && (
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
                            <Label htmlFor="event-description" className="text-right block">الوصف</Label>
                            <Textarea id="event-description" name="description" className="text-right" rows={3} />
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
                  )}
                  <h3 className="text-lg font-bold text-right">الأحداث</h3>
                </div>
                <CourseEvents events={course.events} />
              </div>
            </div>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Lectures Sidebar */}
              <div className="lg:col-span-1 space-y-4">
                <div className="flex items-center justify-between">
                  {isTeacher && (
                    <Dialog open={lectureDialogOpen} onOpenChange={setLectureDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="h-3 w-3 ml-1" />
                          محاضرة
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
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
                              placeholder="يمكنك إضافة روابط في الوصف"
                            />
                          </div>
                          <Button type="submit" className="w-full">إنشاء المحاضرة</Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  )}
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
                  isTeacher={isTeacher}
                  onEdit={isTeacher ? (lecture) => setEditingLecture(lecture) : undefined}
                  onDelete={isTeacher ? (lectureId) => confirmDelete('lecture', lectureId) : undefined}
                />
              </div>
            </div>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                {isTeacher && (
                  <Dialog open={assignmentDialogOpen} onOpenChange={setAssignmentDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 ml-2" />
                        واجب جديد
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-right">إنشاء واجب جديد</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleCreateAssignment} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="assignment-title" className="text-right block">عنوان الواجب</Label>
                          <Input id="assignment-title" name="title" required className="text-right" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="assignment-desc" className="text-right block">وصف الواجب</Label>
                          <Textarea id="assignment-desc" name="description" required className="text-right" rows={4} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="assignment-due" className="text-right block">تاريخ التسليم</Label>
                          <Input id="assignment-due" name="dueDate" type="datetime-local" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="assignment-file" className="text-right block">ملف الواجب (PDF) - اختياري</Label>
                          <Input id="assignment-file" name="file" type="file" accept=".pdf" className="text-right" />
                        </div>
                        <Button type="submit" className="w-full">إنشاء الواجب</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
                <h2 className="text-2xl font-bold text-right">الواجبات</h2>
              </div>

              <div className="grid gap-4">
                {course.assignments && course.assignments.length > 0 ? (
                  course.assignments.map((assignment) => (
                    <div key={assignment.id} className="border rounded-lg p-6 text-right space-y-4 hover:bg-slate-50 transition-colors relative group">
                      <div className="flex justify-between items-start">
                        <div className="text-left text-sm text-muted-foreground">
                          تاريخ الاستحقاق: {new Date(assignment.dueDate).toLocaleDateString('ar-EG')}
                        </div>
                        <div>
                          <h3 className="font-bold text-xl">{assignment.title}</h3>
                        </div>
                      </div>

                      <p className="text-muted-foreground">{assignment.description}</p>

                      {assignment.hasFile && (
                        <div className="inline-flex items-center text-blue-600 bg-blue-50 px-3 py-1 rounded-md text-sm">
                          <span className="mr-2">{assignment.fileName}</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text ml-1"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4h4" /></svg>
                        </div>
                      )}

                      {isTeacher && (
                        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingAssignment(assignment)}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => confirmDelete('assignment', assignment.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    لا توجد واجبات حالياً
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Help Tab */}
          <TabsContent value="help">
            <div className="text-center py-12 text-muted-foreground">
              <h3 className="text-xl font-semibold mb-2">المساعدة</h3>
              <p>سيتم إضافة قسم المساعدة قريباً</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Dialogs */}
      {editingAnnouncement && (
        <Dialog open={!!editingAnnouncement} onOpenChange={() => setEditingAnnouncement(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-right">تعديل الإعلان</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateAnnouncement} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title" className="text-right block">العنوان</Label>
                <Input id="edit-title" name="title" defaultValue={editingAnnouncement.title} required className="text-right" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-content" className="text-right block">المحتوى</Label>
                <Textarea id="edit-content" name="content" defaultValue={editingAnnouncement.content} required className="text-right" rows={4} />
              </div>
              <Button type="submit" className="w-full">حفظ التغييرات</Button>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {editingLecture && (
        <Dialog open={!!editingLecture} onOpenChange={() => setEditingLecture(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-right">تعديل المحاضرة</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateLecture} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-lecture-title" className="text-right block">العنوان</Label>
                <Input
                  id="edit-lecture-title"
                  name="title"
                  defaultValue={editingLecture.title}
                  required
                  className="text-right"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-lecture-desc" className="text-right block">الوصف</Label>
                <Textarea
                  id="edit-lecture-desc"
                  name="description"
                  defaultValue={editingLecture.description}
                  className="text-right"
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full">حفظ التغييرات</Button>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {editingAssignment && (
        <Dialog open={!!editingAssignment} onOpenChange={() => setEditingAssignment(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-right">تعديل الواجب</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateAssignment} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-assignment-title" className="text-right block">عنوان الواجب</Label>
                <Input id="edit-assignment-title" name="title" defaultValue={editingAssignment.title} required className="text-right" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-assignment-desc" className="text-right block">وصف الواجب</Label>
                <Textarea id="edit-assignment-desc" name="description" defaultValue={editingAssignment.description} required className="text-right" rows={4} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-assignment-due" className="text-right block">تاريخ التسليم</Label>
                <Input
                  id="edit-assignment-due"
                  name="dueDate"
                  type="datetime-local"
                  defaultValue={new Date(editingAssignment.dueDate).toISOString().slice(0, 16)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-assignment-file" className="text-right block">ملف جديد (اختياري)</Label>
                <Input id="edit-assignment-file" name="file" type="file" accept=".pdf" className="text-right" />
                {editingAssignment.hasFile && (
                  <p className="text-sm text-muted-foreground text-right">
                    الملف الحالي: {editingAssignment.fileName}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full">حفظ التغييرات</Button>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right">هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              لا يمكن التراجع عن هذا الإجراء. سيتم حذف هذا العنصر نهائياً.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-2">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
