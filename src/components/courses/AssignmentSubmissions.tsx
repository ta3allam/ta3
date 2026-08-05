import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Assignment } from "@/pages/courses/types";
import { useAuth } from "@/contexts/AuthContext";
import { useCourseData } from "@/contexts/CourseContext";
import { toast } from "sonner";
import { UploadCloud, CheckCircle2, FileText, Calendar, Archive, Lock, RefreshCw } from "lucide-react";

interface AssignmentSubmissionsProps {
  courseId: number;
  assignment: Assignment;
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

export default function AssignmentSubmissions({ courseId, assignment }: AssignmentSubmissionsProps) {
  const { user } = useAuth();
  const { courseData, addSubmission } = useCourseData();
  const [comment, setComment] = useState("");
  
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const course = courseData[courseId];
  const mySubmission = course?.submissions?.find(
    (s) => s.assignmentId === assignment.id && s.studentId === user?.username
  );

  const isLate = new Date() > new Date(assignment.dueDate);

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext !== 'pdf' && file.type !== 'application/pdf') {
        toast.error("الملف الأساسي يجب أن يكون بصيغة PDF إجبارياً");
        return;
      }
      if (file.size > 25 * 1024 * 1024) {
        toast.error("حجم ملف PDF يتجاوز 25 ميجابايت");
        return;
      }
      setPdfFile(file);
      simulateUpload();
    }
  };

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext !== 'zip' && !file.type.includes('zip')) {
        toast.error("الملف الإضافي يجب أن يكون بصيغة ZIP مضغوطة");
        return;
      }
      if (file.size > 25 * 1024 * 1024) {
        toast.error("حجم ملف ZIP يتجاوز 25 ميجابايت");
        return;
      }
      setZipFile(file);
      simulateUpload();
    }
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 25;
      });
    }, 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLate) {
      toast.error("عذراً، تم إغلاق باب التسليم لأن موعد الاستحقاق قد انتهى.");
      return;
    }

    if (!pdfFile) {
      toast.error("إرفاق ملف PDF للواجب إجباري للتسليم!");
      return;
    }

    const combinedName = zipFile
      ? `${pdfFile.name} + ${zipFile.name}`
      : pdfFile.name;

    addSubmission(courseId, {
      assignmentId: assignment.id,
      studentId: user?.username || "unknown",
      studentName: user?.name || "طالب مجهول",
      submittedAt: new Date().toISOString(),
      fileName: combinedName,
      comment: comment.trim() || undefined,
    });

    toast.success("تم تسليم الواجب بنجاح");
    setPdfFile(null);
    setZipFile(null);
    setComment("");
  };

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
            <span className="text-[#3D3A3B] block">تاريخ التسليم</span>
            <span className="font-bold text-[#002623]">{formatStandardDate(mySubmission.submittedAt)}</span>
          </div>
          <div className="space-y-1 bg-[#EDEBE0]/30 p-3 rounded-xl border border-[#428177]/10">
            <span className="text-[#3D3A3B] block">الملفات التي تم تسليمها</span>
            <span className="font-bold text-[#428177] flex items-center justify-end gap-1.5 truncate">
              <FileText className="h-4 w-4 text-[#428177]" />
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

        <div className="pt-3 border-t border-[#EDEBE0]">
          <h5 className="font-bold text-sm text-[#002623] mb-2">درجة وتقييم أستاذ المادة</h5>
          {mySubmission.grade !== undefined ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-[#428177]/10 border border-[#428177]/30 rounded-xl p-4">
                <span className="text-[#002623] font-black text-xl">{mySubmission.grade} / 100</span>
                <span className="text-xs text-[#3D3A3B] font-bold">الدرجة النهائية</span>
              </div>
              {mySubmission.feedback && (
                <div className="bg-[#988561]/10 border border-[#988561]/30 rounded-xl p-4 text-xs space-y-1">
                  <span className="text-[#260F14] font-bold block">ملاحظات المعلم:</span>
                  <p className="text-[#002623] leading-relaxed font-medium">{mySubmission.feedback}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-[#3D3A3B] italic bg-[#EDEBE0]/40 p-3 rounded-xl text-center font-medium border border-[#428177]/20">
              الملف قيد المراجعة والتقييم من المعلم
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

      {isLate ? (
        <div className="bg-[#6B1F2A]/10 border border-[#6B1F2A]/30 text-[#6B1F2A] text-xs rounded-xl p-4 text-center font-bold flex items-center justify-center gap-2">
          <Lock className="w-4 h-4 text-[#6B1F2A]" />
          <span>تم إغلاق التسليم! انتهى موعد الاستحقاق ولا يُسمح بالتسليم المتأخر.</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dual File Dropzone: PDF (Required) + ZIP (Optional) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Required PDF Picker */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#002623] flex items-center justify-between">
                <span>ملف الواجب الرئيسي (PDF)</span>
                <span className="text-[#6B1F2A] text-[10px] font-bold">* إجباري</span>
              </Label>
              <div
                onClick={() => pdfInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 select-none ${
                  pdfFile
                    ? "border-[#428177] bg-[#428177]/10"
                    : "border-[#428177]/30 hover:border-[#428177] hover:bg-[#EDEBE0]/40"
                }`}
              >
                <input
                  type="file"
                  ref={pdfInputRef}
                  onChange={handlePdfChange}
                  accept=".pdf,application/pdf"
                  className="hidden"
                />
                {pdfFile ? (
                  <div className="space-y-1 text-center">
                    <FileText className="h-8 w-8 text-[#428177] mx-auto" />
                    <span className="text-xs font-bold text-[#002623] block truncate max-w-[180px]">
                      {pdfFile.name}
                    </span>
                    <span className="text-[10px] text-[#3D3A3B]">
                      ({(pdfFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="h-8 w-8 text-[#428177]" />
                    <span className="text-xs font-bold text-[#002623]">اختر ملف PDF الأساسي</span>
                    <span className="text-[10px] text-[#3D3A3B]">(حتى 25 MB)</span>
                  </>
                )}
              </div>
            </div>

            {/* Optional ZIP Picker */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#002623] flex items-center justify-between">
                <span>ملف المشروع / الأكواد (ZIP)</span>
                <span className="text-[#988561] text-[10px] font-bold">اختياري</span>
              </Label>
              <div
                onClick={() => zipInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 select-none ${
                  zipFile
                    ? "border-[#988561] bg-[#988561]/10"
                    : "border-[#428177]/30 hover:border-[#428177] hover:bg-[#EDEBE0]/40"
                }`}
              >
                <input
                  type="file"
                  ref={zipInputRef}
                  onChange={handleZipChange}
                  accept=".zip,application/zip,application/x-zip-compressed"
                  className="hidden"
                />
                {zipFile ? (
                  <div className="space-y-1 text-center">
                    <Archive className="h-8 w-8 text-[#988561] mx-auto" />
                    <span className="text-xs font-bold text-[#002623] block truncate max-w-[180px]">
                      {zipFile.name}
                    </span>
                    <span className="text-[10px] text-[#3D3A3B]">
                      ({(zipFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                  </div>
                ) : (
                  <>
                    <Archive className="h-8 w-8 text-[#988561]" />
                    <span className="text-xs font-bold text-[#002623]">اختر ملف ZIP الإضافي</span>
                    <span className="text-[10px] text-[#3D3A3B]">(اختياري للمشاريع)</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Upload Progress Bar */}
          {isUploading && (
            <div className="space-y-1 pt-1">
              <Progress value={uploadProgress} className="h-2 bg-[#EDEBE0]" />
              <span className="text-[10px] text-[#428177] font-bold block text-center">
                جاري معالجة الملفات... {uploadProgress}%
              </span>
            </div>
          )}

          {/* Comment Field */}
          <div className="space-y-1.5">
            <Label htmlFor="comment" className="text-xs font-bold text-[#002623] block">
              ملاحظات إضافية للمعلم (اختياري)
            </Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="text-right text-xs bg-white border-[#428177]/30 text-[#002623]"
              placeholder="اكتب أي ملاحظات تود إرفاقها مع الحل..."
              rows={3}
            />
          </div>

          <Button
            type="submit"
            className="w-full font-bold bg-[#428177] hover:bg-[#054239] text-white py-2.5 rounded-xl shadow-sm"
            disabled={!pdfFile || isUploading || isLate}
          >
            تأكيد تسليم الواجب
          </Button>
        </form>
      )}
    </div>
  );
}
