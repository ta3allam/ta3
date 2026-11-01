import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Certificate } from '@/types/user';
import { Award, CheckCircle2, Download, Share2, ShieldCheck, Printer, Calendar, User, Sparkles, X } from 'lucide-react';
import { toast } from 'sonner';

interface CertificateViewerModalProps {
  certificate: Certificate | null;
  userName: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function CertificateViewerModal({
  certificate,
  userName,
  isOpen,
  onClose,
}: CertificateViewerModalProps) {
  if (!certificate) return null;

  const handleDownload = () => {
    toast.success('جارٍ تجهيز وتحميل وثيقة الشهادة بصيغة PDF عالية الدقة...');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.origin + `/verify/${certificate.verificationCode}`);
    toast.success('تم نسخ رابط التحقق المباشر من الشهادة إلى الحافظة');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent hideDefaultClose className="max-w-3xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl border border-[#428177]/30 shadow-2xl p-0" dir="rtl">
        <DialogHeader className="p-4 bg-[#002623] text-[#EDEBE0] flex flex-row items-center justify-between sticky top-0 z-30 shadow-sm">
          <DialogTitle className="text-base font-extrabold flex items-center gap-2">
            <Award className="h-5 w-5 text-[#988561]" />
            معاينة وتوثيق الشهادة الأكاديمية
          </DialogTitle>
          <div className="flex items-center gap-2.5">
            <Badge className="bg-[#428177] text-white border-none font-bold text-xs gap-1 py-1 px-2.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
              شهادة موثقة ورسمية
            </Badge>
            <DialogClose className="rounded-lg p-1.5 text-[#EDEBE0]/80 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#428177]">
              <X className="h-4 w-4" />
              <span className="sr-only">إغلاق النافذة</span>
            </DialogClose>
          </div>
        </DialogHeader>

        {/* Certificate Canvas Frame */}
        <div className="p-4 sm:p-8 bg-[#EDEBE0]/20 space-y-6">
          <div className="relative border-4 border-double border-[#988561]/60 rounded-2xl p-5 sm:p-10 bg-gradient-to-b from-[#FAF8F5] to-[#FFFFFF] shadow-inner text-center space-y-6">
            {/* Background Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <Award className="w-80 h-80 text-[#002623]" />
            </div>

            {/* Header / Crest */}
            <div className="space-y-1.5">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-[#002623] text-[#988561] shadow-md">
                <Sparkles className="h-7 w-7" />
              </div>
              <h3 className="font-extrabold text-sm tracking-wider text-[#428177]">منصة تعلّـم للتعليم التفاعلي المستمر</h3>
              <h2 className="text-2xl sm:text-3xl font-black text-[#002623]">شهادة إتمام واجتياز مقرر</h2>
            </div>

            {/* Main Recipient Details */}
            <div className="space-y-2 py-2">
              <p className="text-xs text-muted-foreground font-medium">تشهد إدارة المنصة بأن المتعلم / المتعلمة:</p>
              <h1 className="text-xl sm:text-2xl font-black text-[#6B1F2A] inline-block px-8 py-1">
                {userName}
              </h1>
              <p className="text-xs sm:text-sm text-[#002623] font-bold max-w-xl mx-auto leading-relaxed pt-2">
                قد أتم بنجاح متطلبات واختبارات المقرر الدراسي المعنون:
              </p>
              <div className="bg-[#EDEBE0]/60 text-[#002623] font-black text-base sm:text-lg py-2.5 px-4 rounded-xl border border-[#428177]/20">
                « {certificate.courseTitle} »
              </div>
            </div>

            {/* Grade and Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto text-xs">
              <div className="p-2.5 rounded-xl bg-white border border-[#EDEBE0] shadow-sm">
                <span className="text-[10px] text-muted-foreground font-medium block">التقدير العام</span>
                <span className="font-extrabold text-[#428177] text-xs sm:text-sm">{certificate.grade}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-[#EDEBE0] shadow-sm">
                <span className="text-[10px] text-muted-foreground font-medium block">تاريخ المنح</span>
                <span className="font-bold text-[#002623] text-xs">{certificate.issueDate}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-[#EDEBE0] shadow-sm col-span-2 sm:col-span-1">
                <span className="text-[10px] text-muted-foreground font-medium block">رقم الاعتماد</span>
                <span className="font-mono font-bold text-[#6B1F2A] text-[11px]">{certificate.id}</span>
              </div>
            </div>

            {/* Signatures & Verification */}
            <div className="pt-4 border-t border-[#EDEBE0] flex items-center justify-between text-right text-xs">
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground font-medium block">المشرف الأكاديمي</span>
                <span className="font-bold text-[#002623]">{certificate.instructorName}</span>
                <div className="font-serif italic text-xs text-[#428177]">توقيع إلكتروني معتمد ✓</div>
              </div>

              <div className="text-left space-y-1">
                <div className="flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  رمز التوثيق: <span className="font-mono font-bold">{certificate.verificationCode}</span>
                </div>
                <span className="text-[9px] text-muted-foreground block">صالحة للتحقق عبر الباركود المشفر</span>
              </div>
            </div>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 pb-1">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="flex-1 sm:flex-initial gap-1.5 rounded-xl border-[#428177]/30 text-[#002623] font-bold text-xs hover:bg-[#EDEBE0]"
              >
                <Printer className="h-4 w-4 text-[#428177]" />
                طباعة
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex-1 sm:flex-initial gap-1.5 rounded-xl border-[#428177]/30 text-[#002623] font-bold text-xs hover:bg-[#EDEBE0]"
              >
                <Share2 className="h-4 w-4 text-[#428177]" />
                مشاركة الرابط
              </Button>
            </div>

            <Button
              onClick={handleDownload}
              className="w-full sm:w-auto gap-2 rounded-xl bg-[#002623] hover:bg-[#054239] text-[#EDEBE0] font-bold text-xs shadow-md py-2.5 px-5"
            >
              <Download className="h-4 w-4 text-[#988561]" />
              تحميل الشهادة (PDF)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
