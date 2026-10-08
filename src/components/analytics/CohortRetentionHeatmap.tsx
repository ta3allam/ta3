import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Clock,
  AlertTriangle,
  Send,
  Sparkles,
  TrendingDown,
  CheckCircle2,
  Calendar
} from "lucide-react";
import {
  calculateCohortRetentionData,
  generateWeeklyActivityHeatmap,
  CohortRetentionWeek,
  HeatmapCell
} from "@/lib/analytics/creatorMetricsEngine";
import { toast } from "sonner";

interface CohortRetentionHeatmapProps {
  initialCohortSize?: number;
}

const ARABIC_DAYS = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
const TIME_SLOTS = ["12 ص", "4 ص", "8 ص", "12 م", "4 م", "8 م"];

export function CohortRetentionHeatmap({
  initialCohortSize = 120
}: CohortRetentionHeatmapProps) {
  const [retentionWeeks] = useState<CohortRetentionWeek[]>(() =>
    calculateCohortRetentionData(initialCohortSize)
  );
  const [heatmapCells] = useState<HeatmapCell[]>(() =>
    generateWeeklyActivityHeatmap()
  );
  const [encouraged, setEncouraged] = useState(false);

  const totalAtRisk = retentionWeeks.reduce((acc, w) => acc + w.atRiskCount, 0);

  const handleEncourageStudents = () => {
    setEncouraged(true);
    toast.success("تم إرسال إشعار تذكيري وتشجيعي للطلاب المتعثرين في الدفعة بنجاح!");
  };

  const getHeatmapColor = (intensity: number) => {
    switch (intensity) {
      case 4:
        return "bg-[#6B1F2A] text-white"; // Peak (Damask Red)
      case 3:
        return "bg-[#054239] text-white"; // High (Emerald Shadow)
      case 2:
        return "bg-[#428177] text-white"; // Mid (Mountain Teal)
      case 1:
        return "bg-[#428177]/40 text-[#002623]"; // Low
      case 0:
      default:
        return "bg-slate-100 text-slate-400"; // None
    }
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* 8-Week Cohort Retention Progression */}
      <Card className="border border-[#428177]/30 bg-white shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="p-5 pb-3 bg-[#EDEBE0]/30 border-b border-[#428177]/15">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#428177]/15 text-[#428177]">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base font-extrabold text-[#002623]">
                  منحنى استبقاء الدفعات الطلابية (8-Week Cohort Retention)
                </CardTitle>
                <CardDescription className="text-xs text-[#002623]/70 font-medium">
                  نسبة بقاء وتفاعل الطلاب أسبوعاً بأسبوع حتى إكمال متطلبات التخرج
                </CardDescription>
              </div>
            </div>

            <Badge variant="outline" className="border-[#428177] text-[#054239] text-xs font-bold">
              متوسط الاحتفاظ: 67.8% 🚀
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-5 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {retentionWeeks.map((week) => (
              <div
                key={week.weekNumber}
                className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-[#EDEBE0]/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-bold text-muted-foreground block mb-1">{week.label}</span>
                  <div className="text-lg font-black text-[#002623]">{week.retentionRate}%</div>
                </div>

                <div className="mt-2 space-y-1">
                  <Progress
                    value={week.retentionRate}
                    className="h-1.5 rounded-full bg-slate-200 [&>div]:bg-[#428177]"
                  />
                  <span className="text-[10px] text-muted-foreground block">
                    {week.activeStudents} طالب نشط
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* At-Risk Drop-off Alert Box */}
          <div className="p-4 rounded-xl bg-[#6B1F2A]/10 border border-[#6B1F2A]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#6B1F2A] text-white">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-[#6B1F2A]">
                  تنبيه المخاطر: {totalAtRisk} طالب لم يسجلوا دخولهم منذ أكثر من 10 أيام
                </h4>
                <p className="text-[11px] text-[#6B1F2A]/80">
                  إرسال رسالة تشجيعية تلقائية يرفع فرصة عودة الطلاب للدراسة بنسبة 44%.
                </p>
              </div>
            </div>

            <Button
              onClick={handleEncourageStudents}
              disabled={encouraged}
              size="sm"
              className="bg-[#6B1F2A] hover:bg-[#521720] text-white text-xs font-bold shrink-0 gap-1.5 rounded-xl"
            >
              {encouraged ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  تم إرسال التنبيه التشجيعي
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  إرسال تذكير تحفيزي بالبريد والإشعار
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Activity Intensity Heatmap */}
      <Card className="border border-[#428177]/30 bg-white shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="p-5 pb-3 bg-[#EDEBE0]/30 border-b border-[#428177]/15">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#054239]/15 text-[#054239]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base font-extrabold text-[#002623]">
                خريطة التفاعل والأوقات الأكثر نشاطاً في الأسبوع (Activity Heatmap)
              </CardTitle>
              <CardDescription className="text-xs text-[#002623]/70 font-medium">
                تحديد أوقات ذروة دراسة الطلاب لجدولة البث المباشر والرد على الأسئلة البرمجية
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5 space-y-4">
          <div className="overflow-x-auto">
            <div className="min-w-[500px]">
              {/* Hour Columns Header */}
              <div className="grid grid-cols-7 gap-1.5 mb-2 text-center text-xs font-bold text-muted-foreground">
                <div className="text-right">اليوم / الوقت</div>
                {TIME_SLOTS.map((slot, idx) => (
                  <div key={idx} className="text-[11px] bg-slate-50 py-1 rounded">
                    {slot}
                  </div>
                ))}
              </div>

              {/* Day Rows */}
              <div className="space-y-1.5">
                {ARABIC_DAYS.map((dayName, dayIdx) => {
                  const dayCells = heatmapCells.filter((c) => c.dayIndex === dayIdx);
                  return (
                    <div key={dayIdx} className="grid grid-cols-7 gap-1.5 items-center">
                      <div className="text-xs font-bold text-[#002623] truncate">{dayName}</div>
                      {dayCells.map((cell, cIdx) => (
                        <div
                          key={cIdx}
                          className={`h-9 rounded-lg flex items-center justify-center text-[10px] font-extrabold transition-transform hover:scale-105 cursor-pointer shadow-2xs ${getHeatmapColor(
                            cell.intensity
                          )}`}
                          title={`${dayName} في ${TIME_SLOTS[cIdx]} • ${cell.activeCount} طالب متفاعل`}
                        >
                          {cell.activeCount}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Heatmap Legend */}
          <div className="flex items-center justify-end gap-2 text-xs pt-2 border-t border-slate-100 text-muted-foreground">
            <span>مستوى النشاط:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-slate-100 border border-slate-200" title="منعدم" />
              <span className="w-3.5 h-3.5 rounded bg-[#428177]/40" title="منخفض" />
              <span className="w-3.5 h-3.5 rounded bg-[#428177]" title="متوسط" />
              <span className="w-3.5 h-3.5 rounded bg-[#054239]" title="مرتفع" />
              <span className="w-3.5 h-3.5 rounded bg-[#6B1F2A]" title="ذروة التفاعل" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
