import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Video,
  File,
  Download,
  Edit,
  Trash2,
  Eye,
  PlayCircle,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  StickyNote,
  Save,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MaterialViewerModal, { MaterialItem } from "@/components/courses/MaterialViewerModal";
import { InteractiveQuizModal } from "@/components/courses/InteractiveQuizModal";
import { toast } from "sonner";

interface LectureMaterial {
  id: number;
  title: string;
  file_url: string;
  file_type: 'pdf' | 'video' | 'document' | 'other';
  file_size?: number;
}

interface Lecture {
  id: number;
  title: string;
  description?: string;
  materials: LectureMaterial[];
}

interface LectureDetailProps {
  lecture: Lecture | null;
  courseTitle?: string;
  isTeacher?: boolean;
  onEdit?: (lecture: Lecture) => void;
  onDelete?: (lectureId: number) => void;
}

const fileTypeIcons = {
  pdf: FileText,
  video: Video,
  document: File,
  other: File
};

export function LectureDetail({
  lecture,
  courseTitle = "المقرر التعليمي",
  isTeacher = false,
  onEdit,
  onDelete
}: LectureDetailProps) {
  const [viewingMaterial, setViewingMaterial] = useState<MaterialItem | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [notes, setNotes] = useState("");
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'notes'>('content');

  // Load persistence for completion state & notes
  useEffect(() => {
    if (lecture) {
      const storedComp = localStorage.getItem(`lecture_completed_${lecture.id}`);
      setIsCompleted(storedComp === 'true');

      const storedNotes = localStorage.getItem(`lecture_notes_${lecture.id}`);
      setNotes(storedNotes || "");
    }
  }, [lecture]);

  if (!lecture) {
    return (
      <div className="flex flex-col items-center justify-center h-72 bg-white rounded-3xl border border-dashed border-[#428177]/30 text-muted-foreground p-8 space-y-2 text-right" dir="rtl">
        <BookOpen className="h-10 w-10 text-[#428177]/40 mb-2" />
        <p className="font-bold text-sm text-[#002623]">اختر محاضرة من القائمة الجانبية لعرض تفاصيلها وموادها</p>
        <span className="text-xs text-muted-foreground">يمكنك تصفح الشرائح، الفيديوهات المسجلة، والملفات المرفقة لكل درس.</span>
      </div>
    );
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const handleOpenPreview = (material: LectureMaterial) => {
    setViewingMaterial({
      id: material.id,
      name: material.title,
      type: material.file_type,
      url: material.file_url,
      size: formatFileSize(material.file_size)
    });
  };

  const handleToggleCompletion = () => {
    const nextState = !isCompleted;
    setIsCompleted(nextState);
    localStorage.setItem(`lecture_completed_${lecture.id}`, String(nextState));

    if (nextState) {
      toast.success("تم تسجيل إكمال المحاضرة بنجاح واحتساب نقاط التقدم! 🎯");
    } else {
      toast.info("تم إلغاء علامة إكمال المحاضرة.");
    }
  };

  const handleSaveNotes = () => {
    localStorage.setItem(`lecture_notes_${lecture.id}`, notes);
    toast.success("تم حفظ الملاحظات الذكية للمحاضرة بنجاح 📝");
  };

  return (
    <Card className="border border-[#428177]/30 bg-white shadow-sm rounded-3xl overflow-hidden text-right" dir="rtl">
      <CardHeader className="p-5 pb-3 border-b border-[#EDEBE0]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-[#428177]/40 text-[#428177] text-[10px] font-bold">
                المحاضرة رقم {lecture.id}
              </Badge>
              {isCompleted && (
                <Badge className="bg-emerald-600/15 text-emerald-800 border-none text-[10px] font-bold gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  تم الإكمال
                </Badge>
              )}
            </div>
            <CardTitle className="text-xl font-black text-[#002623]">{lecture.title}</CardTitle>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!isTeacher && (
              <>
                <Button
                  size="sm"
                  onClick={handleToggleCompletion}
                  className={
                    isCompleted
                      ? "bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-800 border border-emerald-600/30 text-xs font-bold rounded-xl gap-1.5 h-8"
                      : "bg-[#428177] hover:bg-[#054239] text-white text-xs font-bold rounded-xl gap-1.5 h-8 shadow-sm"
                  }
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{isCompleted ? "المحاضرة مكتملة ✓" : "وضع علامة مكتمل"}</span>
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsQuizOpen(true)}
                  className="border-[#988561]/40 bg-[#988561]/10 text-[#002623] hover:bg-[#988561]/20 text-xs font-bold rounded-xl gap-1.5 h-8"
                >
                  <HelpCircle className="h-4 w-4 text-[#988561]" />
                  <span>اختبار الفهم</span>
                </Button>
              </>
            )}

            {isTeacher && onEdit && (
              <Button size="sm" variant="outline" onClick={() => onEdit(lecture)} className="border-[#428177]/40 text-[#002623] hover:bg-[#428177]/10 font-bold text-xs h-8 rounded-xl">
                <Edit className="h-3.5 w-3.5 ml-1 text-[#428177]" />
                تعديل المحاضرة
              </Button>
            )}
            {isTeacher && onDelete && (
              <Button size="sm" variant="destructive" onClick={() => onDelete(lecture.id)} className="font-bold text-xs h-8 bg-rose-600 hover:bg-rose-700 rounded-xl">
                <Trash2 className="h-3.5 w-3.5 ml-1" />
                حذف
              </Button>
            )}
          </div>
        </div>

        {/* Navigation Tabs between Content and Notes */}
        <div className="flex border-b border-[#EDEBE0] pt-2 gap-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('content')}
            className={`pb-2 transition-colors border-b-2 ${
              activeTab === 'content'
                ? 'border-[#428177] text-[#002623]'
                : 'border-transparent text-muted-foreground hover:text-[#002623]'
            }`}
          >
            المواد والملخص
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`pb-2 transition-colors border-b-2 flex items-center gap-1 ${
              activeTab === 'notes'
                ? 'border-[#428177] text-[#002623]'
                : 'border-transparent text-muted-foreground hover:text-[#002623]'
            }`}
          >
            <StickyNote className="h-3.5 w-3.5 text-[#428177]" />
            <span>ملاحظاتي الذكية</span>
            {notes && <span className="h-1.5 w-1.5 rounded-full bg-[#428177]" />}
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {activeTab === 'content' ? (
          <>
            {lecture.description && (
              <div className="text-right space-y-2 bg-[#EDEBE0]/30 p-4 rounded-2xl border border-[#428177]/15">
                <h4 className="font-extrabold text-xs text-[#002623] flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-[#428177]" />
                  ملخص وأهداف المحاضرة
                </h4>
                <p className="text-xs text-[#3D3A3B] leading-relaxed whitespace-pre-wrap font-medium">{lecture.description}</p>
              </div>
            )}

            <div>
              <h4 className="font-extrabold text-sm text-[#002623] mb-3 flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-[#428177]" />
                المواد التعليمية والملحقات ({lecture.materials.length})
              </h4>
              {lecture.materials.length > 0 ? (
                <div className="grid gap-3">
                  {lecture.materials.map((material) => {
                    const Icon = fileTypeIcons[material.file_type];
                    return (
                      <div
                        key={material.id}
                        className="flex items-center justify-between p-3.5 rounded-2xl border border-[#428177]/20 bg-white hover:border-[#428177]/50 hover:shadow-xs transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-[#428177]/10 text-[#428177]">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="text-right">
                            <p className="font-extrabold text-xs text-[#002623]">{material.title}</p>
                            {material.file_size && (
                              <p className="text-[10px] text-muted-foreground font-medium">
                                {formatFileSize(material.file_size)}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenPreview(material)}
                            className="h-8 text-xs font-bold border-[#428177]/30 text-[#002623] hover:bg-[#428177]/10 gap-1 rounded-xl"
                          >
                            <Eye className="h-3.5 w-3.5 text-[#428177]" />
                            معاينة
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            asChild
                            className="h-8 px-2 text-[#428177] hover:bg-[#428177]/10 rounded-xl"
                          >
                            <a href={material.file_url} download target="_blank" rel="noreferrer">
                              <Download className="h-3.5 w-3.5" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-xs text-muted-foreground py-8 bg-[#EDEBE0]/20 rounded-2xl border border-dashed border-[#EDEBE0]">
                  لا توجد مواد تعليمية مرفقة بهذه المحاضرة
                </div>
              )}
            </div>
          </>
        ) : (
          /* Notes Notepad Tab */
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#002623]">دفتر ملاحظات الطالب التفاعلي:</span>
              <span className="text-muted-foreground text-[11px]">يتم حفظ الملاحظات تلقائياً في المتصفح</span>
            </div>

            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="اكتب أفكارك وملاحظاتك ونقاط التركيز أثناء مشاهدة المحاضرة..."
              className="text-right text-xs bg-white border-[#428177]/30 rounded-2xl min-h-[140px] leading-relaxed"
            />

            <div className="flex justify-end">
              <Button
                size="sm"
                onClick={handleSaveNotes}
                className="bg-[#002623] hover:bg-[#054239] text-[#EDEBE0] text-xs font-bold rounded-xl gap-1.5 shadow-sm"
              >
                <Save className="h-3.5 w-3.5" />
                <span>حفظ الملاحظات</span>
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      <MaterialViewerModal
        open={!!viewingMaterial}
        onOpenChange={(open) => !open && setViewingMaterial(null)}
        material={viewingMaterial}
      />

      <InteractiveQuizModal
        open={isQuizOpen}
        onOpenChange={setIsQuizOpen}
        courseTitle={courseTitle}
        lectureTitle={lecture.title}
        onQuizCompleted={(score) => {
          if (score >= 70) {
            setIsCompleted(true);
            localStorage.setItem(`lecture_completed_${lecture.id}`, 'true');
          }
        }}
      />
    </Card>
  );
}
