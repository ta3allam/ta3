import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { EnrollmentFunnelCard } from "@/components/analytics/EnrollmentFunnelCard";
import { LectureDropoffChart } from "@/components/analytics/LectureDropoffChart";
import { RevenueLedgerBreakdownCard } from "@/components/analytics/RevenueLedgerBreakdownCard";
import { CohortRetentionHeatmap } from "@/components/analytics/CohortRetentionHeatmap";
import { ModuleMasteryFunnel } from "@/components/analytics/ModuleMasteryFunnel";
import { AnalyticsExportModal } from "@/components/analytics/AnalyticsExportModal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  LineChart, 
  Users, 
  DollarSign, 
  Award, 
  Clock, 
  ArrowUpRight, 
  TrendingUp, 
  Download, 
  Layers, 
  Wallet, 
  Activity, 
  BarChart3,
  Flame,
  Volume2
} from "lucide-react";
import { getAssetUrl } from "@/lib/assetUtils";
import { MOCK_FINANCIAL_SUMMARY } from "@/lib/analytics/creatorMetricsEngine";

export default function CreatorAnalytics() {
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [timeRange, setTimeRange] = useState("30d");
  const [activeTab, setActiveTab] = useState<"overview" | "financial" | "retention" | "modules">("overview");
  const [isExportOpen, setIsExportOpen] = useState(false);

  return (
    <DashboardLayout title="تحليلات الأداء ومؤشرات النجاح">
      <div className="space-y-6" dir="rtl">
        {/* Header Banner */}
        <div
          className="relative overflow-hidden rounded-2xl bg-white border border-[#428177] p-6 md:p-8 shadow-sm"
          style={{
            backgroundImage: `linear-gradient(to left, rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.85)), url('${getAssetUrl("/dashboard bg/teacherbackground.png")}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#428177]/10 text-[#428177] text-xs font-bold mb-3 border border-[#428177]/30">
                <LineChart className="w-3.5 h-3.5 text-[#428177]" />
                <span>لوحة تحليلات صانع المحتوى والمعلم المتكاملة</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[#002623]">إحصائيات الأداء واحتفاظ الطلاب 📈</h1>
              <p className="text-[#3D3A3B] mt-2 text-sm max-w-2xl font-medium">
                تتبع مسار الإيرادات المالية ونسبة الـ 85% لصانع المحتوى، مصفوفات احتفاظ الأفواج (Cohorts)، وتوزيع استهلاك الدروس في بيئات الإنترنت الضعيفة (Audio-Only).
              </p>
            </div>

            {/* Filter Controls & Export Button */}
            <div className="flex flex-wrap md:flex-nowrap items-center gap-2 w-full md:w-auto">
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger className="text-xs h-9 bg-white border-[#428177]/40 font-bold min-w-[170px]">
                  <SelectValue placeholder="اختر المساق" />
                </SelectTrigger>
                <SelectContent dir="rtl">
                  <SelectItem value="all">جميع المساقات المنشورة</SelectItem>
                  <SelectItem value="cs101">هندسة البرمجيات الموزعة</SelectItem>
                  <SelectItem value="math201">الرياضيات والذكاء الاصطناعي</SelectItem>
                  <SelectItem value="uiux301">تصميم واجهات المستخدم للمحترفين</SelectItem>
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
                  <SelectItem value="1y">العام الحالي</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={() => setIsExportOpen(true)}
                className="h-9 px-3.5 bg-[#428177] hover:bg-[#054239] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تصدير البيانات</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-2 border-b border-[#428177]/20 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "overview"
                ? "bg-[#428177] text-white shadow-sm"
                : "bg-white text-[#002623] hover:bg-[#EDEBE0]/60 border border-[#428177]/20"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>النظرة الشاملة</span>
          </button>

          <button
            onClick={() => setActiveTab("financial")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "financial"
                ? "bg-[#428177] text-white shadow-sm"
                : "bg-white text-[#002623] hover:bg-[#EDEBE0]/60 border border-[#428177]/20"
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>السجل المالي وقنوات بلاد الشام</span>
          </button>

          <button
            onClick={() => setActiveTab("retention")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "retention"
                ? "bg-[#428177] text-white shadow-sm"
                : "bg-white text-[#002623] hover:bg-[#EDEBE0]/60 border border-[#428177]/20"
            }`}
          >
            <Flame className="w-4 h-4 text-amber-500" />
            <span>مصفوفة الاحتفاظ وتفاعل الطلاب</span>
          </button>

          <button
            onClick={() => setActiveTab("modules")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "modules"
                ? "bg-[#428177] text-white shadow-sm"
                : "bg-white text-[#002623] hover:bg-[#EDEBE0]/60 border border-[#428177]/20"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>إتقان الوحدات ونمط الصوت فقط</span>
          </button>
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
            <div className="text-2xl font-extrabold text-[#002623]">{MOCK_FINANCIAL_SUMMARY.totalOrders} طالب</div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold mt-1">
              <ArrowUpRight className="h-3 w-3" />
              <span>+18.4% نمو مقارنة بالشهر السابق</span>
            </div>
          </Card>

          <Card className="border border-[#428177]/30 bg-white shadow-sm rounded-2xl p-4 text-right">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-muted-foreground">صافي أرباحك (85%)</span>
              <div className="p-2 rounded-xl bg-[#054239]/10 text-[#054239]">
                <DollarSign className="h-4 w-4 text-[#428177]" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-[#002623]">
              ${MOCK_FINANCIAL_SUMMARY.creatorNet.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>من إجمالي مبيعات ${MOCK_FINANCIAL_SUMMARY.totalRevenue.toLocaleString()}</span>
            </div>
          </Card>

          <Card className="border border-[#428177]/30 bg-white shadow-sm rounded-2xl p-4 text-right">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-muted-foreground">معدل الإكمال والتخرج</span>
              <div className="p-2 rounded-xl bg-[#988561]/20 text-[#002623]">
                <Award className="h-4 w-4 text-[#988561]" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-[#002623]">71.8%</div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold mt-1">
              <ArrowUpRight className="h-3 w-3" />
              <span>أعلى بـ 12.4% من متوسط المنصة</span>
            </div>
          </Card>

          <Card className="border border-[#428177]/30 bg-white shadow-sm rounded-2xl p-4 text-right">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-muted-foreground">استهلاك نمط الصوت (3G)</span>
              <div className="p-2 rounded-xl bg-[#6B1F2A]/10 text-[#6B1F2A]">
                <Volume2 className="h-4 w-4 text-[#6B1F2A]" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-[#002623]">41.5%</div>
            <div className="flex items-center gap-1 text-[11px] text-[#428177] font-semibold mt-1">
              <span>توفير ضخم للباقة للطلاب في الشام</span>
            </div>
          </Card>
        </div>

        {/* Tab Content Display */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <RevenueLedgerBreakdownCard />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EnrollmentFunnelCard />
              <LectureDropoffChart />
            </div>
            <CohortRetentionHeatmap />
          </div>
        )}

        {activeTab === "financial" && (
          <div className="space-y-6">
            <RevenueLedgerBreakdownCard />
          </div>
        )}

        {activeTab === "retention" && (
          <div className="space-y-6">
            <CohortRetentionHeatmap />
          </div>
        )}

        {activeTab === "modules" && (
          <div className="space-y-6">
            <ModuleMasteryFunnel />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LectureDropoffChart />
              <EnrollmentFunnelCard />
            </div>
          </div>
        )}

        {/* 1-Click Export Modal */}
        <AnalyticsExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
        />
      </div>
    </DashboardLayout>
  );
}
