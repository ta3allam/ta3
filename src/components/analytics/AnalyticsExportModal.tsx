import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  FileSpreadsheet,
  FileJson,
  CheckCircle2,
  Table,
  DollarSign,
  Users,
  BookOpen
} from "lucide-react";
import {
  exportToCsv,
  triggerFileDownload,
  calculateRevenueSplit,
  getRegionalPaymentChannelMetrics,
  calculateCohortRetentionData
} from "@/lib/analytics/creatorMetricsEngine";
import { toast } from "sonner";

interface AnalyticsExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  grossRevenue?: number;
  cohortSize?: number;
}

export function AnalyticsExportModal({
  open,
  onOpenChange,
  grossRevenue = 12450,
  cohortSize = 120
}: AnalyticsExportModalProps) {
  const [reportType, setReportType] = useState<"financial" | "retention" | "modules">("financial");
  const [fileFormat, setFileFormat] = useState<"csv" | "json">("csv");

  const handleExport = () => {
    const timestamp = new Date().toISOString().slice(0, 10);

    if (reportType === "financial") {
      const split = calculateRevenueSplit(grossRevenue, 15);
      const channels = getRegionalPaymentChannelMetrics(grossRevenue);

      const rows = channels.map((ch) => ({
        channelName: ch.name,
        percentage: `${ch.percentage}%`,
        totalSalesUsd: ch.totalVolume,
        creatorShare85Usd: Math.round(ch.totalVolume * 0.85),
        platformFee15Usd: Math.round(ch.totalVolume * 0.15),
        transactionCount: ch.transactionsCount,
      }));

      if (fileFormat === "csv") {
        const headers = [
          { key: "channelName", label: "قناة الدفع الإقليمية" },
          { key: "percentage", label: "النسبة المئوية" },
          { key: "totalSalesUsd", label: "إجمالي المبيعات (USD)" },
          { key: "creatorShare85Usd", label: "صافي أرباح المعلم (85%)" },
          { key: "platformFee15Usd", label: "رسوم المنصة (15%)" },
          { key: "transactionCount", label: "عدد المعاملات" },
        ];
        const csv = exportToCsv(rows, headers);
        triggerFileDownload(csv, `ta3allam-financial-report-${timestamp}.csv`, "text/csv;charset=utf-8;");
      } else {
        const jsonContent = JSON.stringify({ summary: split, channels: rows }, null, 2);
        triggerFileDownload(jsonContent, `ta3allam-financial-report-${timestamp}.json`, "application/json");
      }
    } else if (reportType === "retention") {
      const retention = calculateCohortRetentionData(cohortSize);
      if (fileFormat === "csv") {
        const headers = [
          { key: "weekNumber", label: "رقم الأسبوع" },
          { key: "label", label: "الأسبوع" },
          { key: "retentionRate", label: "نسبة الاستبقاء (%)" },
          { key: "activeStudents", label: "الطلاب النشطون" },
          { key: "dropoffCount", label: "الطلاب المتراجعون" },
          { key: "atRiskCount", label: "الطلاب المعرضون للخطر" },
        ];
        const csv = exportToCsv(retention, headers);
        triggerFileDownload(csv, `ta3allam-cohort-retention-${timestamp}.csv`, "text/csv;charset=utf-8;");
      } else {
        triggerFileDownload(JSON.stringify(retention, null, 2), `ta3allam-cohort-retention-${timestamp}.json`, "application/json");
      }
    } else {
      // Modules
      const modules = [
        { title: "الوحدة 1: الأساسيات المعمارية", completion: "94%", audioShare: "38%", quizScore: "89%" },
        { title: "الوحدة 2: بروتوكول التجزئة TUS", completion: "86%", audioShare: "54%", quizScore: "82%" },
        { title: "الوحدة 3: التزامن المتفائل OCC", completion: "78%", audioShare: "42%", quizScore: "76%" },
        { title: "الوحدة 4: الذاكرة المؤقتة Redis", completion: "71%", audioShare: "49%", quizScore: "74%" },
        { title: "الوحدة 5: مشروع التخرج", completion: "64%", audioShare: "31%", quizScore: "91%" },
      ];
      if (fileFormat === "csv") {
        const headers = [
          { key: "title", label: "اسم الوحدة" },
          { key: "completion", label: "معدل الإكمال" },
          { key: "audioShare", label: "استهلاك نمط الصوت" },
          { key: "quizScore", label: "متوسط الاختبار" },
        ];
        const csv = exportToCsv(modules, headers);
        triggerFileDownload(csv, `ta3allam-modules-mastery-${timestamp}.csv`, "text/csv;charset=utf-8;");
      } else {
        triggerFileDownload(JSON.stringify(modules, null, 2), `ta3allam-modules-mastery-${timestamp}.json`, "application/json");
      }
    }

    toast.success(`تم تصدير التقرير بنجاح بصيغة ${fileFormat.toUpperCase()}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white rounded-2xl p-6 text-right" dir="rtl">
        <DialogHeader className="space-y-2 pb-3 border-b border-[#428177]/15">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#428177]/15 text-[#428177]">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-extrabold text-[#002623]">
                تصدير تقارير الأداء والبيانات المالية
              </DialogTitle>
              <DialogDescription className="text-xs text-[#002623]/70 font-medium">
                قم بتحميل تقارير تفصيلية جاهزة للتحليل في جداول Excel أو الأنظمة المحاسبية
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {/* Report Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#002623]">نوع التقرير المراد تصديره</label>
            <Select value={reportType} onValueChange={(val) => setReportType(val as any)}>
              <SelectTrigger className="border-[#428177]/30 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent dir="rtl">
                <SelectItem value="financial">📊 التقرير المالي وتوزيع قنوات الدفع (85/15)</SelectItem>
                <SelectItem value="retention">👥 تقرير استبقاء الدفعات والنشاط الأسبوعي</SelectItem>
                <SelectItem value="modules">📚 تقرير إتقان الوحدات ونمط الصوت المنخفض</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Format */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#002623]">صيغة الملف</label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={fileFormat === "csv" ? "default" : "outline"}
                onClick={() => setFileFormat("csv")}
                className={`text-xs font-bold gap-2 h-10 rounded-xl ${
                  fileFormat === "csv" ? "bg-[#428177] text-white" : "border-slate-200"
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                ملف CSV (Excel)
              </Button>
              <Button
                type="button"
                variant={fileFormat === "json" ? "default" : "outline"}
                onClick={() => setFileFormat("json")}
                className={`text-xs font-bold gap-2 h-10 rounded-xl ${
                  fileFormat === "json" ? "bg-[#428177] text-white" : "border-slate-200"
                }`}
              >
                <FileJson className="w-4 h-4" />
                بيانات JSON
              </Button>
            </div>
          </div>

          {/* Compatibility Notice */}
          <div className="p-3 bg-[#EDEBE0]/50 rounded-xl border border-[#428177]/15 text-[11px] text-[#002623]/80 leading-relaxed">
            💡 ملفات CSV يتم ترميزها تلقائياً بصيغة <span className="font-bold">UTF-8 with BOM</span> لضمان ظهور النصوص العربية والحسابات المحاسبية بدقة تامة في Microsoft Excel و Google Sheets.
          </div>
        </div>

        <DialogFooter className="pt-3 border-t border-[#428177]/15 flex flex-row justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="text-xs font-bold border-slate-200"
          >
            إلغاء
          </Button>
          <Button
            type="button"
            onClick={handleExport}
            className="bg-[#428177] hover:bg-[#054239] text-white text-xs font-bold gap-1.5 px-4"
          >
            <Download className="w-4 h-4" />
            تحميل التقرير الآن
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
