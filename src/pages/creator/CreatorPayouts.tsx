import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PayoutRequestDialog } from "@/components/creator/PayoutRequestDialog";
import { DollarSign, ArrowDownLeft, ArrowUpRight, Wallet, CheckCircle2, Clock, ShieldCheck, Download } from "lucide-react";
import { getAssetUrl } from "@/lib/assetUtils";
import { toast } from "sonner";

interface Transaction {
  id: string;
  courseName: string;
  studentName: string;
  date: string;
  grossAmount: number;
  platformFee: number;
  netEarnings: number;
  status: 'completed' | 'pending';
}

interface PayoutRecord {
  id: string;
  amount: number;
  method: string;
  date: string;
  status: 'completed' | 'processing';
}

export default function CreatorPayouts() {
  const [availableBalance, setAvailableBalance] = useState(3825);
  const [lifetimeGross, setLifetimeGross] = useState(4500);
  const [lifetimePlatformFees, setLifetimePlatformFees] = useState(675);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "TX-9041",
      courseName: "مبادئ البرمجة وهندسة النظم",
      studentName: "أحمد منصور",
      date: "2026-09-02",
      grossAmount: 100,
      platformFee: 15,
      netEarnings: 85,
      status: 'completed'
    },
    {
      id: "TX-9040",
      courseName: "معسكر الذكاء الاصطناعي التفاعلي",
      studentName: "سارة العلي",
      date: "2026-09-01",
      grossAmount: 149,
      platformFee: 22.35,
      netEarnings: 126.65,
      status: 'completed'
    },
    {
      id: "TX-9039",
      courseName: "الرياضيات المتقدمة للمهندسين",
      studentName: "محمود الشامي",
      date: "2026-08-31",
      grossAmount: 49,
      platformFee: 7.35,
      netEarnings: 41.65,
      status: 'completed'
    }
  ]);

  const [payouts, setPayouts] = useState<PayoutRecord[]>([
    {
      id: "PO-102",
      amount: 1200,
      method: "تحويل بنكي (IBAN)",
      date: "2026-08-20",
      status: 'completed'
    }
  ]);

  const handleRequestPayout = (payout: { amount: number; method: string; accountDetails: string }) => {
    setAvailableBalance(prev => prev - payout.amount);
    setPayouts(prev => [
      {
        id: `PO-${Math.floor(100 + Math.random() * 900)}`,
        amount: payout.amount,
        method: payout.method === 'bank' ? 'تحويل بنكي' : payout.method === 'wise' ? 'Wise Transfer' : 'USDT TRC20',
        date: new Date().toISOString().split('T')[0],
        status: 'processing'
      },
      ...prev
    ]);
  };

  const handleExportStatement = () => {
    toast.success("تم تصدير كشف الحساب المالي (CSV) بنجاح");
  };

  return (
    <DashboardLayout title="الأرباح والمحفظة المالية">
      <div className="space-y-6" dir="rtl">
        {/* Header Banner */}
        <div
          className="relative overflow-hidden rounded-2xl bg-white border border-[#428177] p-6 md:p-8 shadow-sm"
          style={{
            backgroundImage: `linear-gradient(to left, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.82)), url('${getAssetUrl("/dashboard bg/otherbackground.png")}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#428177]/10 text-[#428177] text-xs font-bold mb-3 border border-[#428177]/30">
                <Wallet className="w-3.5 h-3.5 text-[#428177]" />
                <span>محفظة صانع المحتوى وإدارة الأرباح</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[#002623]">المحفظة وسجل عوائد المبيعات 💵</h1>
              <p className="text-[#3D3A3B] mt-2 text-sm max-w-xl font-medium">
                متابعة مبيعات الدورات، استقطاع عمولة المنصة (15%) تلقائياً، وطلب سحب الرصيد إلى حسابك البنكي أو محفظتك.
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleExportStatement} variant="outline" className="border-[#428177]/30 text-[#002623] font-bold text-xs gap-1.5">
                <Download className="h-4 w-4" />
                تصدير كشف الحساب
              </Button>
              <Button onClick={() => setIsPayoutModalOpen(true)} className="bg-[#428177] hover:bg-[#054239] text-white font-bold text-xs gap-1.5 shadow-sm">
                <ArrowDownLeft className="h-4 w-4" />
                طلب سحب أرباح
              </Button>
            </div>
          </div>
        </div>

        {/* Balance & KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border border-[#428177]/30 bg-white shadow-sm rounded-2xl p-5 text-right">
            <div className="flex justify-between items-center">
              <span className="text-3xl font-extrabold text-[#054239]">${availableBalance}</span>
              <div className="p-2.5 bg-[#428177]/10 rounded-xl text-[#428177]">
                <Wallet className="h-6 w-6" />
              </div>
            </div>
            <p className="text-xs font-bold text-[#3D3A3B] mt-2">الرصيد المتاح للسحب الفوري ($ USD)</p>
          </Card>

          <Card className="border border-[#428177]/30 bg-white shadow-sm rounded-2xl p-5 text-right">
            <div className="flex justify-between items-center">
              <span className="text-3xl font-extrabold text-[#002623]">${lifetimeGross}</span>
              <div className="p-2.5 bg-[#988561]/15 rounded-xl text-[#988561]">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
            <p className="text-xs font-bold text-[#3D3A3B] mt-2">إجمالي مبيعات الدورات الكلي (Gross)</p>
          </Card>

          <Card className="border border-[#428177]/30 bg-white shadow-sm rounded-2xl p-5 text-right">
            <div className="flex justify-between items-center">
              <span className="text-3xl font-extrabold text-[#6B1F2A]">${lifetimePlatformFees}</span>
              <div className="p-2.5 bg-[#6B1F2A]/10 rounded-xl text-[#6B1F2A]">
                <ShieldCheck className="h-6 w-6" />
              </div>
            </div>
            <p className="text-xs font-bold text-[#3D3A3B] mt-2">رسوم دعم المنصة المستقطعة (15%)</p>
          </Card>
        </div>

        {/* Sales Ledger Table */}
        <Card className="border border-[#428177]/30 bg-white shadow-sm rounded-2xl overflow-hidden text-right">
          <CardHeader className="bg-[#EDEBE0]/30 border-b border-[#428177]/10 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-bold text-[#002623]">سجل المبيعات وعمولات المنصة التلقائي</CardTitle>
            <Badge variant="outline" className="border-[#428177]/30 text-[#054239] text-xs font-bold">
              نسبة العمولة: 15% ثابتة
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right">
                <thead className="bg-[#EDEBE0]/60 text-[#002623] border-b font-bold">
                  <tr>
                    <th className="p-3.5">رقم المعاملة</th>
                    <th className="p-3.5">الدورة</th>
                    <th className="p-3.5">الطالب</th>
                    <th className="p-3.5">التاريخ</th>
                    <th className="p-3.5">سعر البيع</th>
                    <th className="p-3.5">عمولة المنصة (15%)</th>
                    <th className="p-3.5">صافي الأرباح (85%)</th>
                    <th className="p-3.5">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-muted/10">
                      <td className="p-3.5 font-bold text-[#002623]">{tx.id}</td>
                      <td className="p-3.5 font-medium">{tx.courseName}</td>
                      <td className="p-3.5 text-muted-foreground">{tx.studentName}</td>
                      <td className="p-3.5 text-muted-foreground">{tx.date}</td>
                      <td className="p-3.5 font-bold">${tx.grossAmount}</td>
                      <td className="p-3.5 text-[#6B1F2A] font-bold">-${tx.platformFee}</td>
                      <td className="p-3.5 text-[#054239] font-extrabold">+${tx.netEarnings}</td>
                      <td className="p-3.5">
                        <Badge className="bg-emerald-600/15 text-emerald-700 border-none font-bold text-[11px] gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          مكتملة
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Payout History */}
        <Card className="border border-[#428177]/30 bg-white shadow-sm rounded-2xl overflow-hidden text-right">
          <CardHeader className="bg-[#EDEBE0]/30 border-b border-[#428177]/10">
            <CardTitle className="text-base font-bold text-[#002623]">سجل طلبات التحويل والسحب السابقة</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right">
                <thead className="bg-[#EDEBE0]/60 text-[#002623] border-b font-bold">
                  <tr>
                    <th className="p-3.5">رقم السحب</th>
                    <th className="p-3.5">المبلغ</th>
                    <th className="p-3.5">طريقة الاستلام</th>
                    <th className="p-3.5">التاريخ</th>
                    <th className="p-3.5">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payouts.map((po) => (
                    <tr key={po.id} className="hover:bg-muted/10">
                      <td className="p-3.5 font-bold text-[#002623]">{po.id}</td>
                      <td className="p-3.5 font-extrabold text-[#054239]">${po.amount}</td>
                      <td className="p-3.5 text-muted-foreground">{po.method}</td>
                      <td className="p-3.5 text-muted-foreground">{po.date}</td>
                      <td className="p-3.5">
                        {po.status === 'completed' ? (
                          <Badge className="bg-emerald-600/15 text-emerald-700 border-none font-bold text-[11px] gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            تم التحويل بنجاح
                          </Badge>
                        ) : (
                          <Badge className="bg-[#988561]/20 text-[#002623] border-none font-bold text-[11px] gap-1">
                            <Clock className="h-3 w-3 text-[#988561]" />
                            جاري المراجعة والتحويل
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Payout Request Modal */}
        <PayoutRequestDialog
          open={isPayoutModalOpen}
          onOpenChange={setIsPayoutModalOpen}
          availableBalance={availableBalance}
          onRequestPayout={handleRequestPayout}
        />
      </div>
    </DashboardLayout>
  );
}
