import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PricingBadge } from "@/components/creator/PricingBadge";
import { CheckoutDialog } from "@/components/marketplace/CheckoutDialog";
import { MarketplaceCourseModal } from "@/components/marketplace/MarketplaceCourseModal";
import { AffiliateCourseCard } from "@/components/marketplace/AffiliateCourseCard";
import { AffiliateCourseModal } from "@/components/marketplace/AffiliateCourseModal";
import { CreatorCourseBuilderModal } from "@/components/creator/CreatorCourseBuilderModal";
import { AFFILIATE_COURSES, AffiliateCourse } from "@/data/affiliateCourses";
import { useCourseData } from "@/contexts/CourseContext";
import { Course } from "@/pages/courses/types";
import {
  Search,
  ShoppingBag,
  Star,
  BookOpen,
  User,
  CheckCircle2,
  Eye,
  Sparkles,
  Layers,
  Globe,
  PlusCircle,
  Award,
  Filter,
  GraduationCap
} from "lucide-react";
import { getAssetUrl } from "@/lib/assetUtils";

export default function Marketplace() {
  const { courseData } = useCourseData();
  const [activeMarketTab, setActiveMarketTab] = useState<"native" | "affiliate">("native");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPricingFilter, setSelectedPricingFilter] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProvider, setSelectedProvider] = useState("all");
  const [arabicOnlyFilter, setArabicOnlyFilter] = useState(false);

  // Modals state
  const [previewCourse, setPreviewCourse] = useState<(Course & { id: number }) | null>(null);
  const [checkoutCourse, setCheckoutCourse] = useState<(Course & { id: number }) | null>(null);
  const [selectedAffiliateCourse, setSelectedAffiliateCourse] = useState<AffiliateCourse | null>(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  const coursesList = Object.entries(courseData).map(([id, course]) => ({
    ...course,
    id: Number(id),
    pricingType: course.pricingType || (Number(id) % 2 === 0 ? 'paid_one_time' : 'free'),
    priceCents: course.priceCents || (Number(id) % 2 === 0 ? 4900 : 0),
    currency: course.currency || 'USD'
  }));

  const nativeCategories = [
    { id: 'all', label: 'كافة التصنيفات' },
    { id: 'cs', label: 'علوم الحاسوب والبرمجة' },
    { id: 'ai', label: 'الذكاء الاصطناعي' },
    { id: 'math', label: 'الرياضيات والهندسة' },
    { id: 'business', label: 'إدارة الأعمال والتسويق' }
  ];

  const affiliateCategories = [
    { id: 'all', label: 'كافة المسارات' },
    { id: 'cs', label: 'علوم الحاسوب والأساسيات' },
    { id: 'web', label: 'تطوير الويب الشامل' },
    { id: 'ai', label: 'الذكاء الاصطناعي والبيانات' },
    { id: 'mobile', label: 'تطبيقات الموبايل' },
    { id: 'cloud', label: 'السحابة وDevOps' }
  ];

  const providers = [
    { id: 'all', label: 'كافة المزودين' },
    { id: 'Coursera', label: 'Coursera' },
    { id: 'Udemy', label: 'Udemy' },
    { id: 'DeepLearning.AI', label: 'DeepLearning.AI' },
    { id: 'CS50', label: 'Harvard CS50' },
    { id: 'Frontend Masters', label: 'Frontend Masters' }
  ];

  // Filter Native Courses
  const filteredNativeCourses = coursesList.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.teacher.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPricing = selectedPricingFilter === "all" ||
                           (selectedPricingFilter === "free" && c.pricingType === "free") ||
                           (selectedPricingFilter === "paid" && c.pricingType !== "free");

    const matchesCat = selectedCategory === "all" ||
                       (selectedCategory === "cs" && (c.name.includes("برمجة") || c.name.includes("نظم") || c.category?.includes("حاسوب"))) ||
                       (selectedCategory === "ai" && (c.name.includes("ذكاء") || c.name.includes("بيانات") || c.category?.includes("ذكاء"))) ||
                       (selectedCategory === "math" && (c.name.includes("رياضيات") || c.name.includes("خوارزميات") || c.category?.includes("رياضيات"))) ||
                       (selectedCategory === "business" && c.category?.includes("أعمال"));

    return matchesSearch && matchesPricing && matchesCat;
  });

  // Filter Affiliate Courses
  const filteredAffiliateCourses = AFFILIATE_COURSES.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.originalTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.keySkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesProvider = selectedProvider === "all" || course.provider === selectedProvider;

    const matchesCat = selectedCategory === "all" || course.category === selectedCategory;

    const matchesPricing = selectedPricingFilter === "all" ||
                           (selectedPricingFilter === "free" && course.isFree) ||
                           (selectedPricingFilter === "paid" && !course.isFree);

    const matchesArabic = !arabicOnlyFilter || course.hasArabicSubtitles;

    return matchesSearch && matchesProvider && matchesCat && matchesPricing && matchesArabic;
  });

  return (
    <DashboardLayout title="سوق المنصة والدورات">
      <div className="space-y-6" dir="rtl">
        {/* Header Banner */}
        <div
          className="relative overflow-hidden rounded-3xl bg-white border border-[#428177] p-6 md:p-8 shadow-sm"
          style={{
            backgroundImage: `linear-gradient(to left, rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.85)), url('${getAssetUrl("/dashboard bg/otherbackground.png")}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#428177]/10 text-[#428177] text-xs font-bold border border-[#428177]/30">
                <ShoppingBag className="w-3.5 h-3.5 text-[#428177]" />
                <span>سوق المعرفة وصنّاع المحتوى</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[#002623]">سوق تعلّم للدورات والمجتمعات 🛒</h1>
              <p className="text-[#3D3A3B] text-sm max-w-2xl font-medium leading-relaxed">
                استكشف الدورات التفاعلية المحلية للمعلمين وصناع المحتوى، أو تصفح دليل الشهادات والمسارات العالمية بالعمولة مع أكواد خصم حصرية.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
              <Button
                onClick={() => setIsBuilderOpen(true)}
                className="bg-[#428177] hover:bg-[#054239] text-white font-black text-xs gap-2 rounded-2xl shadow-md py-5 px-5"
              >
                <PlusCircle className="h-4 w-4" />
                <span>أنشئ دورتك وانضم كمعلم 🚀</span>
              </Button>

              <div className="hidden lg:flex items-center gap-2 bg-[#002623] text-[#EDEBE0] px-4 py-3 rounded-2xl shadow-md text-xs font-bold">
                <Sparkles className="h-4 w-4 text-[#988561]" />
                <span>{coursesList.length + AFFILIATE_COURSES.length} مسار تدريبي متاح</span>
              </div>
            </div>
          </div>
        </div>

        {/* Master Tab Switcher (Native Courses vs Global Affiliates) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-2.5 rounded-3xl border border-[#428177]/30 shadow-xs">
          <Tabs
            value={activeMarketTab}
            onValueChange={(val) => {
              setActiveMarketTab(val as "native" | "affiliate");
              setSelectedCategory("all");
              setSelectedPricingFilter("all");
            }}
            className="w-full sm:w-auto"
          >
            <TabsList className="bg-[#EDEBE0] p-1.5 rounded-2xl w-full sm:w-auto grid grid-cols-2 gap-1">
              <TabsTrigger
                value="native"
                className="data-[state=active]:bg-[#428177] data-[state=active]:text-white font-black text-xs rounded-xl py-2 px-4 gap-2"
              >
                <GraduationCap className="h-4 w-4" />
                <span>دورات المنصة ومجتمعات المعلمين ({coursesList.length})</span>
              </TabsTrigger>

              <TabsTrigger
                value="affiliate"
                className="data-[state=active]:bg-[#002623] data-[state=active]:text-[#EDEBE0] font-black text-xs rounded-xl py-2 px-4 gap-2"
              >
                <Globe className="h-4 w-4 text-[#988561]" />
                <span>دليل المسارات والشهادات العالمية بالعمولة ({AFFILIATE_COURSES.length})</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {activeMarketTab === "affiliate" && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#EDEBE0]/60 text-[#002623] text-xs font-bold border border-[#428177]/20">
              <Award className="h-4 w-4 text-[#988561]" />
              <span>أكواد خصم حصرية تصل إلى 85% لطلاب تعلّم</span>
            </div>
          )}
        </div>

        {/* Search & Category Filter Matrix */}
        <div className="bg-white p-5 border border-[#428177]/30 rounded-3xl shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute right-3.5 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder={
                  activeMarketTab === "native"
                    ? "ابحث عن دورة محلية، معلم، أو كود..."
                    : "ابحث عن شهادة، مهارة (React, Python, AWS)، أو معهد..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-right text-xs pr-10 border-[#428177]/40 rounded-xl h-10"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {/* Pricing Filter Tabs */}
              <Tabs
                value={selectedPricingFilter}
                onValueChange={setSelectedPricingFilter}
                className="w-full md:w-auto"
              >
                <TabsList className="bg-[#EDEBE0] p-1 rounded-xl w-full md:w-auto">
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:bg-[#428177] data-[state=active]:text-white font-bold text-xs rounded-lg"
                  >
                    الكل
                  </TabsTrigger>
                  <TabsTrigger
                    value="free"
                    className="data-[state=active]:bg-[#428177] data-[state=active]:text-white font-bold text-xs rounded-lg"
                  >
                    المجانية
                  </TabsTrigger>
                  <TabsTrigger
                    value="paid"
                    className="data-[state=active]:bg-[#428177] data-[state=active]:text-white font-bold text-xs rounded-lg"
                  >
                    المدفوعة
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Affiliate Extra: Arabic Subtitle Toggle */}
              {activeMarketTab === "affiliate" && (
                <button
                  onClick={() => setArabicOnlyFilter(!arabicOnlyFilter)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                    arabicOnlyFilter
                      ? "bg-[#054239] text-[#EDEBE0] border-[#054239]"
                      : "bg-[#EDEBE0]/50 text-[#3D3A3B] border-[#428177]/20 hover:bg-[#EDEBE0]"
                  }`}
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span>مترجم للعربية فقط</span>
                </button>
              )}
            </div>
          </div>

          {/* Provider Chips for Affiliate Mode */}
          {activeMarketTab === "affiliate" && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-[#EDEBE0]">
              <Filter className="h-4 w-4 text-[#428177] shrink-0" />
              <span className="text-[11px] font-bold text-[#002623] shrink-0">المزود:</span>
              {providers.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProvider(p.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition-all ${
                    selectedProvider === p.id
                      ? "bg-[#002623] text-[#EDEBE0] shadow-xs"
                      : "bg-[#EDEBE0]/50 text-[#3D3A3B] hover:bg-[#EDEBE0]"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-[#EDEBE0]">
            <Layers className="h-4 w-4 text-[#428177] shrink-0" />
            <span className="text-[11px] font-bold text-[#002623] shrink-0">المجال:</span>
            {(activeMarketTab === "native" ? nativeCategories : affiliateCategories).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  selectedCategory === cat.id
                    ? "bg-[#428177] text-white shadow-xs"
                    : "bg-[#EDEBE0]/50 text-[#3D3A3B] hover:bg-[#EDEBE0]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* TAB 1: NATIVE COURSES GRID */}
        {activeMarketTab === "native" && (
          <>
            {filteredNativeCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNativeCourses.map((c) => (
                  <Card
                    key={c.id}
                    className="border border-[#428177]/30 bg-white shadow-sm rounded-3xl overflow-hidden text-right flex flex-col justify-between hover:shadow-md transition-all hover:border-[#428177]"
                  >
                    <div className="p-5 space-y-3">
                      <div className="flex justify-between items-start">
                        <PricingBadge
                          pricingType={c.pricingType}
                          priceCents={c.priceCents}
                          currency={c.currency}
                        />
                        <Badge
                          variant="outline"
                          className="border-[#428177]/30 text-[#002623] text-[11px] font-bold rounded-lg"
                        >
                          {c.code}
                        </Badge>
                      </div>

                      <h3 className="font-black text-base text-[#002623] leading-snug">{c.name}</h3>

                      <div className="flex items-center gap-2 text-xs text-[#3D3A3B]">
                        <User className="h-3.5 w-3.5 text-[#428177]" />
                        <span>
                          المحاضر: <span className="font-bold text-[#002623]">{c.teacher}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-[#3D3A3B] pt-2 border-t border-[#EDEBE0] font-semibold">
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 text-[#988561] fill-[#988561]" />
                          <span className="font-bold text-[#002623]">{c.rating || "4.9"}</span>
                          <span className="text-[10px] text-muted-foreground">(140 تقييم)</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-3.5 w-3.5 text-[#428177]" />
                          <span>{c.lectures?.length || 4} محاضرات</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-[#EDEBE0]/30 border-t border-[#428177]/10 flex gap-2">
                      <Button
                        onClick={() => setCheckoutCourse(c)}
                        className="flex-1 bg-[#428177] hover:bg-[#054239] text-white font-bold text-xs gap-1.5 rounded-xl shadow-xs"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>التسجيل والدفع</span>
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => setPreviewCourse(c)}
                        className="border-[#428177]/30 text-[#002623] hover:bg-[#EDEBE0] font-bold text-xs rounded-xl gap-1"
                      >
                        <Eye className="h-3.5 w-3.5 text-[#428177]" />
                        <span>معاينة المنهج</span>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border border-dashed border-[#428177]/30 rounded-3xl bg-white text-xs text-[#3D3A3B] font-medium space-y-2">
                <p>لا توجد دورات محلية تطابق معايير وتصنيفات البحث الحالية.</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsBuilderOpen(true)}
                  className="border-[#428177] text-[#428177] font-bold text-xs rounded-xl"
                >
                  كن أول من ينشئ دورة في هذا المجال 🚀
                </Button>
              </div>
            )}
          </>
        )}

        {/* TAB 2: AFFILIATE GLOBAL TRACKS GRID */}
        {activeMarketTab === "affiliate" && (
          <>
            {filteredAffiliateCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAffiliateCourses.map((affCourse) => (
                  <AffiliateCourseCard
                    key={affCourse.id}
                    course={affCourse}
                    onSelect={(c) => setSelectedAffiliateCourse(c)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border border-dashed border-[#428177]/30 rounded-3xl bg-white text-xs text-[#3D3A3B] font-medium">
                لا توجد مسارات عالمية تطابق الفلاتر المحددة حالياً.
              </div>
            )}
          </>
        )}

        {/* Native Course Detail Modal */}
        {previewCourse && (
          <MarketplaceCourseModal
            open={!!previewCourse}
            onOpenChange={() => setPreviewCourse(null)}
            course={previewCourse}
            onEnroll={() => setCheckoutCourse(previewCourse)}
          />
        )}

        {/* Affiliate Course Detail Modal */}
        {selectedAffiliateCourse && (
          <AffiliateCourseModal
            open={!!selectedAffiliateCourse}
            onOpenChange={() => setSelectedAffiliateCourse(null)}
            course={selectedAffiliateCourse}
          />
        )}

        {/* Checkout Modal */}
        {checkoutCourse && (
          <CheckoutDialog
            open={!!checkoutCourse}
            onOpenChange={() => setCheckoutCourse(null)}
            course={checkoutCourse}
          />
        )}

        {/* Creator Course Builder Modal */}
        <CreatorCourseBuilderModal
          open={isBuilderOpen}
          onOpenChange={setIsBuilderOpen}
        />
      </div>
    </DashboardLayout>
  );
}
