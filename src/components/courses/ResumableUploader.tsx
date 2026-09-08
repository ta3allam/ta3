import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ResumableUploaderEngine, ChunkUploadProgress } from "@/lib/upload/resumableUpload";
import { UploadCloud, Pause, Play, CheckCircle2, AlertCircle, FileText, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface ResumableUploaderProps {
  onUploadComplete?: (fileUrl: string, fileName: string) => void;
  allowedExtensions?: string[]; // e.g. ['.pdf', '.zip']
  maxSizeMB?: number;
}

export function ResumableUploader({
  onUploadComplete,
  allowedExtensions = ['.pdf', '.zip'],
  maxSizeMB = 25
}: ResumableUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<ChunkUploadProgress | null>(null);
  const engineRef = useRef<ResumableUploaderEngine | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const ext = `.${selectedFile.name.split('.').pop()?.toLowerCase()}`;
    if (!allowedExtensions.includes(ext)) {
      toast.error(`الملف غير مدعوم. يرجى اختيار ملف بصيغة: ${allowedExtensions.join(', ')}`);
      return;
    }

    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      toast.error(`حجم الملف يتجاوز الحد الأقصى المسموح به (${maxSizeMB} ميغابايت)`);
      return;
    }

    setFile(selectedFile);
    setProgress(null);
  };

  const startUpload = () => {
    if (!file) return;

    const engine = new ResumableUploaderEngine(file, {
      chunkSize: 512 * 1024, // 512KB
      onProgress: (p) => setProgress(p),
      onSuccess: (url) => {
        toast.success(`تم اكتمال رفع الملف بنجاح عبر بروتوكول التجزئة 512KB TUS: ${file.name}`);
        onUploadComplete?.(url, file.name);
      },
      onError: (err) => {
        toast.error(`خطأ أثناء رفع الملف: ${err}`);
      }
    });

    engineRef.current = engine;
    engine.startUpload();
  };

  const togglePauseResume = () => {
    if (!engineRef.current || !progress) return;

    if (progress.status === 'uploading') {
      engineRef.current.pause();
      setProgress(prev => prev ? { ...prev, status: 'paused' } : null);
      toast.info("تم إيقاف الرفع مؤقتاً");
    } else if (progress.status === 'paused') {
      engineRef.current.resume();
      setProgress(prev => prev ? { ...prev, status: 'uploading' } : null);
      toast.info("جاري استئناف الرفع من آخر جزء محفوظ...");
    }
  };

  return (
    <div className="border border-[#428177]/30 bg-white p-5 rounded-2xl shadow-sm text-right space-y-4" dir="rtl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UploadCloud className="h-5 w-5 text-[#428177]" />
          <h3 className="font-extrabold text-sm text-[#002623]">نظام الرفع المرن المقاوم للإنترنت الضعيف (512KB TUS)</h3>
        </div>
        <span className="text-[11px] bg-[#428177]/10 text-[#054239] font-bold px-2 py-0.5 rounded-md">
          يدعم الاستئناف عند انقطاع 3G
        </span>
      </div>

      {!file ? (
        <label className="border-2 border-dashed border-[#428177]/40 hover:border-[#428177] rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-[#EDEBE0]/20 transition-colors">
          <UploadCloud className="h-8 w-8 text-[#428177]" />
          <span className="font-bold text-xs text-[#002623]">انقر لاختيار ملف PDF أو ZIP أو اسحبه هنا</span>
          <span className="text-[11px] text-muted-foreground">الحد الأقصى {maxSizeMB} ميغابايت • تجزئة تلقائية 512KB</span>
          <input
            type="file"
            accept={allowedExtensions.join(',')}
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      ) : (
        <div className="space-y-3 bg-[#EDEBE0]/30 p-4 rounded-xl border border-[#428177]/20">
          <div className="flex justify-between items-center text-xs font-bold text-[#002623]">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#428177]" />
              <span>{file.name}</span>
            </div>
            <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
          </div>

          {progress && (
            <div className="space-y-2 pt-1">
              <Progress value={progress.percentage} className="h-2 bg-[#EDEBE0] [&>div]:bg-[#428177]" />
              <div className="flex justify-between items-center text-[11px] font-semibold text-[#3D3A3B]">
                <span>
                  {progress.status === 'completed' ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      اكتمل الرفع بنجاح (100%)
                    </span>
                  ) : progress.status === 'paused' ? (
                    <span className="text-amber-700 font-bold">متوقف مؤقتاً عند الجزء {progress.currentChunk} من {progress.totalChunks}</span>
                  ) : (
                    <span>جاري رفع الجزء {progress.currentChunk} من {progress.totalChunks} ({progress.percentage}%)</span>
                  )}
                </span>
                <span>{progress.percentage}%</span>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            {!progress || progress.status === 'idle' ? (
              <Button
                onClick={startUpload}
                size="sm"
                className="bg-[#428177] hover:bg-[#054239] text-white font-bold text-xs gap-1.5"
              >
                <UploadCloud className="h-3.5 w-3.5" />
                بدء الرفع المجزأ
              </Button>
            ) : progress.status === 'completed' ? (
              <Button
                onClick={() => { setFile(null); setProgress(null); }}
                variant="outline"
                size="sm"
                className="border-[#428177]/30 text-xs font-bold text-[#002623]"
              >
                رفع ملف آخر
              </Button>
            ) : (
              <Button
                onClick={togglePauseResume}
                variant="outline"
                size="sm"
                className="border-[#428177]/30 text-xs font-bold gap-1 text-[#002623]"
              >
                {progress.status === 'uploading' ? (
                  <>
                    <Pause className="h-3.5 w-3.5 text-[#6B1F2A]" />
                    إيقاف مؤقت
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 text-[#428177]" />
                    استئناف الرفع
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
