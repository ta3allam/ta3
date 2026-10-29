import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Globe,
  MapPin,
  TrendingUp,
  Users,
  Compass,
  ArrowUpRight
} from "lucide-react";

export interface CountryDemographic {
  id: string;
  country: string;
  flag: string;
  studentCount: number;
  percentage: number;
  topCities: string[];
  growthRate: string;
}

const DEFAULT_DEMOGRAPHICS: CountryDemographic[] = [
  {
    id: "sy",
    country: "الجمهورية العربية السورية",
    flag: "🇸🇾",
    studentCount: 1420,
    percentage: 54,
    topCities: ["دمشق", "حلب", "اللاذقية", "حمص"],
    growthRate: "+24.5%"
  },
  {
    id: "iq",
    country: "جمهورية العراق",
    flag: "🇮🇶",
    studentCount: 472,
    percentage: 18,
    topCities: ["بغداد", "البصرة", "أربيل"],
    growthRate: "+18.2%"
  },
  {
    id: "jo",
    country: "المملكة الأردنية الهاشمية",
    flag: "🇯🇴",
    studentCount: 368,
    percentage: 14,
    topCities: ["عمان", "إربد", "الزرقاء"],
    growthRate: "+12.1%"
  },
  {
    id: "lb",
    country: "الجمهورية اللبنانية",
    flag: "🇱🇧",
    studentCount: 210,
    percentage: 8,
    topCities: ["بيروت", "طرابلس", "صيدا"],
    growthRate: "+9.4%"
  },
  {
    id: "gcc",
    country: "المغتربون ودول الخليج",
    flag: "🌐",
    studentCount: 160,
    percentage: 6,
    topCities: ["الرياض", "دبي", "إسطنبول", "برلين"],
    growthRate: "+15.8%"
  }
];

interface GeographicDemographicsCardProps {
  demographics?: CountryDemographic[];
}

export function GeographicDemographicsCard({
  demographics = DEFAULT_DEMOGRAPHICS
}: GeographicDemographicsCardProps) {
  const totalStudents = demographics.reduce((acc, d) => acc + d.studentCount, 0);

  return (
    <Card className="border border-[#428177]/30 bg-white shadow-sm rounded-2xl overflow-hidden text-right" dir="rtl">
      <CardHeader className="p-5 pb-3 bg-[#EDEBE0]/30 border-b border-[#428177]/15">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#002623] text-[#EDEBE0]">
              <Globe className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <CardTitle className="text-base font-black text-[#002623]">
                التوزيع الجغرافي للطلاب ومناطق التسجيل 🌍
              </CardTitle>
              <CardDescription className="text-xs text-[#3D3A3B] mt-0.5">
                تحليلات الدول والمحافظات التي ينتمي إليها الطلاب المسجلون عبر المنصة
              </CardDescription>
            </div>
          </div>

          <Badge variant="outline" className="border-[#428177]/40 text-[#002623] bg-white font-mono text-xs px-3 py-1">
            إجمالي الطلاب المرصودين: {totalStudents.toLocaleString()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {demographics.map((demo) => (
            <div
              key={demo.id}
              className="p-4 rounded-2xl border border-[#428177]/20 hover:border-[#428177]/50 bg-white shadow-xs transition-all space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{demo.flag}</span>
                  <div>
                    <h4 className="font-black text-sm text-[#002623]">{demo.country}</h4>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {demo.studentCount.toLocaleString()} طالب مسجل
                    </span>
                  </div>
                </div>

                <div className="text-left">
                  <span className="text-base font-black text-[#054239] font-mono">
                    {demo.percentage}%
                  </span>
                  <div className="flex items-center gap-0.5 text-[10px] text-emerald-700 font-bold">
                    <ArrowUpRight className="h-3 w-3" />
                    <span>{demo.growthRate}</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <Progress value={demo.percentage} className="h-2 bg-[#EDEBE0]" />

              {/* Top Cities */}
              <div className="flex items-center gap-1.5 text-[11px] text-[#3D3A3B] pt-1 border-t border-[#EDEBE0]">
                <MapPin className="h-3 w-3 text-[#428177] shrink-0" />
                <span className="font-bold text-[10px] text-muted-foreground">أبرز المدن:</span>
                <span className="text-[11px] font-medium">{demo.topCities.join(" • ")}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
