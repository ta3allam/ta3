import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PricingBadge } from "@/components/creator/PricingBadge";
import { Course } from "@/pages/courses/types";
import {
  Star,
  BookOpen,
  User,
  Clock,
  Award,
  ShieldCheck,
  PlayCircle,
  FileText,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  Users
} from "lucide-react";

interface MarketplaceCourseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course & { id: number };
  onEnroll: () => void;
}

export function MarketplaceCourseModal({
  open,
  onOpenChange,
  course,
  onEnroll,
}: MarketplaceCourseModalProps) {
  const [activeTab, setActiveTab] = useState<'syllabus' | 'instructor' | 'reviews'>('syllabus');

  const lectures = course.lectures || [
    { id: 1, title: "مقدمة عامة وأهداف المقرر", duration: "12 دقيقة", type: "video" },
    { id: 2, title: "المفاهيم الأساسية وهيكلية النظم", duration: "25 دقيقة", type: "video" },
    { id: 3, title: "دليل التطبيق العملي والمراجع", duration: "10 دقائق", type: "article" },
    { id: 4, title: "اختبار قياس المعرفة للمستوى الأول", duration: "15 دقيقة", type: "quiz" },
  ];

  const priceDollars = ((course.priceCents || 0) / 100).toFixed(0);
  const isFree = (course.pricingType || 'free') === 'free';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="max-w-3xl bg-white border border-[#428177]/40 text-right rounded-3xl p-0 overflow-hidden shadow-2xl">
        {/* Header Hero Banner */}
        <div className="relative bg-gradient-to-r from-[#002623] via-[#054239] to-[#428177] text-white p-6 sm:p-8">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <Badge className="bg-[#EDEBE0] text-[#002623] font-bold text-[11px] hover:bg-[#EDEBE0]">
                  {course.category || "تقنية وبرمجة"}
                </Badge>
                <Badge variant="outline" className="border-white/40 text-white font-bold text-[11px]">
                  كود: {course.code}
                </Badge>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight text-[#EDEBE0]">{course.name}</h2>
              <p className="text-white/80 text-xs sm:text-sm font-medium">
                دورة احترافية شاملة لنقل المهارات من المستوى التأسيسي إلى الاحتراف مع مشاريع وتطبيقات واقعية.
              </p>
            </div>

            <div className="hidden sm:block text-left bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
              <span className="text-[11px] text-white/70 block">سعر الدورة:</span>
              <span className="text-2xl font-black text-[#EDEBE0]">
                {isFree ? 'مجاناً' : `$${priceDollars}`}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-white/15 text-xs text-white/90 font-semibold">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4 text-[#988561]" />
              <span>المحاضر: <span className="font-bold text-white">{course.teacher}</span></span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-[#988561] fill-[#988561]" />
              <span>{course.rating || "4.9"} (148 تقييم معتمد)</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-[#EDEBE0]" />
              <span>520 طالب مسجل</span>
            </div>
            <div className="flex items-center gap-1">
              <Award className="h-4 w-4 text-[#988561]" />
              <span>شهادة إتمام معتمدة</span>
            </div>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-[#EDEBE0] bg-[#EDEBE0]/20 px-6">
          <button
            onClick={() => setActiveTab('syllabus')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'syllabus'
                ? 'border-[#428177] text-[#002623]'
                : 'border-transparent text-muted-foreground hover:text-[#002623]'
            }`}
          >
            المنهج والمحاضرات ({lectures.length})
          </button>
          <button
            onClick={() => setActiveTab('instructor')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'instructor'
                ? 'border-[#428177] text-[#002623]'
                : 'border-transparent text-muted-foreground hover:text-[#002623]'
            }`}
          >
            عن المحاضر والاعتماد
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'reviews'
                ? 'border-[#428177] text-[#002623]'
                : 'border-transparent text-muted-foreground hover:text-[#002623]'
            }`}
          >
            آراء وتقييمات الطلاب (4.9 ★)
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 max-h-[50vh] overflow-y-auto space-y-4">
          {activeTab === 'syllabus' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs text-muted-foreground pb-2 border-b">
                <span>محتويات الخطة الدراسية ({lectures.length} دروس تعليمية)</span>
                <span>مدة التعلم الإجمالية: ~4 ساعات و 30 دقيقة</span>
              </div>

              <div className="space-y-2">
                {lectures.map((lec, idx) => (
                  <div
                    key={lec.id || idx}
                    className="flex items-center justify-between p-3.5 bg-white border border-[#428177]/20 rounded-2xl hover:bg-[#EDEBE0]/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-xl bg-[#428177]/10 flex items-center justify-center text-[#428177]">
                        {lec.type === 'quiz' ? (
                          <HelpCircle className="h-4 w-4" />
                        ) : lec.type === 'article' ? (
                          <FileText className="h-4 w-4" />
                        ) : (
                          <PlayCircle className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-xs text-[#002623] block">{lec.title}</span>
                        <span className="text-[10px] text-muted-foreground">الدرس {idx + 1} • {lec.duration || "15 دقيقة"}</span>
                      </div>
                    </div>

                    {idx === 0 && (
                      <Badge variant="outline" className="border-[#428177]/40 text-[#428177] text-[10px] font-bold">
                        معاينة مجانية
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'instructor' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-4 p-4 bg-[#EDEBE0]/30 rounded-2xl border border-[#428177]/20">
                <div className="h-14 w-14 rounded-2xl bg-[#002623] text-white flex items-center justify-center font-extrabold text-xl shadow-md">
                  {course.teacher.charAt(0)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-sm text-[#002623]">{course.teacher}</h4>
                    <ShieldCheck className="h-4 w-4 text-[#428177]" />
                  </div>
                  <p className="text-[#3D3A3B] text-xs font-semibold">صانع محتوى وخبير أكاديمي معتمد في منصة تعلّم</p>
                  <p className="text-muted-foreground text-[11px] leading-relaxed pt-1">
                    أكثر من 8 سنوات من الخبرة العملية والأكاديمية في تصميم المقررات التفاعلية، وتدريب أكثر من 4,000 طالب وطالبة عبر كبرى المنصات الإقليمية.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-white border border-[#428177]/20">
                  <span className="text-lg font-black text-[#002623] block">12</span>
                  <span className="text-[10px] text-muted-foreground font-semibold">دورات منشورة</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#428177]/20">
                  <span className="text-lg font-black text-[#054239] block">4.9 ★</span>
                  <span className="text-[10px] text-muted-foreground font-semibold">متوسط التقييم العام</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#428177]/20">
                  <span className="text-lg font-black text-[#988561] block">4,280+</span>
                  <span className="text-[10px] text-muted-foreground font-semibold">طالب ملتحق</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-3 text-xs">
              <div className="p-4 bg-[#EDEBE0]/30 rounded-2xl border border-[#428177]/20 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1 text-[#988561]">
                    <Star className="h-5 w-5 fill-[#988561]" />
                    <span className="text-xl font-black text-[#002623]">4.9</span>
                    <span className="text-xs text-muted-foreground">من 5 نجوم</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-semibold">بناءً على 148 تقييماً موثقاً من طلاب حقيقيين</span>
                </div>
                <Badge className="bg-emerald-600/15 text-emerald-800 border-none font-bold text-xs">
                  98% ينصحون بالدورة
                </Badge>
              </div>

              {/* Sample Reviews */}
              <div className="space-y-2">
                <div className="p-3 bg-white border rounded-xl space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#002623]">سامر حمود • خريج الدورة</span>
                    <span className="text-[10px] text-[#988561] font-bold">★★★★★</span>
                  </div>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    شرح سلس جداً وتطبيقات عملية ممتعة، ساعدتني في اجتياز المقابلة التقنية بكل ثقة.
                  </p>
                </div>
                <div className="p-3 bg-white border rounded-xl space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#002623]">ريم العبدالله • طالبة هندسة</span>
                    <span className="text-[10px] text-[#988561] font-bold">★★★★★</span>
                  </div>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    المشاريع ممتازة، ووجود مجتمع تفاعلي مع المعلم شكل فارقاً كبيراً في استيعاب المادة.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-[#EDEBE0]/40 border-t border-[#428177]/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-[#428177]" />
            <span>ضمان استرداد الرصيد خلال 14 يوماً في حال عدم الرضا</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-24 border-[#428177]/30 text-xs font-bold"
            >
              إغلاق
            </Button>
            <Button
              onClick={() => {
                onOpenChange(false);
                onEnroll();
              }}
              className="flex-1 sm:flex-none px-6 bg-[#002623] hover:bg-[#054239] text-[#EDEBE0] font-bold text-xs gap-1.5 shadow-md"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{isFree ? 'انضمام فوري للدورة' : `شراء وتسجيل ($${priceDollars})`}</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
