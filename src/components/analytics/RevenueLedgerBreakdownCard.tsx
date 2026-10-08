import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  TrendingUp,
  Wallet,
  Building2,
  ShieldCheck,
  CreditCard,
  Layers,
  ArrowUpRight
} from "lucide-react";
import {
  calculateRevenueSplit,
  getRegionalPaymentChannelMetrics,
  RevenueSplitResult
} from "@/lib/analytics/creatorMetricsEngine";

interface RevenueLedgerBreakdownCardProps {
  grossRevenue?: number;
  onNavigatePayouts?: () => void;
}

export function RevenueLedgerBreakdownCard({
  grossRevenue = 12450,
  onNavigatePayouts
}: RevenueLedgerBreakdownCardProps) {
  const split: RevenueSplitResult = calculateRevenueSplit(grossRevenue, 15);
  const channels = getRegionalPaymentChannelMetrics(grossRevenue);

  return (
    <Card className="border border-[#428177]/30 bg-white shadow-sm rounded-2xl overflow-hidden text-right" dir="rtl">
      <CardHeader className="p-5 pb-3 bg-[#EDEBE0]/30 border-b border-[#428177]/15">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#428177]/15 text-[#428177]">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base font-extrabold text-[#002623]">
                تحليل الإيرادات وتوزيع القنوات المالية (85% للأستاذ)
              </CardTitle>
              <CardDescription className="text-xs text-[#002623]/70 font-medium">
                توزيع إيرادات المبيعات المحققة وقنوات الدفع في بلاد الشام والشرق الأوسط
              </CardDescription>
            </div>
          </div>

          {onNavigatePayouts && (
            <Button
              onClick={onNavigatePayouts}
              variant="outline"
              size="sm"
              className="text-xs font-bold border-[#428177]/30 text-[#002623] hover:bg-[#EDEBE0]"
            >
              سحب الأرباح إلى المحفظة
              <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-6">
        {/* Top 3 KPI Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Gross */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-xs font-bold text-slate-500">إجمالي المبيعات (Gross GMV)</span>
            <div className="text-xl font-black text-[#002623]">${split.grossVolume.toLocaleString()}</div>
            <span className="text-[11px] text-slate-400 block font-medium">قبل خصم الرسوم</span>
          </div>

          {/* Creator Net 85% */}
          <div className="p-4 rounded-xl bg-[#428177]/10 border border-[#428177]/30 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#054239]">صافي أرباحك (85%)</span>
              <Badge className="bg-[#428177] text-white text-[10px] font-bold px-1.5 py-0">صافي</Badge>
            </div>
            <div className="text-xl font-black text-[#428177]">${split.creatorNet.toLocaleString()}</div>
            <span className="text-[11px] text-[#054239]/80 block font-medium">جاهزة للتحويل والتحصيل</span>
          </div>

          {/* Platform Fee 15% */}
          <div className="p-4 rounded-xl bg-[#988561]/10 border border-[#988561]/30 space-y-1">
            <span className="text-xs font-bold text-[#002623]/70">رسوم المنصة والتشغيل (15%)</span>
            <div className="text-xl font-black text-[#002623]">${split.platformFee.toLocaleString()}</div>
            <span className="text-[11px] text-[#002623]/60 block font-medium">تغطية الاستضافة والتحقق اليدوي</span>
          </div>
        </div>

        {/* Regional Channels Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold text-[#002623] flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-[#428177]" />
              حجم المعاملات حسب قنوات الدفع الإقليمية
            </h4>
            <span className="text-[11px] text-muted-foreground font-semibold">
              إجمالي {channels.reduce((acc, c) => acc + c.transactionsCount, 0)} عملية شراء
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {channels.map((ch) => (
              <div key={ch.channelId} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#002623]">{ch.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-[#428177]">${ch.totalVolume.toLocaleString()}</span>
                    <span className="text-muted-foreground text-[11px]">({ch.percentage}%)</span>
                  </div>
                </div>
                <Progress
                  value={ch.percentage}
                  className="h-2 rounded-full bg-slate-100 [&>div]:bg-[#428177]"
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
