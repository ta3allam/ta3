import { useState } from "react";
import { Card } from "@/components/ui/card";
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
  Layers,
  GraduationCap
} from "lucide-react";
import { toast } from "sonner";

interface AffiliateCourseCardProps {
  course: AffiliateCourse;
  onSelect?: (course: AffiliateCourse) => void;
}

const PROVIDER_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Coursera': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'Udemy': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  'edX': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  'DeepLearning.AI': { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
  'CS50': { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  'Frontend Masters': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' }
};

export function AffiliateCourseCard({ course, onSelect }: AffiliateCourseCardProps) {
  const [copiedCode, setCopiedCode] = useState(false);

  const providerStyle = PROVIDER_COLORS[course.provider] || {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200'
  };

  const handleCopyCoupon = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!course.couponCode) return;
    navigator.clipboard.writeText(course.couponCode);
    setCopiedCode(true);
    toast.success(`تم نسخ كود الخصم (${course.couponCode}) بنجاح!`, {
      description: "الصق الكود في صفحة الدفع للحصول على الخصم المباشر."
    });
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleOpenAffiliate = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.info(`جاري التوجيه إلى منصة ${course.provider}...`, {
      description: "تطبيق الخصم الحصري لطلاب مجتمع تعلّم."
    });
    window.open(course.affiliateUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Card
      onClick={() => onSelect?.(course)}
      className="border border-[#428177]/30 bg-white shadow-sm rounded-3xl overflow-hidden text-right flex flex-col justify-between hover:shadow-md transition-all hover:border-[#428177] group cursor-pointer"
      dir="rtl"
    >
      <div className="p-5 space-y-3.5">
        {/* Top Badges Header */}
        <div className="flex justify-between items-start gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={`px-2.5 py-1 rounded-xl text-xs font-black border ${providerStyle.bg} ${providerStyle.text} ${providerStyle.border} inline-flex items-center gap-1 shadow-2xs`}
            >
              <GraduationCap className="h-3 w-3" />
              <span>{course.provider}</span>
            </span>

            {course.badge && (
              <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-[#EDEBE0] text-[#002623] border border-[#B9A779]/40">
                {course.badge}
              </span>
            )}
          </div>

          <Badge variant="outline" className="border-[#428177]/30 text-[#002623] text-[11px] font-bold rounded-lg shrink-0">
            {course.level}
          </Badge>
        </div>

        {/* Course Titles */}
        <div>
          <h3 className="font-black text-base text-[#002623] leading-snug group-hover:text-[#428177] transition-colors">
            {course.title}
          </h3>
          <p className="text-[11px] text-muted-foreground font-mono mt-0.5" dir="ltr">
            {course.originalTitle}
          </p>
        </div>

        {/* Instructor & Duration */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-[#3D3A3B] pt-1">
          <span className="font-semibold text-[#002623] inline-flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-[#988561]" />
            {course.instructor}
          </span>
          <span>•</span>
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3.5 w-3.5 text-[#428177]" />
            {course.duration}
          </span>
        </div>

        {/* Arabic Subtitles & Certificate Flags */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
          {course.hasArabicSubtitles ? (
            <span className="inline-flex items-center gap-1 text-[#054239] bg-[#428177]/10 px-2 py-0.5 rounded-md border border-[#428177]/20">
              <Globe2 className="h-3 w-3 text-[#428177]" />
              <span>مترجم للغة العربية</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[#3D3A3B] bg-gray-100 px-2 py-0.5 rounded-md">
              <Globe2 className="h-3 w-3 text-gray-500" />
              <span>لغة إنجليزية</span>
            </span>
          )}

          {course.certificateIncluded && (
            <span className="inline-flex items-center gap-1 text-[#988561] bg-[#EDEBE0] px-2 py-0.5 rounded-md border border-[#988561]/20">
              <Award className="h-3 w-3" />
              <span>شهادة إتمام معتمدة</span>
            </span>
          )}
        </div>

        {/* Skills Tags */}
        <div className="flex flex-wrap gap-1 pt-1">
          {course.keySkills.slice(0, 4).map((skill, idx) => (
            <span
              key={idx}
              className="text-[10px] font-semibold bg-[#EDEBE0]/60 text-[#002623] px-2 py-0.5 rounded-md border border-[#428177]/15"
            >
              {skill}
            </span>
          ))}
          {course.keySkills.length > 4 && (
            <span className="text-[10px] text-muted-foreground px-1 py-0.5">
              +{course.keySkills.length - 4} المزيد
            </span>
          )}
        </div>

        {/* Ratings & Coupon Code Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-[#EDEBE0] text-xs">
          <div className="flex items-center gap-1 font-bold text-[#002623]">
            <Star className="h-3.5 w-3.5 text-[#988561] fill-[#988561]" />
            <span>{course.rating.toFixed(1)}</span>
            <span className="text-[10px] text-muted-foreground font-normal">
              ({course.reviewCount.toLocaleString('ar-EG')} تقييم)
            </span>
          </div>

          {/* Coupon Code Pill */}
          {course.couponCode && (
            <button
              onClick={handleCopyCoupon}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#6B1F2A]/10 text-[#6B1F2A] border border-[#6B1F2A]/20 hover:bg-[#6B1F2A]/20 text-[11px] font-mono font-bold transition-all"
              title="انقر لنسخ كود الخصم"
            >
              <Tag className="h-3 w-3" />
              <span>{course.couponCode}</span>
              {copiedCode ? (
                <Check className="h-3 w-3 text-emerald-600 animate-in zoom-in" />
              ) : (
                <Copy className="h-3 w-3 text-[#6B1F2A]" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Pricing and Action Footer */}
      <div className="p-4 bg-[#EDEBE0]/35 border-t border-[#428177]/15 flex items-center justify-between gap-3">
        <div>
          {course.isFree ? (
            <div className="flex flex-col">
              <span className="text-xs font-black text-[#054239]">دورة مجانية بالكامل</span>
              <span className="text-[10px] text-muted-foreground">متاحة مجاناً من المصدر</span>
            </div>
          ) : (
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-[#002623]">
                ${course.discountedPriceUSD || course.originalPriceUSD}
              </span>
              {course.originalPriceUSD && course.discountedPriceUSD && (
                <span className="text-xs text-muted-foreground line-through">
                  ${course.originalPriceUSD}
                </span>
              )}
              {course.discountPercentage && (
                <span className="text-[10px] font-black bg-[#6B1F2A] text-white px-1.5 py-0.5 rounded-md mr-1">
                  خصم {course.discountPercentage}%
                </span>
              )}
            </div>
          )}
        </div>

        <Button
          onClick={handleOpenAffiliate}
          className="bg-[#428177] hover:bg-[#054239] text-white font-bold text-xs gap-1.5 rounded-xl shadow-xs"
        >
          <span>التسجيل في المنصة</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Button>
      </div>
    </Card>
  );
}
