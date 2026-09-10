import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, UserCheck, Key, Shield, Clock } from "lucide-react";

export interface AuditLogEntry {
  id: string;
  action: string;
  adminName: string;
  targetUser: string;
  category: 'role_elevation' | 'security' | 'account_lock' | 'course_moderation';
  timestamp: string;
  ipAddress: string;
}

interface PlatformAuditLogProps {
  logs?: AuditLogEntry[];
}

export function PlatformAuditLog({ logs }: PlatformAuditLogProps) {
  const defaultLogs: AuditLogEntry[] = [
    {
      id: "log-101",
      action: "ترقية رتبة المستخدم إلى صانع محتوى معتمد",
      adminName: "د. طارق المشرف",
      targetUser: "د. خالد صانع المحتوى (khaled.creator@ta3allam.app)",
      category: "role_elevation",
      timestamp: "منذ 15 دقيقة",
      ipAddress: "192.168.1.45"
    },
    {
      id: "log-102",
      action: "تعليق حساب مؤقت بسبب نشاط تسجيل دخول مريب",
      adminName: "النظام الأمني الآلي",
      targetUser: "أحمد النجار (ahmed.najjar@student.ta3allam.app)",
      category: "account_lock",
      timestamp: "منذ ساعتين",
      ipAddress: "10.0.4.12"
    },
    {
      id: "log-103",
      action: "تجديد مفاتيح توثيق JWT وشهادة SSL للأجهزة المحمولة",
      adminName: "مهندس الأمان SAI",
      targetUser: "جميع الجلسات النشطة",
      category: "security",
      timestamp: "منذ 4 ساعات",
      ipAddress: "127.0.0.1"
    }
  ];

  const displayLogs = logs || defaultLogs;

  return (
    <Card className="border border-[#428177]/30 bg-white shadow-sm rounded-2xl text-right" dir="rtl">
      <CardHeader className="p-4 border-b border-[#428177]/15 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-extrabold text-[#002623] flex items-center gap-2">
          <Shield className="h-4 w-4 text-[#428177]" />
          سجل الرقابة الأمنية والعمليات الإدارية (Audit Trail)
        </CardTitle>
        <span className="text-[11px] bg-[#EDEBE0] text-[#002623] px-2 py-0.5 rounded-full font-bold">
          {displayLogs.length} عمليات مسجلة
        </span>
      </CardHeader>
      <CardContent className="p-4 divide-y divide-[#428177]/10 space-y-3">
        {displayLogs.map(log => (
          <div key={log.id} className="pt-3 first:pt-0 flex items-start justify-between gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[#002623]">{log.action}</span>
                {log.category === 'role_elevation' && (
                  <Badge className="bg-[#428177]/15 text-[#054239] text-[10px] font-bold">ترقية صلاحية</Badge>
                )}
                {log.category === 'account_lock' && (
                  <Badge className="bg-[#6B1F2A]/15 text-[#6B1F2A] text-[10px] font-bold">إجراء أمني</Badge>
                )}
                {log.category === 'security' && (
                  <Badge className="bg-[#988561]/20 text-[#002623] text-[10px] font-bold">نظام</Badge>
                )}
              </div>
              <div className="text-[11px] text-[#3D3A3B]">
                <span>المُنفّذ: <strong>{log.adminName}</strong></span> • <span>المستهدف: {log.targetUser}</span>
              </div>
            </div>

            <div className="text-left text-[11px] text-muted-foreground whitespace-nowrap">
              <span className="block font-semibold">{log.timestamp}</span>
              <span className="block text-[10px] font-mono">{log.ipAddress}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
