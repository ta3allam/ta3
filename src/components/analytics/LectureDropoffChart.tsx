import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3, TrendingDown, CheckCircle2 } from "lucide-react";

export interface LectureMetric {
  id: string | number;
  title: string;
  completionRate: number; // percentage e.g. 94%
  dropoffCount: number;
}

interface LectureDropoffChartProps {
  lectures?: LectureMetric[];
}

export function LectureDropoffChart({ lectures }: LectureDropoffChartProps) {
  const defaultLectures: LectureMetric[] = [
    { id: 1, title: "المحاضرة 1: مدخل إلى هندسة البرمجيات الموزعة", completionRate: 98, dropoffCount: 12 },
    { id: 2, title: "المحاضرة 2: تصميم قواعد البيانات وفصل القراءة والكتابة (CQRS)", completionRate: 89, dropoffCount: 65 },
    { id: 3, title: "المحاضرة 3: إدارة التزامن والقفل الإيجابي (OCC)", completionRate: 81, dropoffCount: 110 },
    { id: 4, title: "المحاضرة 4: بناء بروتوكول التجزئة 512KB TUS", completionRate: 74, dropoffCount: 155 },
    { id: 5, title: "المحاضرة 5: مشروع التخرج النهائي وتوزيع الخدمات", completionRate: 68, dropoffCount: 190 }
  ];

  const currentLectures = lectures || defaultLectures;

  return (
    <Card className="border border-[#428177]/30 bg-white shadow-sm rounded-2xl text-right" dir="rtl">
      <CardHeader className="p-4 border-b border-[#428177]/15 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-extrabold text-[#002623] flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-[#428177]" />
          معدل استبقاء الطلاب وتسرب المحاضرات (Module Retention)
        </CardTitle>
        <span className="text-[11px] bg-[#988561]/20 text-[#002623] font-bold px-2 py-0.5 rounded-md">
          متوسط الإكمال: 82%
        </span>
      </CardHeader>
      <CardContent className="p-5 space-y-4">
        {currentLectures.map((item) => (
          <div key={item.id} className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#002623]">{item.title}</span>
              <div className="flex items-center gap-2 text-xs">
                <span className={`font-extrabold ${
                  item.completionRate >= 80 ? "text-emerald-700" : item.completionRate >= 70 ? "text-amber-700" : "text-rose-700"
                }`}>
                  {item.completionRate}% إكمال
                </span>
                <span className="text-[11px] text-muted-foreground">({item.dropoffCount} متسرب)</span>
              </div>
            </div>
            <Progress
              value={item.completionRate}
              className={`h-2 bg-[#EDEBE0] ${
                item.completionRate >= 80 ? "[&>div]:bg-emerald-600" : item.completionRate >= 70 ? "[&>div]:bg-[#988561]" : "[&>div]:bg-[#6B1F2A]"
              }`}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
