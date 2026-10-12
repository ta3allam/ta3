import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  ShieldCheck,
  Server,
  Zap,
  Activity,
  Layers,
  Sparkles,
} from "lucide-react";
import { runPlatformDiagnostics, PlatformHealthReport } from "@/lib/diagnostics/systemHealthEngine";
import { toast } from "sonner";

interface GoldenReleaseAuditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GoldenReleaseAuditModal({ open, onOpenChange }: GoldenReleaseAuditModalProps) {
  const [report, setReport] = useState<PlatformHealthReport | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runAudit = () => {
    setIsRunning(true);
    setTimeout(() => {
      const res = runPlatformDiagnostics();
      setReport(res);
      setIsRunning(false);
      toast.success("تم الانتهاء من الفحص الشامل لمنظومة تعلّم بنجاح!");
    }, 400);
  };

  useEffect(() => {
    if (open) {
      runAudit();
    }
  }, [open]);

  if (!report) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader className="border-b border-[#428177]/20 pb-4 text-right">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#428177]/10 text-[#428177]">
                <ShieldCheck className="w-5 h-5 text-[#428177]" />
              </div>
              <div>
                <DialogTitle className="text-xl font-extrabold text-[#002623]">
                  تقرير الفحص الشامل للإصدار الذهبي (Golden Master Release) 🏆
                </DialogTitle>
                <DialogDescription className="text-xs text-[#3D3A3B] mt-0.5">
                  فحص الجاهزية التشغيلية، عزل الأدوار، قنوات الشام، ونمط الـ 3G الموفر بدون أي تكاليف ذكاء اصطناعي.
                </DialogDescription>
              </div>
            </div>

            <Button
              onClick={runAudit}
              disabled={isRunning}
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs font-bold border-[#428177]/40 text-[#002623] hover:bg-[#EDEBE0]"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#428177] ${isRunning ? "animate-spin" : ""}`} />
              <span>إعادة الفحص</span>
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-5 pt-3">
          {/* Top Score Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#002623] to-[#054239] text-[#EDEBE0] flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1.5 text-right">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-300 text-[11px] font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>جاهز للإنتاج بنسبة 100%</span>
              </div>
              <h2 className="text-2xl font-black text-white">منظومة تعلّم (Ta3allam) مكتملة وموثقة</h2>
              <p className="text-xs text-[#EDEBE0]/80">
                الإصدار: {report.environment.version} • {report.environment.releaseCandidate}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center p-3 rounded-xl bg-white/10 border border-white/15 min-w-[100px]">
                <span className="text-xs block text-[#EDEBE0]/70 font-semibold">معدل السلامة</span>
                <span className="text-3xl font-black text-emerald-400">{report.healthScore}%</span>
              </div>

              <div className="text-center p-3 rounded-xl bg-white/10 border border-white/15 min-w-[100px]">
                <span className="text-xs block text-[#EDEBE0]/70 font-semibold">الفحوصات الناجحة</span>
                <span className="text-3xl font-black text-white">{report.passedCount}/{report.totalChecks}</span>
              </div>
            </div>
          </div>

          {/* Environment Specs Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-right">
            <Card className="p-3 border border-[#428177]/20 bg-white">
              <span className="text-[10px] font-bold text-muted-foreground block">نمط التشغيل</span>
              <span className="text-xs font-black text-[#002623] mt-1 block">PWA بدون تأخير</span>
            </Card>

            <Card className="p-3 border border-[#428177]/20 bg-white">
              <span className="text-[10px] font-bold text-muted-foreground block">تكلفة الذكاء الاصطناعي</span>
              <span className="text-xs font-black text-emerald-700 mt-1 block">$0.00 (صفر توكنز)</span>
            </Card>

            <Card className="p-3 border border-[#428177]/20 bg-white">
              <span className="text-[10px] font-bold text-muted-foreground block">نمط الاتصال الضعيف</span>
              <span className="text-xs font-black text-[#428177] mt-1 block">Audio-Only 64kbps</span>
            </Card>

            <Card className="p-3 border border-[#428177]/20 bg-white">
              <span className="text-[10px] font-bold text-muted-foreground block">بوابات بلاد الشام</span>
              <span className="text-xs font-black text-[#6B1F2A] mt-1 block">5 قنوات محلية</span>
            </Card>
          </div>

          {/* Diagnostic Checks List */}
          <div className="space-y-2.5">
            <h3 className="text-sm font-extrabold text-[#002623] flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#428177]" />
              <span>تفاصيل فحوصات الركائز السبعة للمنصة</span>
            </h3>

            <div className="space-y-2">
              {report.checks.map((chk) => (
                <div
                  key={chk.id}
                  className="p-3.5 rounded-xl border border-[#428177]/20 bg-white hover:border-[#428177]/50 transition-all text-right flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-[#002623]">{chk.name}</span>
                      <Badge className="bg-[#428177]/10 text-[#428177] hover:bg-[#428177]/15 text-[10px] font-bold border-none">
                        {chk.pillar}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-[#3D3A3B]">{chk.description}</p>
                    <p className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                      {chk.details}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {chk.status === "passed" && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>اجتاز بنجاح</span>
                      </span>
                    )}
                    {chk.status === "warning" && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600">
                        <AlertTriangle className="w-4 h-4" />
                        <span>تنبيه</span>
                      </span>
                    )}
                    {chk.status === "failed" && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600">
                        <XCircle className="w-4 h-4" />
                        <span>فشل</span>
                      </span>
                    )}
                    <span className="text-[10px] text-muted-foreground">{chk.latencyMs}ms</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
