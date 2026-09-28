import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, TrendingUp, BarChart3, DollarSign, ShieldCheck, Sparkles, ShoppingBag } from 'lucide-react';

interface AdminMetricsOverviewProps {
  totalStudents: number;
  totalTeachers: number;
  totalCreators?: number;
  totalCourses: number;
  pendingRequests: number;
  platformGMV?: number;
  platformRevenue?: number;
}

export const AdminMetricsOverview: React.FC<AdminMetricsOverviewProps> = ({
  totalStudents,
  totalTeachers,
  totalCreators = 8,
  totalCourses,
  pendingRequests,
  platformGMV = 34850,
  platformRevenue = 5227.50, // 15% platform commission
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-right" dir="rtl">
      {/* Platform GMV Telemetry */}
      <Card className="border border-[#428177]/30 bg-white shadow-sm rounded-3xl p-4">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-black text-[#002623]">${platformGMV.toLocaleString()}</span>
          <div className="p-2.5 bg-[#428177]/10 rounded-2xl text-[#428177]">
            <ShoppingBag className="h-5 w-5" />
          </div>
        </div>
        <p className="text-xs font-bold text-[#3D3A3B] mt-2">إجمالي مبيعات المنصة (GMV)</p>
        <span className="text-[10px] text-[#428177] font-semibold">مبيعات دورات صناع المحتوى</span>
      </Card>

      {/* Platform 15% Revenue */}
      <Card className="border border-[#428177]/30 bg-white shadow-sm rounded-3xl p-4">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-black text-[#054239]">${platformRevenue.toLocaleString()}</span>
          <div className="p-2.5 bg-[#054239]/10 rounded-2xl text-[#054239]">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>
        <p className="text-xs font-bold text-[#3D3A3B] mt-2">عوائد عمولة المنصة (15%)</p>
        <span className="text-[10px] text-emerald-700 font-semibold">استقطاع آلي لدعم وتشغيل الخوادم</span>
      </Card>

      {/* Total Users Matrix */}
      <Card className="border border-[#428177]/30 bg-white shadow-sm rounded-3xl p-4">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-black text-[#002623]">{totalStudents + totalTeachers + totalCreators}</span>
          <div className="p-2.5 bg-[#988561]/15 rounded-2xl text-[#988561]">
            <Users className="h-5 w-5" />
          </div>
        </div>
        <p className="text-xs font-bold text-[#3D3A3B] mt-2">إجمالي الحسابات المسجلة</p>
        <span className="text-[10px] text-muted-foreground font-semibold">
          {totalStudents} طالب • {totalTeachers} معلم • {totalCreators} صانع
        </span>
      </Card>

      {/* Course Catalog & Moderation Queue */}
      <Card className="border border-[#428177]/30 bg-white shadow-sm rounded-3xl p-4">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-black text-[#6B1F2A]">{pendingRequests}</span>
          <div className="p-2.5 bg-[#6B1F2A]/10 rounded-2xl text-[#6B1F2A]">
            <BarChart3 className="h-5 w-5" />
          </div>
        </div>
        <p className="text-xs font-bold text-[#3D3A3B] mt-2">طلبات التدقيق والاعتماد</p>
        <span className="text-[10px] text-[#6B1F2A] font-semibold">بانتظار مراجعة الإدارة</span>
      </Card>
    </div>
  );
};
