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
    <div className="metric-card-grid">
      <Card className="metric-card">
        <CardHeader className="metric-header">
          <CardTitle className="metric-title">إجمالي الطلاب</CardTitle>
          <Users className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="metric-value">{totalStudents}</div>
          <p className="metric-subtext">طالب مسجل بالمنصة</p>
        </CardContent>
      </Card>

      <Card className="metric-card">
        <CardHeader className="metric-header">
          <CardTitle className="metric-title">إجمالي المعلمين</CardTitle>
          <UserCheck className="h-5 w-5 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="metric-value">{totalTeachers}</div>
          <p className="metric-subtext">عضو هيئة تدريس</p>
        </CardContent>
      </Card>

      <Card className="metric-card">
        <CardHeader className="metric-header">
          <CardTitle className="metric-title">المقررات النشطة</CardTitle>
          <TrendingUp className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="metric-value">{totalCourses}</div>
          <p className="metric-subtext">مقرر دراسي متاح</p>
        </CardContent>
      </Card>

      <Card className="metric-card">
        <CardHeader className="metric-header">
          <CardTitle className="metric-title">الطلبات المعلقة</CardTitle>
          <BarChart3 className="h-5 w-5 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="metric-value">{pendingRequests}</div>
          <p className="metric-subtext">طلب تسجيل بانتظار الموافقة</p>
        </CardContent>
      </Card>
    </div>
  );
};
