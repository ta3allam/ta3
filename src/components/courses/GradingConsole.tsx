import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCourseData } from "@/contexts/CourseContext";
import { Submission } from "@/pages/courses/types";
import { toast } from "sonner";
import { FileText, Award, MessageSquare, Check, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface GradingConsoleProps {
  courseId: number;
  assignmentId: number;
}

export default function GradingConsole({ courseId, assignmentId }: GradingConsoleProps) {
  const { courseData, gradeSubmission } = useCourseData();
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");

  const course = courseData[courseId];
  const submissions = course?.submissions?.filter((s) => s.assignmentId === assignmentId) || [];

  const handleOpenGrading = (sub: Submission) => {
    setSelectedSub(sub);
    setGrade(sub.grade !== undefined ? sub.grade.toString() : "");
    setFeedback(sub.feedback || "");
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;

    const gradeNum = parseInt(grade, 10);
    if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > 100) {
      toast.error("يرجى إدخال درجة صالحة بين 0 و 100");
      return;
    }

    gradeSubmission(courseId, selectedSub.id, gradeNum, feedback.trim() || undefined);
    toast.success(`تم حفظ تقييم الطالب ${selectedSub.studentName}`);
    setSelectedSub(null);
  };

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
          إجمالي التسليمات: {submissions.length}
        </span>
        <h4 className="font-bold text-lg text-foreground">تسليمات الطلاب</h4>
      </div>

      {submissions.length > 0 ? (
        <div className="border border-border/60 rounded-xl overflow-hidden shadow-sm bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-border/40 text-muted-foreground font-semibold">
                  <th className="p-3 text-right">اسم الطالب</th>
                  <th className="p-3 text-right">تاريخ التسليم</th>
                  <th className="p-3 text-right">ملف الواجب</th>
                  <th className="p-3 text-right">الحالة</th>
                  <th className="p-3 text-center">الدرجة</th>
                  <th className="p-3 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {submissions.map((sub) => {
                  const isGraded = sub.grade !== undefined;
                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 font-semibold text-foreground">{sub.studentName}</td>
                      <td className="p-3 text-xs text-muted-foreground">
                        {new Date(sub.submittedAt).toLocaleString("ar-EG")}
                      </td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 text-primary text-xs font-medium">
                          <FileText className="h-3.5 w-3.5" />
                          <span className="truncate max-w-[120px]">{sub.fileName}</span>
                        </span>
                      </td>
                      <td className="p-3">
                        {isGraded ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                            <Check className="h-3 w-3" />
                            تم التقييم
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                            <AlertCircle className="h-3 w-3" />
                            بانتظار التقييم
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center font-bold text-foreground">
                        {isGraded ? `${sub.grade} / 100` : "-"}
                      </td>
                      <td className="p-3 text-center">
                        <Button
                          size="sm"
                          variant={isGraded ? "outline" : "default"}
                          onClick={() => handleOpenGrading(sub)}
                          className="h-8 text-xs font-semibold"
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
        <div className="text-center py-12 border border-dashed rounded-xl bg-slate-50 text-muted-foreground text-sm">
          لا توجد أي تسليمات لهذا الواجب بعد.
        </div>
      )}

      {/* Grading Dialog */}
      {selectedSub && (
        <Dialog open={!!selectedSub} onOpenChange={() => setSelectedSub(null)}>
          <DialogContent dir="rtl" className="text-right max-w-md">
            <DialogHeader>
              <DialogTitle className="text-right">تقييم واجب الطالب: {selectedSub.studentName}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveGrade} className="space-y-4 pt-2">
              <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-1.5 border border-border/30">
                <div className="flex justify-between items-center">
                  <span className="text-primary font-semibold flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" />
                    {selectedSub.fileName}
                  </span>
                  <span className="text-muted-foreground font-semibold">الملف المرفق</span>
                </div>
                {selectedSub.comment && (
                  <div className="pt-2 border-t border-border/20">
                    <span className="text-muted-foreground font-semibold block">ملاحظات الطالب:</span>
                    <p className="text-foreground leading-relaxed mt-0.5">{selectedSub.comment}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="grade" className="block text-xs font-semibold text-foreground/80 flex items-center gap-1 justify-end">
                  <Award className="h-3.5 w-3.5" />
                  رصد الدرجة (من 100)
                </Label>
                <Input
                  id="grade"
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="text-right focus-visible:ring-primary/50"
                  placeholder="مثال: 95"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback" className="block text-xs font-semibold text-foreground/80 flex items-center gap-1 justify-end">
                  <MessageSquare className="h-3.5 w-3.5" />
                  ملاحظات وتقييم المعلم
                </Label>
                <Textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="text-right text-xs focus-visible:ring-primary/50"
                  placeholder="اكتب ملاحظاتك للطالب هنا..."
                  rows={4}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="submit" className="flex-1 font-bold">
                  حفظ التقييم
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedSub(null)}
                  className="w-24 font-bold"
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
