import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Assignment, Submission } from "@/pages/courses/types";
import { useAuth } from "@/contexts/AuthContext";
import { useCourseData } from "@/contexts/CourseContext";
import { toast } from "sonner";
import { UploadCloud, CheckCircle2, FileText, Calendar } from "lucide-react";

interface AssignmentSubmissionsProps {
  courseId: number;
  assignment: Assignment;
}

export default function AssignmentSubmissions({ courseId, assignment }: AssignmentSubmissionsProps) {
  const { user } = useAuth();
  const { courseData, addSubmission } = useCourseData();
  const [comment, setComment] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const course = courseData[courseId];
  // Find current student's submission for this assignment
  const mySubmission = course?.submissions?.find(
    (s) => s.assignmentId === assignment.id && s.studentId === user?.username
  );

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        setSelectedFile(file);
      } else {
        toast.error("يرجى إرفاق ملف بصيغة PDF فقط");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf") {
        setSelectedFile(file);
      } else {
        toast.error("يرجى إرفاق ملف بصيغة PDF فقط");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("يرجى إرفاق ملف الواجب أولاً");
      return;
    }

    addSubmission(courseId, {
      assignmentId: assignment.id,
      studentId: user?.username || "unknown",
      studentName: user?.name || "طالب مجهول",
      submittedAt: new Date().toISOString(),
      fileName: selectedFile.name,
      comment: comment.trim() || undefined,
    });

    toast.success("تم تسليم الواجب بنجاح");
    setSelectedFile(null);
    setComment("");
  };

  const isLate = new Date() > new Date(assignment.dueDate);

  if (mySubmission) {
    return (
      <div className="border border-border/60 bg-card rounded-xl p-5 text-right space-y-4 shadow-sm" dir="rtl">
        <div className="flex justify-between items-center pb-3 border-b border-border/40">
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
            <CheckCircle2 className="h-4 w-4" />
            <span>تم التسليم</span>
          </div>
          <h4 className="font-bold text-lg text-foreground">حالة التسليم</h4>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <span className="text-muted-foreground block text-xs">تاريخ التسليم</span>
            <span className="font-medium text-foreground">
              {new Date(mySubmission.submittedAt).toLocaleString("ar-EG")}
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground block text-xs">الملف المرفوع</span>
            <span className="font-medium text-primary flex items-center justify-end gap-1.5">
              <FileText className="h-4 w-4" />
              <span className="truncate max-w-[150px]">{mySubmission.fileName}</span>
            </span>
          </div>
        </div>

        {mySubmission.comment && (
          <div className="bg-slate-50/50 p-3 rounded-lg text-xs space-y-1 border border-border/30">
            <span className="text-muted-foreground block">ملاحظاتك:</span>
            <p className="text-foreground font-medium">{mySubmission.comment}</p>
          </div>
        )}

        {/* Grading Section */}
        <div className="pt-3 border-t border-border/40">
          <h5 className="font-bold text-sm text-foreground mb-2">الدرجة والتقييم</h5>
          {mySubmission.grade !== undefined ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-lg p-3">
                <span className="text-primary font-bold text-lg">{mySubmission.grade} / 100</span>
                <span className="text-xs text-muted-foreground font-medium">الدرجة النهائية</span>
              </div>
              {mySubmission.feedback && (
                <div className="bg-amber-50/40 border border-amber-200/50 rounded-lg p-3 text-xs space-y-1">
                  <span className="text-amber-800 font-bold block">ملاحظات المعلم:</span>
                  <p className="text-foreground leading-relaxed font-medium">{mySubmission.feedback}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic bg-slate-50 p-2.5 rounded-lg text-center">
              بانتظار تصحيح المعلم للواجب
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="border border-border/80 bg-card rounded-xl p-5 text-right space-y-4 shadow-sm" dir="rtl">
      <div className="flex justify-between items-center pb-3 border-b border-border/40">
        <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
          <Calendar className="h-3.5 w-3.5" />
          <span>الاستحقاق: {new Date(assignment.dueDate).toLocaleDateString("ar-EG")}</span>
        </div>
        <h4 className="font-bold text-lg text-foreground">تسليم الواجب</h4>
      </div>

      {isLate && (
        <div className="bg-rose-50 border border-rose-200/50 text-rose-800 text-xs rounded-lg p-2.5 text-center font-medium">
          تنبيه: لقد تجاوزت تاريخ الاستحقاق. قد يتم خصم درجات للتأخير.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Drag and Drop Zone */}
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-foreground/80 block">ملف الواجب (PDF فقط)</Label>
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 select-none ${
              dragActive
                ? "border-primary bg-primary/5"
                : selectedFile
                ? "border-emerald-500 bg-emerald-50/10"
                : "border-border hover:border-primary/50 hover:bg-slate-50/50"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf"
              className="hidden"
            />
            {selectedFile ? (
              <>
                <FileText className="h-10 w-10 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-700 truncate max-w-[250px]">
                  {selectedFile.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB) - انقر لتغيير الملف
                </span>
              </>
            ) : (
              <>
                <UploadCloud className="h-10 w-10 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium text-foreground">
                  اسحب ملف الواجب هنا أو انقر للتصفح
                </span>
                <span className="text-xs text-muted-foreground">PDF فقط (بحد أقصى 10 ميجابايت)</span>
              </>
            )}
          </div>
        </div>

        {/* Comment Field */}
        <div className="space-y-1.5">
          <Label htmlFor="comment" className="text-xs font-semibold text-foreground/80 block">ملاحظات إضافية (اختياري)</Label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="text-right text-xs"
            placeholder="اكتب أي ملاحظات تود إرسالها للمعلم..."
            rows={3}
          />
        </div>

        <Button type="submit" className="w-full font-bold shadow-sm" disabled={!selectedFile}>
          تسليم الواجب
        </Button>
      </form>
    </div>
  );
}
