import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Filter, Users, Eye, BookOpen, Award } from "lucide-react";

export interface FunnelStage {
  label: string;
  count: number;
  iconName: 'eye' | 'users' | 'book' | 'award';
  color: string;
}

export interface EnrollmentFunnelData {
  visitors: number;
  previewViews: number;
  enrollments: number;
  completions: number;
}

interface EnrollmentFunnelCardProps {
  data?: EnrollmentFunnelData;
}

export function EnrollmentFunnelCard({ data }: EnrollmentFunnelCardProps) {
  const defaultData: EnrollmentFunnelData = {
    visitors: 4850,
    previewViews: 2420,
    enrollments: 850,
    completions: 610
  };

  const current = data || defaultData;

  const previewRate = current.visitors > 0 ? Math.round((current.previewViews / current.visitors) * 100) : 0;
  const enrollmentRate = current.previewViews > 0 ? Math.round((current.enrollments / current.previewViews) * 100) : 0;
  const completionRate = current.enrollments > 0 ? Math.round((current.completions / current.enrollments) * 100) : 0;

  const stages = [
    { label: "زوار صفحة المساق", count: current.visitors, percentage: 100, icon: Eye, color: "bg-[#428177]" },
    { label: "مشاهدو العرض الترويجي", count: current.previewViews, percentage: previewRate, icon: Users, color: "bg-[#054239]" },
    { label: "المسجلون في المساق", count: current.enrollments, percentage: enrollmentRate, icon: BookOpen, color: "bg-[#988561]" },
    { label: "المكملون للمساق والشهادات", count: current.completions, percentage: completionRate, icon: Award, color: "bg-[#6B1F2A]" }
  ];

  return (
    <Card className="border border-[#428177]/30 bg-white shadow-sm rounded-2xl text-right" dir="rtl">
      <CardHeader className="p-4 border-b border-[#428177]/15 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-extrabold text-[#002623] flex items-center gap-2">
          <Filter className="h-4 w-4 text-[#428177]" />
          قمع تحويل المسجلين (Conversion Funnel)
        </CardTitle>
        <span className="text-[11px] bg-[#428177]/10 text-[#054239] font-bold px-2 py-0.5 rounded-md">
          معدل الإكمال الكلي: {completionRate}%
        </span>
      </CardHeader>
      <CardContent className="p-5 space-y-4">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          return (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2 font-bold text-[#002623]">
                  <Icon className="h-3.5 w-3.5 text-[#428177]" />
                  <span>{stage.label}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-extrabold text-[#002623]">{stage.count.toLocaleString('en-US')}</span>
                  <span className="text-[11px] text-muted-foreground font-semibold">({stage.percentage}%)</span>
                </div>
              </div>
              <Progress value={stage.percentage} className="h-2 bg-[#EDEBE0] [&>div]:bg-[#428177]" />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
