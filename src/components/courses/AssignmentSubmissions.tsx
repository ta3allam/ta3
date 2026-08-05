import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Assignment } from "@/pages/courses/types";
import { useAuth } from "@/contexts/AuthContext";
import { useCourseData } from "@/contexts/CourseContext";
import { toast } from "sonner";
import { UploadCloud, CheckCircle2, FileText, Calendar, Archive, AlertCircle, RefreshCw } from "lucide-react";

interface AssignmentSubmissionsProps {
  courseId: number;
  assignment: Assignment;
}

/**
 * Format dates with standard Western/Arabic digits (1, 2, 3, 4, 5, 6, 7, 8, 9, 0)
 */
function formatStandardDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const mins = String(date.getMinutes()).padStart(2, '0');
  return `${year}/${month}/${day} - ${hours}:${mins}`;
}

export default function AssignmentSubmissions({ courseId, assignment }: AssignmentSubmissionsProps) {
  const { user } = useAuth();
  const { courseData, addSubmission } = useCourseData();
  const [comment, setComment] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const course = courseData[courseId];
  const mySubmission = course?.submissions?.find(
    (s) => s.assignmentId === assignment.id && s.studentId === user?.username
  );

  const validateFile = (file: File): boolean => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    const isAllowedExt = ext === 'pdf' || ext === 'zip';
    const isAllowedMime = file.type === 'application/pdf' || file.type === 'application/zip' || file.type === 'application/x-zip-compressed';

    if (!isAllowedExt && !isAllowedMime) {
      toast.error("ممنوع إرفاق هذه الصيغة! يُسمح فقط بملفات PDF أو ZIP");
      return false;
    }

    const maxSizeMb = 25;
    if (file.size > maxSizeMb * 1024 * 1024) {
      toast.error(`حجم الملف يتجاوز الحد الأقصى (${maxSizeMb} MB)`);
      return false;
    }

    return true;
  };

  const processFileSelect = (file: File) => {
    if (!validateFile(file)) return;

    setSelectedFile(file);
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate clean upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 25;
      });
    }, 120);
  };

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
      processFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFileSelect(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("يرجى إرفاق ملف الواجب بصيغة PDF أو ZIP أولاً");
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
      <div className="border border-[#428177]/40 bg-white rounded-2xl p-6 text-right space-y-4 shadow-sm" dir="rtl">
        <div className="flex justify-between items-center pb-3 border-b border-[#EDEBE0]">
          <div className="flex items-center gap-2 bg-[#428177]/10 text-[#428177] px-3.5 py-1 rounded-full text-xs font-bold border border-[#428177]/30">
            <CheckCircle2 className="h-4 w-4" />
            <span>تم التسليم بنجاح</span>
          </div>
          <h4 className="font-bold text-lg text-[#002623]">حالة التسليم والتقييم</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
          <div className="space-y-1 bg-[#EDEBE0]/30 p-3 rounded-xl border border-[#428177]/10">
            <span className="text-[#3D3A3B] block">تاريخ ووقت التسليم (أرقام قياسية)</span>
            <span className="font-bold text-[#002623]">{formatStandardDate(mySubmission.submittedAt)}</span>
          </div>
          <div className="space-y-1 bg-[#EDEBE0]/30 p-3 rounded-xl border border-[#428177]/10">
            <span className="text-[#3D3A3B] block">الملف المرفوع المعتمد</span>
            <span className="font-bold text-[#428177] flex items-center justify-end gap-1.5 truncate">
              {mySubmission.fileName?.endsWith('.zip') ? (
                <Archive className="h-4 w-4 text-[#988561]" />
              ) : (
                <FileText className="h-4 w-4 text-[#428177]" />
              )}
              <span className="truncate">{mySubmission.fileName}</span>
            </span>
          </div>
        </div>

        {mySubmission.comment && (
          <div className="bg-[#EDEBE0]/40 p-3.5 rounded-xl text-xs space-y-1 border border-[#428177]/20">
            <span className="text-[#3D3A3B] font-bold block">ملاحظاتك أثناء التسليم:</span>
            <p className="text-[#002623] leading-relaxed">{mySubmission.comment}</p>
          </div>
        )}

        {/* Grading Section */}
        <div className="pt-3 border-t border-[#EDEBE0]">
          <h5 className="font-bold text-sm text-[#002623] mb-2">النتيجة وتقييم أستاذ المادة</h5>
          {mySubmission.grade !== undefined ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-[#428177]/10 border border-[#428177]/30 rounded-xl p-4">
                <span className="text-[#002623] font-black text-xl">
                  {mySubmission.grade} / 100
                </span>
                <span className="text-xs text-[#3D3A3B] font-bold">الدرجة المستحقة</span>
              </div>
              {mySubmission.feedback && (
                <div className="bg-[#988561]/10 border border-[#988561]/30 rounded-xl p-4 text-xs space-y-1">
                  <span className="text-[#260F14] font-bold block">توصيات وملاحظات المعلم:</span>
                  <p className="text-[#002623] leading-relaxed font-medium">{mySubmission.feedback}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-[#3D3A3B] italic bg-[#EDEBE0]/40 p-3 rounded-xl text-center font-medium border border-[#428177]/20">
              الملف قيد المراجعة والتقييم حالياً من قبل أستاذ المادة
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="border border-[#428177]/40 bg-white rounded-2xl p-6 text-right space-y-4 shadow-sm" dir="rtl">
      <div className="flex justify-between items-center pb-3 border-b border-[#EDEBE0]">
        <div className="flex items-center gap-1.5 text-xs text-[#3D3A3B] font-bold bg-[#EDEBE0] px-3 py-1 rounded-full border border-[#428177]/20">
          <Calendar className="h-3.5 w-3.5 text-[#428177]" />
          <span>موعد الاستحقاق: {formatStandardDate(assignment.dueDate)}</span>
        </div>
        <h4 className="font-bold text-lg text-[#002623]">تسليم الواجب الدراسي</h4>
      </div>

      {isLate && (
        <div className="bg-[#6B1F2A]/10 border border-[#6B1F2A]/30 text-[#6B1F2A] text-xs rounded-xl p-3 text-center font-bold flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>تنبيه: تم تجاوز موعد الاستحقاق المعتمد (قد تنطبق خصومات التأخير)</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Dropzone */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-[#002623] block">
            رفع ملف الواجب (يُسمح فقط بملفات PDF أو ZIP - حتى 25 MB)
          </Label>
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 select-none ${
              dragActive
                ? "border-[#428177] bg-[#428177]/10"
                : selectedFile
                ? "border-[#054239] bg-[#054239]/5"
                : "border-[#428177]/30 hover:border-[#428177] hover:bg-[#EDEBE0]/40"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.zip,application/pdf,application/zip"
              className="hidden"
            />
            {selectedFile ? (
              <div className="w-full space-y-3">
                <div className="flex items-center justify-center gap-2">
                  {selectedFile.name.endsWith('.zip') ? (
                    <Archive className="h-10 w-10 text-[#988561]" />
                  ) : (
                    <FileText className="h-10 w-10 text-[#428177]" />
                  )}
                  <div className="text-right">
                    <span className="text-sm font-bold text-[#002623] block truncate max-w-[280px]">
                      {selectedFile.name}
                    </span>
                    <span className="text-xs text-[#3D3A3B] font-semibold">
                      ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                  </div>
                </div>

                {/* Upload Progress Bar */}
                <div className="space-y-1">
                  <Progress value={uploadProgress} className="h-2 bg-[#EDEBE0]" />
                  <span className="text-[10px] text-[#428177] font-bold">
                    {isUploading ? `جاري معالجة الملف... ${uploadProgress}%` : "الملف جاهز للتسليم 100%"}
                  </span>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-xs text-[#6B1F2A] hover:bg-[#6B1F2A]/10 mt-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                >
                  <RefreshCw className="w-3.5 h-3.5 ml-1" />
                  تغيير الملف
                </Button>
              </div>
            ) : (
              <>
                <UploadCloud className="h-10 w-10 text-[#428177]" />
                <span className="text-sm font-bold text-[#002623]">
                  اسحب ملف الواجب هنا أو اضغط لتحديد الملف
                </span>
                <span className="text-xs text-[#3D3A3B]">صيغ مقبولة: PDF أو ZIP (الحد الأقصى 25 MB)</span>
              </>
            )}
          </div>
        </div>

        {/* Comment Field */}
        <div className="space-y-1.5">
          <Label htmlFor="comment" className="text-xs font-bold text-[#002623] block">
            ملاحظات إضافية للمعلم (اختياري)
          </Label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="text-right text-xs bg-white border-[#428177]/30 text-[#002623] focus:border-[#428177]"
            placeholder="اكتب أي توضيحات تود إرفاقها مع الحل..."
            rows={3}
          />
        </div>

        <Button
          type="submit"
          className="w-full font-bold bg-[#428177] hover:bg-[#054239] text-white py-2.5 rounded-xl shadow-sm"
          disabled={!selectedFile || isUploading}
        >
          تأكيد تسليم الواجب
        </Button>
      </form>
    </div>
  );
}
