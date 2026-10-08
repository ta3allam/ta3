import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Headphones,
  CheckCircle2,
  Clock,
  Download,
  FileCode,
  TrendingUp,
  Award
} from "lucide-react";

export interface ModuleMetric {
  id: string;
  title: string;
  durationMinutes: number;
  completionRate: number; // 0 - 100%
  audioOnlyShare: number; // 0 - 100% (Levant 3G usage)
  avgQuizScore: number; // 0 - 100%
  resourceDownloads: number;
}

interface ModuleMasteryFunnelProps {
  modules?: ModuleMetric[];
}

const DEFAULT_MODULES: ModuleMetric[] = [
  {
    id: "mod-1",
    title: "الوحدة 1: الأساسيات المعمارية والاتصال الموزع",
    durationMinutes: 90,
    completionRate: 94,
    audioOnlyShare: 38,
    avgQuizScore: 89,
    resourceDownloads: 284,
  },
  {
    id: "mod-2",
    title: "الوحدة 2: بروتوكول التجزئة 512KB TUS في بيئات 3G",
    durationMinutes: 120,
    completionRate: 86,
    audioOnlyShare: 54, // High Levant 3G usage!
    avgQuizScore: 82,
    resourceDownloads: 215,
  },
  {
    id: "mod-3",
    title: "الوحدة 3: استراتيجيات التزامن المتفائل OCC وقواعد PostgreSQL",
    durationMinutes: 110,
    completionRate: 78,
    audioOnlyShare: 42,
    avgQuizScore: 76,
    resourceDownloads: 198,
  },
  {
    id: "mod-4",
    title: "الوحدة 4: الذاكرة المؤقتة Redis وحماية الدفعات المالية",
    durationMinutes: 135,
    completionRate: 71,
    audioOnlyShare: 49,
    avgQuizScore: 74,
    resourceDownloads: 167,
  },
  {
    id: "mod-5",
    title: "الوحدة 5: مشروع التخرج الشامل والاعتماد النهائي",
    durationMinutes: 180,
    completionRate: 64,
    audioOnlyShare: 31,
    avgQuizScore: 91,
    resourceDownloads: 312,
  },
];

export function ModuleMasteryFunnel({
  modules = DEFAULT_MODULES
}: ModuleMasteryFunnelProps) {
  return (
    <Card className="border border-[#428177]/30 bg-white shadow-sm rounded-2xl overflow-hidden text-right" dir="rtl">
      <CardHeader className="p-5 pb-3 bg-[#EDEBE0]/30 border-b border-[#428177]/15">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#428177]/15 text-[#428177]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base font-extrabold text-[#002623]">
                تحليلات إتقان الوحدات ونسبة استخدام نمط الصوت المنخفض (Audio-Only)
              </CardTitle>
              <CardDescription className="text-xs text-[#002623]/70 font-medium">
                تتبع استهلاك الباندويث وإكمال الدروس ومعدلات تحميل المراجع البرمجية
              </CardDescription>
            </div>
          </div>

          <Badge variant="outline" className="border-emerald-600 text-emerald-800 text-xs font-bold">
            متوسط إتقان المساق: 78.6%
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-4">
        <div className="divide-y divide-slate-100">
          {modules.map((mod, idx) => (
            <div key={mod.id} className="py-3.5 first:pt-0 last:pb-0 space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#428177] text-white text-xs font-black flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <h4 className="text-xs font-extrabold text-[#002623]">{mod.title}</h4>
                </div>

                <div className="flex items-center gap-3 text-xs flex-wrap">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#988561]" />
                    {mod.durationMinutes} دقيقة
                  </span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    اختبار: {mod.avgQuizScore}%
                  </span>
                  <span className="text-[#054239] font-bold flex items-center gap-1">
                    <Download className="w-3.5 h-3.5 text-[#428177]" />
                    {mod.resourceDownloads} تحميل
                  </span>
                </div>
              </div>

              {/* Progress Bars: Completion Rate vs Audio Only Share */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#428177]" />
                      معدل إكمال الوحدة
                    </span>
                    <span className="font-black text-[#002623]">{mod.completionRate}%</span>
                  </div>
                  <Progress
                    value={mod.completionRate}
                    className="h-1.5 rounded-full bg-slate-100 [&>div]:bg-[#428177]"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground font-semibold flex items-center gap-1">
                      <Headphones className="w-3 h-3 text-[#988561]" />
                      استهلاك نمط الصوت فقط (3G Levant)
                    </span>
                    <span className="font-black text-[#988561]">{mod.audioOnlyShare}%</span>
                  </div>
                  <Progress
                    value={mod.audioOnlyShare}
                    className="h-1.5 rounded-full bg-slate-100 [&>div]:bg-[#988561]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
