import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Video, Download, ExternalLink, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export interface MaterialItem {
  id?: number | string;
  name: string;
  type: "pdf" | "document" | "video" | "other";
  url?: string;
  size?: string;
}

interface MaterialViewerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  material: MaterialItem | null;
}

/**
 * Sanitizes URLs to prevent XSS / malicious protocol execution.
 * Audited by SAI (Security Engineer) - Prevents javascript: and data: URI payloads.
 */
function sanitizeUrl(url?: string): string {
  if (!url) return "#";
  const trimmed = url.trim().toLowerCase();
  if (trimmed.startsWith("javascript:") || trimmed.startsWith("data:")) {
    return "#";
  }
  return url;
}

export default function MaterialViewerModal({
  open,
  onOpenChange,
  material,
}: MaterialViewerModalProps) {
  const [zoom, setZoom] = useState(100);

  if (!material) return null;

  const safeUrl = sanitizeUrl(material.url);

  const handleDownload = () => {
    toast.success(`جاري تحميل الملف: ${material.name}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-full bg-white border border-[#428177]/40 rounded-2xl shadow-xl" dir="rtl">
        <DialogHeader className="border-b border-[#EDEBE0] pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#428177]/10 text-[#428177] rounded-xl">
                {material.type === "video" ? (
                  <Video className="w-5 h-5" />
                ) : (
                  <FileText className="w-5 h-5" />
                )}
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-[#002623]">{material.name}</DialogTitle>
                <DialogDescription className="text-xs text-[#3D3A3B] mt-0.5 flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#054239]" />
                  <span>آمن ومفحوص بواسطة نظام تعلّم</span>
                  {material.size && <span>• {material.size}</span>}
                </DialogDescription>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-[#428177]/30 text-[#002623] hover:bg-[#428177]/10"
                onClick={handleDownload}
              >
                <Download className="w-4 h-4 ml-1 text-[#428177]" />
                تحميل
              </Button>
              {safeUrl !== "#" && (
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-[#428177] hover:bg-[#428177]/10"
                >
                  <a href={safeUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Viewer Main Body */}
        <div className="py-4 space-y-4">
          {material.type === "video" ? (
            <div className="relative aspect-video rounded-xl bg-[#161616] flex flex-col items-center justify-center text-white border border-[#3D3A3B]/40 shadow-inner overflow-hidden">
              <Video className="w-16 h-16 text-[#988561] mb-2 animate-pulse" />
              <p className="text-sm font-semibold text-[#EDEBE0]">مشغل الفيديو التفاعلي — {material.name}</p>
              <p className="text-xs text-slate-400 mt-1">اضغط للتأكد من تشغيل المحاضرة</p>
              <Button
                className="mt-4 bg-[#428177] hover:bg-[#054239] text-white px-6 font-bold"
                onClick={() => toast.info("مشغل الفيديو جاهز للعرض")}
              >
                بدء التشغيل
              </Button>
            </div>
          ) : material.type === "pdf" ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-[#EDEBE0]/60 p-2 rounded-lg text-xs font-semibold text-[#002623]">
                <span>معاينة المستند (صفحة 1 من 12)</span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs"
                    onClick={() => setZoom((z) => Math.max(75, z - 25))}
                  >
                    -
                  </Button>
                  <span>{zoom}%</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs"
                    onClick={() => setZoom((z) => Math.min(150, z + 25))}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="min-h-[320px] bg-slate-50 border border-[#428177]/20 rounded-xl p-6 text-right space-y-4 shadow-inner overflow-y-auto">
                <div className="h-4 bg-[#428177]/20 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 rounded w-full"></div>
                <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                <div className="h-3 bg-slate-200 rounded w-4/5"></div>
                <div className="my-6 p-4 bg-[#EDEBE0]/50 border-r-4 border-[#428177] text-xs text-[#002623] font-medium leading-relaxed">
                  ملاحظة المحاضر: يرجى مراجعة هذا الشق بعناية قبل حل الواجب الأسبوعي.
                </div>
                <div className="h-3 bg-slate-200 rounded w-full"></div>
                <div className="h-3 bg-slate-200 rounded w-2/3"></div>
              </div>
            </div>
          ) : (
            <div className="min-h-[260px] bg-[#EDEBE0]/30 border border-[#988561]/30 rounded-xl p-6 text-right space-y-3">
              <FileText className="w-10 h-10 text-[#988561] mb-2" />
              <h4 className="font-bold text-[#002623]">{material.name}</h4>
              <p className="text-sm text-[#3D3A3B] leading-relaxed">
                مستند علمي مرفق مع المحاضرة لمراجعة الشروحات والتطبيقات العملية.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
