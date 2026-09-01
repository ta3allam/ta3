import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PricingBadge } from "@/components/creator/PricingBadge";
import { CheckoutDialog } from "@/components/marketplace/CheckoutDialog";
import { useCourseData } from "@/contexts/CourseContext";
import { Course } from "@/pages/courses/types";
import { Search, ShoppingBag, Star, BookOpen, User, CheckCircle2 } from "lucide-react";
import { getAssetUrl } from "@/lib/assetUtils";
import { Link } from "react-router-dom";

export default function Marketplace() {
  const { courseData } = useCourseData();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [checkoutCourse, setCheckoutCourse] = useState<(Course & { id: number }) | null>(null);

  const coursesList = Object.entries(courseData).map(([id, course]) => ({
    ...course,
    id: Number(id),
    pricingType: course.pricingType || (Number(id) % 2 === 0 ? 'paid_one_time' : 'free'),
    priceCents: course.priceCents || (Number(id) % 2 === 0 ? 4900 : 0),
    currency: course.currency || 'USD'
  }));

  const filteredCourses = coursesList.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.teacher.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" ||
                            (selectedCategory === "free" && c.pricingType === "free") ||
                            (selectedCategory === "paid" && c.pricingType !== "free");
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout title="سوق المنصة والدورات">
      <div className="space-y-6" dir="rtl">
        {/* Header Banner */}
        <div
          className="relative overflow-hidden rounded-2xl bg-white border border-[#428177] p-6 md:p-8 shadow-sm"
          style={{
            backgroundImage: `linear-gradient(to left, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.82)), url('${getAssetUrl("/dashboard bg/otherbackground.png")}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#428177]/10 text-[#428177] text-xs font-bold mb-3 border border-[#428177]/30">
                <ShoppingBag className="w-3.5 h-3.5 text-[#428177]" />
                <span>سوق المعرفة العربي التفاعلي</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[#002623]">سوق تعلّم للدورات والمجتمعات 🛒</h1>
              <p className="text-[#3D3A3B] mt-2 text-sm max-w-xl font-medium">
                استكشف أفضل الدورات المعرفة المصممة بأيدي صُنّاع محتوى عرب، انضم للمجتمعات، وتعلّم مهارات المستقبل.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 border border-[#428177]/30 rounded-2xl shadow-sm">
          <div className="relative w-full md:w-80">
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="ابحث عن دورة، صانع محتوى، أو كود..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-right text-xs pr-9 border-[#428177]/30"
            />
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full md:w-auto">
            <TabsList className="bg-[#EDEBE0] p-1 rounded-xl w-full md:w-auto">
              <TabsTrigger value="all" className="data-[state=active]:bg-[#428177] data-[state=active]:text-white font-bold text-xs">جميع الدورات</TabsTrigger>
              <TabsTrigger value="free" className="data-[state=active]:bg-[#428177] data-[state=active]:text-white font-bold text-xs">الدورات المجانية</TabsTrigger>
              <TabsTrigger value="paid" className="data-[state=active]:bg-[#428177] data-[state=active]:text-white font-bold text-xs">الدورات المدفوعة</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Courses Catalog Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((c) => (
              <Card key={c.id} className="border border-[#428177]/30 bg-white shadow-sm rounded-2xl overflow-hidden text-right flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <PricingBadge pricingType={c.pricingType} priceCents={c.priceCents} currency={c.currency} />
                    <Badge variant="outline" className="border-[#428177]/30 text-[#002623] text-[11px] font-bold">
                      {c.code}
                    </Badge>
                  </div>

                  <h3 className="font-extrabold text-lg text-[#002623]">{c.name}</h3>

                  <div className="flex items-center gap-2 text-xs text-[#3D3A3B]">
                    <User className="h-3.5 w-3.5 text-[#428177]" />
                    <span>المحاضر: <span className="font-bold">{c.teacher}</span></span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[#3D3A3B] pt-2 border-t font-semibold">
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-[#988561] fill-[#988561]" />
                      <span>{c.rating} (120 تقييم)</span>
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
                    className="flex-1 bg-[#428177] hover:bg-[#054239] text-white font-bold text-xs gap-1"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>التسجيل والانضمام</span>
                  </Button>

                  <Link to={`/student/courses/${c.id}`}>
                    <Button variant="outline" className="border-[#428177]/30 text-[#002623] font-bold text-xs">
                      المعاينة
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-[#428177]/30 rounded-2xl bg-white text-xs text-[#3D3A3B]">
            لا توجد دورات تطابق معايير البحث الحالية.
          </div>
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
