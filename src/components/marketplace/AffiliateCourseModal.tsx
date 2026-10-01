import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AffiliateCourse } from "@/data/affiliateCourses";
import {
  Star,
  Clock,
  Globe2,
  Award,
  ExternalLink,
  Copy,
  Check,
  Tag,
  Sparkles,
  BookOpen,
  Share2,
  CheckCircle2,
  ShieldCheck,
  GraduationCap
} from "lucide-react";
import { toast } from "sonner";

interface AffiliateCourseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: AffiliateCourse | null;
}

export function AffiliateCourseModal({
  open,
  onOpenChange,
  course
}: AffiliateCourseModalProps) {
  const [copiedCode, setCopiedCode] = useState(false);

  if (!course) return null;

  const handleCopyCoupon = () => {
    if (!course.couponCode) return;
    navigator.clipboard.writeText(course.couponCode);
    setCopiedCode(true);
    toast.success(`تم نسخ كود الخصم (${course.couponCode})!`, {
      description: "الصق الكود عند إتمام الدفع في صفحة المزود الرسمي."
    });
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleOpenProvider = () => {
    toast.info(`جاري نقلك إلى مزود الدورة (${course.provider})...`);
    window.open(course.affiliateUrl, "_blank", "noopener,noreferrer");
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + window.location.pathname + `?aff=${course.id}`);
      toast.success("تم نسخ رابط المشاركة إلى الحافظة!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 rounded-3xl border border-[#428177]/30 bg-white" dir="rtl">
        {/* Header Hero Area */}
        <div className="bg-[#002623] text-[#EDEBE0] p-6 rounded-t-3xl space-y-3 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-[#428177] text-white text-xs font-black inline-flex items-center gap-1">
                <GraduationCap className="h-3.5 w-3.5" />
                <span>{course.provider}</span>
              </span>
              <Badge variant="outline" className="border-[#988561] text-[#EDEBE0] text-xs font-bold">
                {course.categoryLabel}
              </Badge>
            </div>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#EDEBE0] transition-colors"
              title="مشاركة رابط الدورة"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>

          <DialogHeader className="text-right space-y-1">
            <DialogTitle className="text-2xl font-black text-white leading-tight">
              {course.title}
            </DialogTitle>
            <p className="text-xs text-[#EDEBE0]/70 font-mono" dir="ltr">
              {course.originalTitle}
            </p>
          </DialogHeader>

          {/* Key Quick Stats */}
          <div className="flex flex-wrap items-center gap-4 text-xs pt-2 border-t border-white/10">
            <div className="flex items-center gap-1 text-[#EDEBE0]">
              <Sparkles className="h-3.5 w-3.5 text-[#988561]" />
              <span>المحاضر: <strong className="text-white">{course.instructor}</strong></span>
            </div>
            <div className="flex items-center gap-1 text-[#EDEBE0]">
              <Clock className="h-3.5 w-3.5 text-[#428177]" />
              <span>المدة: {course.duration}</span>
            </div>
            <div className="flex items-center gap-1 text-[#EDEBE0]">
              <Star className="h-3.5 w-3.5 text-[#988561] fill-[#988561]" />
              <span>{course.rating} ({course.reviewCount.toLocaleString('ar-EG')} طالب)</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Overview Description */}
          <div className="space-y-2">
            <h4 className="text-sm font-black text-[#002623] flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#428177]" />
              <span>نبذة عن المحتوى التدريبي والمسار</span>
            </h4>
            <p className="text-xs text-[#3D3A3B] leading-relaxed font-medium bg-[#EDEBE0]/20 p-4 rounded-2xl border border-[#428177]/10">
              {course.description}
            </p>
          </div>

          {/* Key Skills */}
          <div className="space-y-2">
            <h4 className="text-sm font-black text-[#002623] flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#428177]" />
              <span>المهارات والتقنيات المكتسبة</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {course.keySkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="text-xs font-bold bg-[#EDEBE0] text-[#002623] px-3 py-1 rounded-xl border border-[#428177]/20"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Features Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl border border-[#428177]/20 bg-white flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#428177]/10 text-[#428177]">
                <Globe2 className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#002623]">دعم اللغة والترجمة</div>
                <div className="text-[11px] text-muted-foreground">
                  {course.hasArabicSubtitles ? 'مترجم باحترافية للغة العربية' : 'المحتوى متاح باللغة الإنجليزية'}
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl border border-[#428177]/20 bg-white flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#988561]/10 text-[#988561]">
                <Award className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#002623]">الاعتماد والشهادة</div>
                <div className="text-[11px] text-muted-foreground">
                  {course.certificateIncluded ? 'تمنح شهادة رسمية قابلة للإضافة في LinkedIn' : 'بدون شهادة رسمية'}
                </div>
              </div>
            </div>
          </div>

          {/* Coupon Code Section */}
          {course.couponCode && (
            <div className="p-4 rounded-2xl bg-[#6B1F2A]/5 border border-[#6B1F2A]/20 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="space-y-0.5 text-right">
                <div className="text-xs font-black text-[#6B1F2A] flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5" />
                  <span>كوبون الخصم الحصري لمجتمع تعلّم</span>
                </div>
                <div className="text-[11px] text-[#3D3A3B]">
                  استخدم هذا الكود عند الدفع للحصول على خصم مباشر بقيمة {course.discountPercentage}%.
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleCopyCoupon}
                className="border-[#6B1F2A]/30 text-[#6B1F2A] hover:bg-[#6B1F2A]/10 font-mono font-bold text-xs gap-2 rounded-xl shrink-0"
              >
                <span>{course.couponCode}</span>
                {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              </Button>
            </div>
          )}

          {/* Disclaimer & Trust Badge */}
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground bg-[#EDEBE0]/30 p-3 rounded-xl">
            <ShieldCheck className="h-4 w-4 text-[#428177] shrink-0" />
            <span>
              رابط معتمد بالعمولة من منصة {course.provider}. التسجيل عبر روابطنا يتيح لك الاستفادة من الخصومات ويدعم تطوير منصة تعلّم.
            </span>
          </div>

          {/* Footer Action */}
          <div className="flex items-center justify-between pt-3 border-t border-[#EDEBE0]">
            <div>
              {course.isFree ? (
                <span className="text-sm font-black text-[#054239]">دورة مجانية بالكامل</span>
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-black text-[#002623]">
                    ${course.discountedPriceUSD || course.originalPriceUSD}
                  </span>
                  {course.originalPriceUSD && course.discountedPriceUSD && (
                    <span className="text-xs text-muted-foreground line-through">
                      ${course.originalPriceUSD}
                    </span>
                  )}
                </div>
              )}
            </div>

            <Button
              onClick={handleOpenProvider}
              className="bg-[#428177] hover:bg-[#054239] text-white font-black text-sm px-6 py-2.5 rounded-2xl shadow-md gap-2"
            >
              <span>التسجيل في منصة {course.provider}</span>
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
