import { useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnnouncementCard } from "@/components/student/AnnouncementCard";
import { CourseEvents } from "@/components/student/CourseEvents";
import { LecturesList } from "@/components/student/LecturesList";
import { LectureDetail } from "@/components/student/LectureDetail";
import { Button } from "@/components/ui/button";
import AnnouncementDialog from "@/components/courses/AnnouncementDialog";
import EventDialog from "@/components/courses/EventDialog";
import LectureDialog from "@/components/courses/LectureDialog";
import AssignmentDialog from "@/components/courses/AssignmentDialog";
import AssignmentSubmissions from "@/components/courses/AssignmentSubmissions";
import GradingConsole from "@/components/courses/GradingConsole";
import CourseDiscussions from "@/components/courses/CourseDiscussions";
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
import { EventType } from "./types";

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
  const [expandedAssignmentId, setExpandedAssignmentId] = useState<number | null>(null);

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

  // Announcement handler
  const handleSaveAnnouncement = (data: { title: string; content: string }) => {
    if (editingAnnouncement) {
      updateAnnouncement(Number(courseId), editingAnnouncement.id, data);
      toast.success("تم تحديث الإعلان بنجاح");
      setEditingAnnouncement(null);
    } else {
      addAnnouncement(Number(courseId), {
        ...data,
        authorName: user?.name || 'المعلم',
        createdAt: new Date().toISOString()
      });
      toast.success("تم إنشاء الإعلان بنجاح");
      setAnnouncementDialogOpen(false);
    }
  };

  // Event handler
  const handleSaveEvent = (data: { title: string; description: string; event_type: EventType; due_date: string }) => {
    if (editingEvent) {
      updateEvent(Number(courseId), editingEvent.id, data);
      toast.success("تم تحديث الحدث بنجاح");
      setEditingEvent(null);
    } else {
      addEvent(Number(courseId), data);
      toast.success("تم إنشاء الحدث بنجاح");
      setEventDialogOpen(false);
    }
  };

  // Lecture handler
  const handleSaveLecture = (data: { title: string; description: string }) => {
    if (editingLecture) {
      updateLecture(Number(courseId), editingLecture.id, data);
      toast.success("تم تحديث المحاضرة بنجاح");
      setEditingLecture(null);
    } else {
      addLecture(Number(courseId), {
        ...data,
        materials: []
      });
      toast.success("تم إنشاء المحاضرة بنجاح");
      setLectureDialogOpen(false);
    }
  };

  // Assignment handler
  const handleSaveAssignment = (data: { title: string; description: string; dueDate: string; file: File | null }) => {
    const fileDetails = data.file ? {
      hasFile: true,
      fileName: data.file.name
    } : {};

    if (editingAssignment) {
      updateAssignment(Number(courseId), editingAssignment.id, {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        ...fileDetails
      });
      toast.success("تم تحديث الواجب بنجاح");
      setEditingAssignment(null);
    } else {
      addAssignment(Number(courseId), {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        hasFile: !!data.file,
        fileName: data.file?.name
      });
      toast.success("تم إنشاء الواجب بنجاح");
      setAssignmentDialogOpen(false);
    }
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

  const activeLectureId = selectedLectureId ?? course.lectures[0]?.id;
  const bannerBg = course.bgImage || (course.category?.includes("رياضيات") ? '/coursesbg/math.png' : '/coursesbg/coding.png');

  return (
    <DashboardLayout title={course.name}>
      <div className="space-y-6" dir="rtl">
        {/* Course Header Banner */}
        <div 
          className="relative overflow-hidden rounded-2xl bg-white border border-[#428177] p-6 md:p-8 shadow-sm"
          style={{
            backgroundImage: `linear-gradient(to left, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.78)), url('${bannerBg}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#428177]/10 text-[#428177] text-xs font-bold mb-2 border border-[#428177]/30">
                مقرر دراسي • {course.code}
              </span>
              <h1 className="text-3xl font-extrabold text-[#002623]">{course.name}</h1>
              <p className="text-xs text-[#3D3A3B] mt-1 font-medium">المعلم المسؤول: {course.teacher || "أستاذ المادة"}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="home" className="w-full" dir="rtl">
          <div className="bg-[#EDEBE0] p-1.5 rounded-xl mb-6 border border-[#428177]/20">
            <TabsList className="w-full justify-start bg-transparent gap-1">
              <TabsTrigger value="home" className="flex-1 font-bold data-[state=active]:bg-[#428177] data-[state=active]:text-white">الرئيسية</TabsTrigger>
              <TabsTrigger value="content" className="flex-1 font-bold data-[state=active]:bg-[#428177] data-[state=active]:text-white">المحتوى والمحاضرات</TabsTrigger>
              <TabsTrigger value="assignments" className="flex-1 font-bold data-[state=active]:bg-[#428177] data-[state=active]:text-white">الواجبات والتكليفات</TabsTrigger>
              <TabsTrigger value="help" className="flex-1 font-bold data-[state=active]:bg-[#428177] data-[state=active]:text-white">الدليل والمساعدة</TabsTrigger>
            </TabsList>
          </div>

          {/* Home Tab */}
          <TabsContent value="home">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" dir="rtl">
              {/* Main Column: Announcements */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-[#002623]">إعلانات المقرر</h2>
                  {isTeacher && (
                    <Button onClick={() => setAnnouncementDialogOpen(true)} className="bg-[#428177] hover:bg-[#054239] text-white font-bold">
                      <Plus className="h-4 w-4 ml-2" />
                      إعلان جديد
                    </Button>
                  )}
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
                  <div className="text-center py-12 text-xs text-[#3D3A3B] bg-white border border-dashed border-[#428177]/30 rounded-2xl">
                    لا توجد إعلانات حالياً
                  </div>
                )}
              </div>

              {/* Sidebar Column: Events */}
              <div className="lg:col-span-1 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#002623]">الأحداث القادمة</h3>
                  {isTeacher && (
                    <Button size="sm" onClick={() => setEventDialogOpen(true)} className="bg-[#428177] text-white font-bold">
                      <Plus className="h-3 w-3 ml-1" />
                      حدث
                    </Button>
                  )}
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
                <div className="section-between">
                  {isTeacher && (
                    <Button size="sm" onClick={() => setLectureDialogOpen(true)}>
                      <Plus className="h-3 w-3 ml-1" />
                      محاضرة
                    </Button>
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
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#002623]">قائمة الواجبات المعتمدة</h2>
                {isTeacher && (
                  <Button onClick={() => setAssignmentDialogOpen(true)} className="bg-[#428177] hover:bg-[#054239] text-white font-bold">
                    <Plus className="h-4 w-4 ml-2" />
                    واجب جديد
                  </Button>
                )}
              </div>

              <div className="grid gap-4">
                {course.assignments && course.assignments.length > 0 ? (
                  course.assignments.map((assignment) => (
                    <div key={assignment.id} className="border border-[#428177]/30 bg-white rounded-2xl p-6 text-right space-y-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center pb-3 border-b border-[#EDEBE0]">
                        <div className="flex items-center gap-3">
                          {isTeacher && (
                            <div className="flex items-center gap-1.5 bg-[#EDEBE0] p-1 rounded-xl border border-[#428177]/20">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0 text-[#002623] hover:bg-[#428177]/10"
                                onClick={() => setEditingAssignment(assignment)}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0 text-[#6B1F2A] hover:bg-[#6B1F2A]/10"
                                onClick={() => confirmDelete('assignment', assignment.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          )}
                          <span className="text-xs font-bold text-[#3D3A3B] bg-[#EDEBE0]/60 px-3 py-1 rounded-full border border-[#428177]/20">
                            تاريخ الاستحقاق: {new Date(assignment.dueDate).toISOString().split('T')[0].replace(/-/g, '/')}
                          </span>
                        </div>
                        <h3 className="font-bold text-xl text-[#002623]">{assignment.title}</h3>
                      </div>

                      <p className="text-xs text-[#3D3A3B] font-medium leading-relaxed">{assignment.description}</p>

                      {assignment.hasFile && (
                        <div className="inline-flex items-center text-[#428177] bg-[#428177]/10 px-3 py-1 rounded-lg text-xs font-bold border border-[#428177]/20">
                          <span className="mr-2">{assignment.fileName}</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text ml-1"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4h4" /></svg>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-2 border-t border-[#EDEBE0]">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-[#428177] font-bold hover:underline p-0 h-auto"
                          onClick={() => setExpandedAssignmentId(expandedAssignmentId === assignment.id ? null : assignment.id)}
                        >
                          {expandedAssignmentId === assignment.id ? "إغلاق التفاصيل" : isTeacher ? "عرض تسليمات الطلاب ورصد الدرجات" : "تسليم الواجب وعرض التقييم"}
                        </Button>
                      </div>

                      {expandedAssignmentId === assignment.id && (
                        <div className="mt-4 pt-4 border-t border-[#EDEBE0]">
                          {isTeacher ? (
                            <GradingConsole courseId={Number(courseId)} assignmentId={assignment.id} />
                          ) : (
                            <AssignmentSubmissions courseId={Number(courseId)} assignment={assignment} />
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-xs text-[#3D3A3B] bg-white border border-dashed border-[#428177]/30 rounded-2xl">
                    لا توجد واجبات حالياً
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Discussions Tab */}
          <TabsContent value="discussions">
            <div className="pt-2">
              <CourseDiscussions />
            </div>
          </TabsContent>

          {/* Help & Support Tab (Manuals & Q&As) */}
          <TabsContent value="help">
            <div className="bg-white border border-[#428177]/30 rounded-2xl p-8 text-right space-y-6">
              <div className="pb-4 border-b border-[#EDEBE0]">
                <h3 className="text-xl font-bold text-[#002623]">الدليل الإرشادي والأسئلة الشائعة</h3>
                <p className="text-xs text-[#3D3A3B] mt-1">تجد هنا أدلة استخدام المنصة والإجابات الشائعة لدعم الطلاب والمعلمين.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
                <div className="p-4 bg-[#EDEBE0]/30 rounded-xl border border-[#428177]/20 space-y-2">
                  <h4 className="font-bold text-sm text-[#002623]">📖 دليل وتسليم الواجبات</h4>
                  <p className="text-[#3D3A3B] leading-relaxed">يجب رفع ملف الواجب الرئيسي بصيغة PDF إجبارياً قبل انتهاء موعد الاستحقاق المعتمد. يُمكن إرفاق ملف ZIP اختياري للمشاريع.</p>
                </div>
                <div className="p-4 bg-[#EDEBE0]/30 rounded-xl border border-[#428177]/20 space-y-2">
                  <h4 className="font-bold text-sm text-[#002623]">💬 التواصل والاستفسارات</h4>
                  <p className="text-[#3D3A3B] leading-relaxed">استخدم تبويب "ساحة المناقشات" لطرح الأسئلة الأكاديمية والاستفسارات ليجيبك عليها أستاذ المادة والزملاء.</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create/Edit Dialogs */}
      <AnnouncementDialog
        open={announcementDialogOpen || !!editingAnnouncement}
        onOpenChange={(open) => {
          if (!open) {
            setAnnouncementDialogOpen(false);
            setEditingAnnouncement(null);
          } else {
            setAnnouncementDialogOpen(true);
          }
        }}
        editingAnnouncement={editingAnnouncement}
        onSave={handleSaveAnnouncement}
      />

      <EventDialog
        open={eventDialogOpen || !!editingEvent}
        onOpenChange={(open) => {
          if (!open) {
            setEventDialogOpen(false);
            setEditingEvent(null);
          } else {
            setEventDialogOpen(true);
          }
        }}
        editingEvent={editingEvent}
        onSave={handleSaveEvent}
      />

      <LectureDialog
        open={lectureDialogOpen || !!editingLecture}
        onOpenChange={(open) => {
          if (!open) {
            setLectureDialogOpen(false);
            setEditingLecture(null);
          } else {
            setLectureDialogOpen(true);
          }
        }}
        editingLecture={editingLecture}
        onSave={handleSaveLecture}
      />

      <AssignmentDialog
        open={assignmentDialogOpen || !!editingAssignment}
        onOpenChange={(open) => {
          if (!open) {
            setAssignmentDialogOpen(false);
            setEditingAssignment(null);
          } else {
            setAssignmentDialogOpen(true);
          }
        }}
        editingAssignment={editingAssignment}
        onSave={handleSaveAssignment}
      />

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
