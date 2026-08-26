import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCourseData } from "@/contexts/CourseContext";
import { Submission } from "@/pages/courses/types";
import { toast } from "sonner";
import { FileText, Award, MessageSquare, Check, AlertCircle, Download, Paperclip } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface GradingConsoleProps {
  courseId: number;
  assignmentId: number;
}

function formatStandardDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const mins = String(date.getMinutes()).padStart(2, '0');
  return `${year}/${month}/${day} - ${hours}:${mins}`;
}

export default function GradingConsole({ courseId, assignmentId }: GradingConsoleProps) {
  const { courseData, gradeSubmission } = useCourseData();
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackFile, setFeedbackFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const course = courseData[courseId];
  const submissions = course?.submissions?.filter((s) => s.assignmentId === assignmentId) || [];

  const handleOpenGrading = (sub: Submission) => {
    setSelectedSub(sub);
    setGrade(sub.grade !== undefined ? sub.grade.toString() : "");
    setFeedback(sub.feedback || "");
    setFeedbackFile(null);
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;

    const gradeNum = parseInt(grade, 10);
    if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > 100) {
      toast.error("يرجى إدخال درجة صالحة بين 0 و 100");
      return;
    }

    let updatedFeedback = feedback.trim();
    if (feedbackFile) {
      updatedFeedback += ` [ملف التغذية الراجعة المرفق: ${feedbackFile.name}]`;
    }

    gradeSubmission(courseId, selectedSub.id, gradeNum, updatedFeedback || undefined);
    toast.success(`تم حفظ تقييم الطالب ${selectedSub.studentName}`);
    setSelectedSub(null);
  };

  const handleExportCSV = () => {
    if (submissions.length === 0) {
      toast.info("لا توجد بيانات تسليمات للتصدير");
      return;
    }

    const headers = ["اسم الطالب", "تاريخ التسليم", "اسم الملف", "الدرجة", "الملاحظات"];
    const rows = submissions.map((s) => [
      `"${s.studentName}"`,
      `"${formatStandardDate(s.submittedAt)}"`,
      `"${s.fileName}"`,
      s.grade !== undefined ? s.grade : "غير مقيم",
      `"${s.feedback || ''}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `grades_assignment_${assignmentId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("تم تصدير كشف الدرجات بنجاح بصيغة CSV");
  };

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#3D3A3B] bg-[#EDEBE0] font-bold px-3 py-1 rounded-full border border-[#428177]/20">
            إجمالي التسليمات: {submissions.length}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={handleExportCSV}
            className="text-xs font-bold gap-1.5 border-[#428177]/30 text-[#002623] hover:bg-[#428177]/10"
          >
            <Download className="h-3.5 w-3.5 text-[#428177]" />
            تصدير كشف الدرجات (CSV)
          </Button>
        </div>
        <h4 className="font-bold text-lg text-[#002623]">قائمة تسليمات الطلاب</h4>
      </div>

      {submissions.length > 0 ? (
        <div className="border border-[#428177]/30 rounded-2xl overflow-hidden shadow-sm bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-xs">
              <thead>
                <tr className="bg-[#EDEBE0]/60 border-b border-[#428177]/20 text-[#002623] font-bold">
                  <th className="p-3 text-right">اسم الطالب</th>
                  <th className="p-3 text-right">تاريخ التسليم</th>
                  <th className="p-3 text-right">ملف الواجب</th>
                  <th className="p-3 text-right">الحالة</th>
                  <th className="p-3 text-center">الدرجة (من 100)</th>
                  <th className="p-3 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDEBE0]">
                {submissions.map((sub) => {
                  const isGraded = sub.grade !== undefined;
                  return (
                    <tr key={sub.id} className="hover:bg-[#EDEBE0]/20 transition-colors">
                      <td className="p-3 font-bold text-[#002623]">{sub.studentName}</td>
                      <td className="p-3 text-xs text-[#3D3A3B] font-semibold">
                        {formatStandardDate(sub.submittedAt)}
                      </td>
                      <td className="p-3">
                        <a
                          href={sub.fileUrl || "#"}
                          download={sub.fileName}
                          onClick={(e) => {
                            if (!sub.fileUrl || sub.fileUrl === "#") {
                              e.preventDefault();
                              toast.info(`جاري بدء تحميل ملف الطالب: ${sub.fileName}`);
                            }
                          }}
                          className="inline-flex items-center gap-1.5 text-[#428177] hover:underline text-xs font-bold bg-[#428177]/10 px-2.5 py-1 rounded-lg border border-[#428177]/20"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          <span className="truncate max-w-[130px]">{sub.fileName}</span>
                        </a>
                      </td>
                      <td className="p-3">
                        {isGraded ? (
                          <span className="inline-flex items-center gap-1 bg-[#428177]/10 text-[#428177] text-xs px-2.5 py-0.5 rounded-full font-bold border border-[#428177]/30">
                            <Check className="h-3 w-3" />
                            تم التقييم
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-[#988561]/10 text-[#988561] text-xs px-2.5 py-0.5 rounded-full font-bold border border-[#988561]/30">
                            <AlertCircle className="h-3 w-3" />
                            بانتظار التقييم
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center font-bold text-[#002623]">
                        {isGraded ? `${sub.grade} / 100` : "-"}
                      </td>
                      <td className="p-3 text-center">
                        <Button
                          size="sm"
                          variant={isGraded ? "outline" : "default"}
                          onClick={() => handleOpenGrading(sub)}
                          className={
                            isGraded
                              ? "border-[#428177]/30 text-[#002623] hover:bg-[#428177]/10 text-xs font-bold"
                              : "bg-[#428177] hover:bg-[#054239] text-white text-xs font-bold"
                          }
                        >
                          {isGraded ? "تعديل الدرجة" : "رصد الدرجة"}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed rounded-2xl bg-white text-[#3D3A3B] text-xs font-medium border-[#428177]/30">
          لا توجد تسليمات لهذا الواجب حتى الآن.
        </div>
      )}

      {/* Grading Dialog */}
      {selectedSub && (
        <Dialog open={!!selectedSub} onOpenChange={() => setSelectedSub(null)}>
          <DialogContent dir="rtl" className="text-right max-w-md bg-white border border-[#428177]/40 rounded-2xl">
            <DialogHeader className="border-b border-[#EDEBE0] pb-3">
              <DialogTitle className="text-right text-lg font-bold text-[#002623]">
                رصد تقييم واجب الطالب: {selectedSub.studentName}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveGrade} className="space-y-4 pt-2">
              <div className="bg-[#EDEBE0]/40 p-3 rounded-xl text-xs space-y-1.5 border border-[#428177]/20">
                <div className="flex justify-between items-center">
                  <span className="text-[#428177] font-bold flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" />
                    {selectedSub.fileName}
                  </span>
                  <span className="text-[#3D3A3B] font-bold">الملف المرفق</span>
                </div>
                {selectedSub.comment && (
                  <div className="pt-2 border-t border-[#428177]/20">
                    <span className="text-[#3D3A3B] font-bold block">ملاحظات الطالب أثناء التسليم:</span>
                    <p className="text-[#002623] leading-relaxed mt-0.5">{selectedSub.comment}</p>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="grade" className="block text-xs font-bold text-[#002623] flex items-center gap-1 justify-end">
                  <Award className="h-3.5 w-3.5 text-[#988561]" />
                  رصد الدرجة (أرقام قياسية من 0 إلى 100)
                </Label>
                <Input
                  id="grade"
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="text-right bg-white border-[#428177]/30 text-[#002623] font-bold"
                  placeholder="مثال: 95"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="feedback" className="block text-xs font-bold text-[#002623] flex items-center gap-1 justify-end">
                  <MessageSquare className="h-3.5 w-3.5 text-[#428177]" />
                  ملاحظات وتقييم المعلم
                </Label>
                <Textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="text-right text-xs bg-white border-[#428177]/30 text-[#002623]"
                  placeholder="اكتب التوجيهات والملاحظات للطالب..."
                  rows={3}
                />
              </div>

              {/* Feedback File Attachment */}
              <div className="space-y-1.5">
                <Label className="block text-xs font-bold text-[#002623] flex items-center gap-1 justify-end">
                  <Paperclip className="h-3.5 w-3.5 text-[#428177]" />
                  إرفاق ملف ملاحظات للمعلم (اختياري)
                </Label>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => setFeedbackFile(e.target.files?.[0] || null)}
                />
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-bold border-[#428177]/30 text-[#002623]"
                  >
                    اختر ملف
                  </Button>
                  <span className="text-xs text-muted-foreground truncate">
                    {feedbackFile ? feedbackFile.name : "لم يتم اختيار ملف"}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="submit" className="flex-1 font-bold bg-[#428177] hover:bg-[#054239] text-white">
                  حفظ التقييم
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedSub(null)}
                  className="w-24 font-bold border-[#428177]/30 text-[#002623]"
                >
                  إلغاء
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
