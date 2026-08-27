import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { CreatorProfileCard } from "@/components/creator/CreatorProfileCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useCourseData } from "@/contexts/CourseContext";
import { BookOpen, Users, DollarSign, Sparkles, Plus, Eye, Share2, Award } from "lucide-react";
import { toast } from "sonner";
import { getAssetUrl } from "@/lib/assetUtils";
import { Link } from "react-router-dom";

export default function CreatorDashboard() {
  const { user } = useAuth();
  const { courseData } = useCourseData();

  const creatorCourses = Object.values(courseData).filter(c => c.teacher === user?.name || true);

  const totalStudents = 1420;
  const totalRevenue = 4850; // $4,850 USD
  const activeCommunities = 3;

  const handleShareStorefront = () => {
    toast.success("تم نسخ رابط متجر صانع المحتوى الخاص بك إلى الحافظة!");
  };

  return (
    <DashboardLayout title="لوحة صانع المحتوى">
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
                <Sparkles className="w-3.5 h-3.5 text-[#428177]" />
                <span>مركز صناعة المعرفة والافتتاحية التجارية</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[#002623]">لوحة التحكم واقتصاد صناع المحتوى 🚀</h1>
              <p className="text-[#3D3A3B] mt-2 text-sm max-w-xl font-medium">
                إدارة الدورات، بناء المجتمعات الدراسية، متابعة أرباح المبيعات، ونشر المعرفة للجمهور العربي.
              </p>
            </div>

            <Button onClick={handleShareStorefront} className="bg-[#428177] hover:bg-[#054239] text-white font-bold gap-2 shadow-sm">
              <Share2 className="h-4 w-4" />
              مشاركة رابط المتجر الشخصي
            </Button>
          </div>
        </div>

        {/* Creator Profile Storefront Card */}
        <CreatorProfileCard
          name={user?.name || "د. خالد صانع المحتوى"}
          username={user?.username ? `@${user.username}` : "@khaled_creator"}
          bio="مهندس برمجيات ومحاضر متميز في بناء الأنظمة الموزعة وتطبيقات الذكاء الاصطناعي. شغوف بنقل المعرفة باللغة العربية."
          totalFollowers={3420}
          totalCourses={creatorCourses.length}
          rating={4.9}
        />

        {/* Creator KPI Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border border-[#428177]/30 bg-white shadow-sm rounded-2xl p-5 text-right">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-extrabold text-[#002623]">{creatorCourses.length}</span>
              <div className="p-2.5 bg-[#428177]/10 rounded-xl text-[#428177]">
                <BookOpen className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xs font-bold text-[#3D3A3B] mt-2">إجمالي الدورات المنشورة</p>
          </Card>

          <Card className="border border-[#428177]/30 bg-white shadow-sm rounded-2xl p-5 text-right">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-extrabold text-[#002623]">{totalStudents}</span>
              <div className="p-2.5 bg-[#428177]/10 rounded-xl text-[#428177]">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xs font-bold text-[#3D3A3B] mt-2">إجمالي الطلاب المشتركين</p>
          </Card>

          <Card className="border border-[#428177]/30 bg-white shadow-sm rounded-2xl p-5 text-right">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-extrabold text-[#054239]">${totalRevenue}</span>
              <div className="p-2.5 bg-[#428177]/10 rounded-xl text-[#428177]">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xs font-bold text-[#3D3A3B] mt-2">إجمالي الأرباح الصافية ($)</p>
          </Card>

          <Card className="border border-[#428177]/30 bg-white shadow-sm rounded-2xl p-5 text-right">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-extrabold text-[#002623]">{activeCommunities}</span>
              <div className="p-2.5 bg-[#988561]/15 rounded-xl text-[#988561]">
                <Award className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xs font-bold text-[#3D3A3B] mt-2">المجتمعات التفاعلية النشطة</p>
          </Card>
        </div>

        {/* Tabs for Creator Operations */}
        <Card className="border border-[#428177]/30 bg-white shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="bg-[#EDEBE0]/30 border-b border-[#428177]/10">
            <CardTitle className="text-lg font-bold text-[#002623]">إدارة الدورات والمحتوى التجاري</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="courses" dir="rtl">
              <TabsList className="mb-6 bg-[#EDEBE0] p-1 rounded-xl">
                <TabsTrigger value="courses" className="data-[state=active]:bg-[#428177] data-[state=active]:text-white font-bold text-xs">دوراتي التعليمية ({creatorCourses.length})</TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-[#428177] data-[state=active]:text-white font-bold text-xs">التحليلات والمبيعات</TabsTrigger>
              </TabsList>

              <TabsContent value="courses" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {creatorCourses.map((c) => (
                    <Card key={c.id} className="border border-[#428177]/30 bg-white shadow-sm rounded-2xl overflow-hidden text-right">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <Badge className="bg-[#428177]/15 text-[#054239] font-bold text-[11px]">
                            {c.category || "برمجة"}
                          </Badge>
                          <span className="text-xs font-bold text-[#428177]">{c.code}</span>
                        </div>

                        <h3 className="font-extrabold text-base text-[#002623]">{c.name}</h3>

                        <div className="flex justify-between items-center pt-2 border-t text-xs text-[#3D3A3B] font-semibold">
                          <span>الطلاب: {c.id === 1 ? 420 : 180}</span>
                          <span className="text-[#054239] font-extrabold">مجاني / مدفوع</span>
                        </div>

                        <Link to={`/teacher/courses/${c.id}`}>
                          <Button size="sm" className="w-full bg-[#428177] hover:bg-[#054239] text-white font-bold gap-1 text-xs mt-2">
                            <Eye className="h-3.5 w-3.5" />
                            إدارة محتوى ومجتمع الدورة
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="analytics">
                <div className="p-8 text-center border border-dashed border-[#428177]/30 rounded-2xl text-xs text-[#3D3A3B]">
                  <p className="font-bold text-sm text-[#002623] mb-1">لوحة تحليلات المبيعات ونسب المبالغ</p>
                  <p>يتم احتساب عمولة المنصة (10-15%) وإيداع صافي أرباح الدورات تلقائياً في رصيد محفظتك.</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
