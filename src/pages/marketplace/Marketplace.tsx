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
  Layers
} from "lucide-react";
import { getAssetUrl } from "@/lib/assetUtils";

export default function Marketplace() {
  const { courseData } = useCourseData();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPricingFilter, setSelectedPricingFilter] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [previewCourse, setPreviewCourse] = useState<(Course & { id: number }) | null>(null);
  const [checkoutCourse, setCheckoutCourse] = useState<(Course & { id: number }) | null>(null);

  const coursesList = Object.entries(courseData).map(([id, course]) => ({
    ...course,
    id: Number(id),
    pricingType: course.pricingType || (Number(id) % 2 === 0 ? 'paid_one_time' : 'free'),
    priceCents: course.priceCents || (Number(id) % 2 === 0 ? 4900 : 0),
    currency: course.currency || 'USD'
  }));

  const categories = [
    { id: 'all', label: 'كافة التصنيفات' },
    { id: 'cs', label: 'علوم الحاسوب والبرمجة' },
    { id: 'ai', label: 'الذكاء الاصطناعي' },
    { id: 'math', label: 'الرياضيات والهندسة' },
    { id: 'business', label: 'إدارة الأعمال والتسويق' }
  ];

  const filteredCourses = coursesList.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.teacher.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPricing = selectedPricingFilter === "all" ||
                           (selectedPricingFilter === "free" && c.pricingType === "free") ||
                           (selectedPricingFilter === "paid" && c.pricingType !== "free");

    const matchesCat = selectedCategory === "all" ||
                       (selectedCategory === "cs" && (c.name.includes("برمجة") || c.name.includes("نظم"))) ||
                       (selectedCategory === "ai" && (c.name.includes("ذكاء") || c.name.includes("بيانات"))) ||
                       (selectedCategory === "math" && (c.name.includes("رياضيات") || c.name.includes("خوارزميات"))) ||
                       (selectedCategory === "business" && c.category?.includes("أعمال"));

    return matchesSearch && matchesPricing && matchesCat;
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
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#428177]/10 text-[#428177] text-xs font-bold mb-3 border border-[#428177]/30">
                <ShoppingBag className="w-3.5 h-3.5 text-[#428177]" />
                <span>سوق المعرفة وصنّاع المحتوى</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[#002623]">سوق تعلّم للدورات والمجتمعات 🛒</h1>
              <p className="text-[#3D3A3B] mt-2 text-sm max-w-xl font-medium">
                استكشف أفضل الدورات التفاعلية المصممة بأيدي نخبة الأكاديميين وصناع المحتوى، انضم للمجتمعات، وحصل على شهادات معتمدة.
              </p>
            </div>

            <div className="hidden lg:flex items-center gap-2 bg-[#002623] text-[#EDEBE0] px-4 py-3 rounded-2xl shadow-md text-xs font-bold">
              <Sparkles className="h-4 w-4 text-[#988561]" />
              <span>أكثر من {coursesList.length} دورة جاهزة للانضمام الفوري</span>
            </div>
          </div>
        </div>

        {/* Search & Category Filter Matrix */}
        <div className="bg-white p-4 border border-[#428177]/30 rounded-3xl shadow-sm space-y-3">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-80">
              <Search className="absolute right-3.5 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="ابحث عن دورة، صانع محتوى، أو كود..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-right text-xs pr-10 border-[#428177]/40 rounded-xl h-10"
              />
            </div>

            <Tabs value={selectedPricingFilter} onValueChange={setSelectedPricingFilter} className="w-full md:w-auto">
              <TabsList className="bg-[#EDEBE0] p-1 rounded-xl w-full md:w-auto">
                <TabsTrigger value="all" className="data-[state=active]:bg-[#428177] data-[state=active]:text-white font-bold text-xs rounded-lg">جميع الدورات</TabsTrigger>
                <TabsTrigger value="free" className="data-[state=active]:bg-[#428177] data-[state=active]:text-white font-bold text-xs rounded-lg">الدورات المجانية</TabsTrigger>
                <TabsTrigger value="paid" className="data-[state=active]:bg-[#428177] data-[state=active]:text-white font-bold text-xs rounded-lg">الدورات المدفوعة</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-[#EDEBE0]">
            <Layers className="h-4 w-4 text-[#428177] shrink-0" />
            <span className="text-[11px] font-bold text-[#002623] shrink-0">التصنيف:</span>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#002623] text-[#EDEBE0] shadow-sm'
                    : 'bg-[#EDEBE0]/50 text-[#3D3A3B] hover:bg-[#EDEBE0]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Catalog Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((c) => (
              <Card
                key={c.id}
                className="border border-[#428177]/30 bg-white shadow-sm rounded-3xl overflow-hidden text-right flex flex-col justify-between hover:shadow-md transition-all hover:border-[#428177]"
              >
                <div className="p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <PricingBadge pricingType={c.pricingType} priceCents={c.priceCents} currency={c.currency} />
                    <Badge variant="outline" className="border-[#428177]/30 text-[#002623] text-[11px] font-bold rounded-lg">
                      {c.code}
                    </Badge>
                  </div>

                  <h3 className="font-black text-base text-[#002623] leading-snug">{c.name}</h3>

                  <div className="flex items-center gap-2 text-xs text-[#3D3A3B]">
                    <User className="h-3.5 w-3.5 text-[#428177]" />
                    <span>المحاضر: <span className="font-bold text-[#002623]">{c.teacher}</span></span>
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
                    className="flex-1 bg-[#428177] hover:bg-[#054239] text-white font-bold text-xs gap-1.5 rounded-xl shadow-sm"
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
          <div className="text-center py-16 border border-dashed border-[#428177]/30 rounded-3xl bg-white text-xs text-[#3D3A3B] font-medium">
            لا توجد دورات تطابق معايير وتصنيفات البحث الحالية.
          </div>
        )}

        {/* Course Detail & Syllabus Modal */}
        {previewCourse && (
          <MarketplaceCourseModal
            open={!!previewCourse}
            onOpenChange={() => setPreviewCourse(null)}
            course={previewCourse}
            onEnroll={() => setCheckoutCourse(previewCourse)}
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
      </div>
    </DashboardLayout>
  );
}
