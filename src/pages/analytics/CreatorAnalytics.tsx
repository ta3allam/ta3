import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { EnrollmentFunnelCard } from "@/components/analytics/EnrollmentFunnelCard";
import { LectureDropoffChart } from "@/components/analytics/LectureDropoffChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Users, DollarSign, Award, Clock, ArrowUpRight, Sparkles, TrendingUp } from "lucide-react";
import { getAssetUrl } from "@/lib/assetUtils";

export default function CreatorAnalytics() {
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [timeRange, setTimeRange] = useState("30d");

  return (
    <DashboardLayout title="تحليلات الأداء ومؤشرات النجاح">
      <div className="space-y-6" dir="rtl">
        {/* Header Banner */}
        <div
          className="relative overflow-hidden rounded-2xl bg-white border border-[#428177] p-6 md:p-8 shadow-sm"
          style={{
            backgroundImage: `linear-gradient(to left, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.82)), url('${getAssetUrl("/dashboard bg/teacherbackground.png")}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#428177]/10 text-[#428177] text-xs font-bold mb-3 border border-[#428177]/30">
                <LineChart className="w-3.5 h-3.5 text-[#428177]" />
                <span>لوحة تحليلات صانع المحتوى والمعلم</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[#002623]">إحصائيات ومؤشرات أداء المساقات 📈</h1>
              <p className="text-[#3D3A3B] mt-2 text-sm max-w-xl font-medium">
                تتبع أقماع تحويل الطلاب، معدلات إكمال المحاضرات، ونسب الرضا والتفاعل عبر مساقاتك التعليمية.
              </p>
            </div>

            {/* Filter Controls */}
            <div className="flex gap-2 w-full md:w-auto">
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger className="text-xs h-9 bg-white border-[#428177]/40 font-bold w-44">
                  <SelectValue placeholder="اختر المساق" />
                </SelectTrigger>
                <SelectContent dir="rtl">
                  <SelectItem value="all">جميع المساقات المنشورة</SelectItem>
                  <SelectItem value="cs101">هندسة البرمجيات الموزعة</SelectItem>
                  <SelectItem value="math201">الرياضيات المتقدمة</SelectItem>
                </SelectContent>
              </Select>

              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="text-xs h-9 bg-white border-[#428177]/40 font-bold w-32">
                  <SelectValue placeholder="الفترة" />
                </SelectTrigger>
                <SelectContent dir="rtl">
                  <SelectItem value="7d">آخر 7 أيام</SelectItem>
                  <SelectItem value="30d">آخر 30 يوماً</SelectItem>
                  <SelectItem value="90d">آخر 3 أشهر</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Top KPI Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border border-[#428177]/30 bg-white shadow-sm rounded-2xl p-4 text-right">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-muted-foreground">إجمالي المسجلين الجدد</span>
              <div className="p-2 rounded-xl bg-[#428177]/10 text-[#428177]">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-[#002623]">850</div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold mt-1">
              <ArrowUpRight className="h-3 w-3" />
              <span>+18% نمو مقارنة بالشهر السابق</span>
            </div>
          </Card>

          <Card className="border border-[#428177]/30 bg-white shadow-sm rounded-2xl p-4 text-right">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-muted-foreground">معدل الإكمال والتخرج</span>
              <div className="p-2 rounded-xl bg-[#054239]/10 text-[#054239]">
                <Award className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-[#002623]">71.8%</div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold mt-1">
              <ArrowUpRight className="h-3 w-3" />
              <span>أعلى بـ 12% من متوسط المنصة</span>
            </div>
          </Card>

          <Card className="border border-[#428177]/30 bg-white shadow-sm rounded-2xl p-4 text-right">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-muted-foreground">إجمالي إيرادات المبيعات</span>
              <div className="p-2 rounded-xl bg-[#988561]/20 text-[#002623]">
                <DollarSign className="h-4 w-4 text-[#988561]" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-[#002623]">$4,500</div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>صافي المستحقات: $3,825</span>
            </div>
          </Card>

          <Card className="border border-[#428177]/30 bg-white shadow-sm rounded-2xl p-4 text-right">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-muted-foreground">متوسط زمن المشاهدة</span>
              <div className="p-2 rounded-xl bg-[#6B1F2A]/10 text-[#6B1F2A]">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-[#002623]">4.8 س</div>
            <div className="flex items-center gap-1 text-[11px] text-[#3D3A3B] font-semibold mt-1">
              <span>لكل طالب مسجل أسبوعياً</span>
            </div>
          </Card>
        </div>

        {/* Analytics Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EnrollmentFunnelCard />
          <LectureDropoffChart />
        </div>
      </div>
    </DashboardLayout>
  );
}
