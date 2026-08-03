import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, TrendingUp, BarChart3 } from 'lucide-react';

interface AdminMetricsOverviewProps {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  pendingRequests: number;
}

export const AdminMetricsOverview: React.FC<AdminMetricsOverviewProps> = ({
  totalStudents,
  totalTeachers,
  totalCourses,
  pendingRequests,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="border border-border/80 shadow-sm bg-card hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">إجمالي الطلاب</CardTitle>
          <Users className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-foreground">{totalStudents}</div>
          <p className="text-xs text-muted-foreground mt-1">طالب مسجل بالمنصة</p>
        </CardContent>
      </Card>

      <Card className="border border-border/80 shadow-sm bg-card hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">إجمالي المعلمين</CardTitle>
          <UserCheck className="h-5 w-5 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-foreground">{totalTeachers}</div>
          <p className="text-xs text-muted-foreground mt-1">عضو هيئة تدريس</p>
        </CardContent>
      </Card>

      <Card className="border border-border/80 shadow-sm bg-card hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">المقررات النشطة</CardTitle>
          <TrendingUp className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-foreground">{totalCourses}</div>
          <p className="text-xs text-muted-foreground mt-1">مقرر دراسي متاح</p>
        </CardContent>
      </Card>

      <Card className="border border-border/80 shadow-sm bg-card hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">الطلبات المعلقة</CardTitle>
          <BarChart3 className="h-5 w-5 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-foreground">{pendingRequests}</div>
          <p className="text-xs text-muted-foreground mt-1">طلب تسجيل بانتظار الموافقة</p>
        </CardContent>
      </Card>
    </div>
  );
};
