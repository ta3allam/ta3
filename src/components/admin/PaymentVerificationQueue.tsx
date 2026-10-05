import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { PaymentReceipt, ReceiptStatus } from "@/types/payments";
import { ReceiptStore } from "@/lib/receiptStore";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Eye,
  ShieldCheck,
  FileImage,
  DollarSign,
  Landmark,
  UserCheck,
  Filter,
  Layers,
  ArrowUpDown
} from "lucide-react";
import { toast } from "sonner";

interface PaymentVerificationQueueProps {
  courseIdFilter?: number;
  verifierRole?: 'admin' | 'teacher';
}

const METHOD_LABELS: Record<string, { label: string; bg: string; text: string }> = {
  shamcash: { label: 'شام كاش 🇸🇾', bg: 'bg-emerald-50', text: 'text-emerald-800' },
  syriatel_cash: { label: 'سيريتل كاش ⚡', bg: 'bg-amber-50', text: 'text-amber-800' },
  mtn_cash: { label: 'إم تي إن كاش', bg: 'bg-yellow-50', text: 'text-yellow-800' },
  hawala_haram: { label: 'حوالة الهرم 🏢', bg: 'bg-orange-50', text: 'text-orange-800' },
  zaincash: { label: 'زين كاش 🇮🇶', bg: 'bg-indigo-50', text: 'text-indigo-800' },
  usdt_trc20: { label: 'USDT TRC20 🌐', bg: 'bg-teal-50', text: 'text-teal-800' },
  card_visa_master: { label: 'بطاقة دولية 💳', bg: 'bg-blue-50', text: 'text-blue-800' },
  wise: { label: 'Wise Transfer', bg: 'bg-cyan-50', text: 'text-cyan-800' }
};

export function PaymentVerificationQueue({
  courseIdFilter,
  verifierRole = 'admin'
}: PaymentVerificationQueueProps) {
  const [receipts, setReceipts] = useState<PaymentReceipt[]>(() => ReceiptStore.loadReceipts());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReceiptStatus | 'all'>('pending_verification');
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentReceipt | null>(null);
  const [rejectingReceipt, setRejectingReceipt] = useState<PaymentReceipt | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    const unsubscribe = ReceiptStore.subscribe((updated) => {
      setReceipts(updated);
    });
    return () => unsubscribe();
  }, []);

  const filteredReceipts = receipts.filter((r) => {
    if (courseIdFilter && r.courseId !== courseIdFilter) return false;
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.studentName.toLowerCase().includes(q) ||
        r.transactionReference.toLowerCase().includes(q) ||
        r.courseName.toLowerCase().includes(q) ||
        r.courseCode.toLowerCase().includes(q) ||
        r.paymentMethod.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = receipts.filter(r => r.status === 'pending_verification').length;
  const approvedCount = receipts.filter(r => r.status === 'approved').length;
  const totalVolumeUSD = receipts
    .filter(r => r.status === 'approved')
    .reduce((sum, r) => sum + r.amount, 0);

  const handleApprove = (receipt: PaymentReceipt) => {
    const updated = ReceiptStore.approveReceipt(
      receipt.id,
      verifierRole === 'admin' ? 'مدير النظام (SuperAdmin)' : 'المعلم المعتمد'
    );
    if (updated) {
      toast.success(`تم تأكيد استلام الحوالة (${receipt.transactionReference}) بنجاح! 🎉`, {
        description: `تم تفعيل اشتراك الطالب ${receipt.studentName} في دورة "${receipt.courseName}".`
      });
      setSelectedReceipt(null);
    }
  };

  const handleRejectConfirm = () => {
    if (!rejectingReceipt) return;
    if (!rejectionReason.trim()) {
      toast.error("يرجى كتابة سبب الرفض لإشعار الطالب.");
      return;
    }

    const updated = ReceiptStore.rejectReceipt(
      rejectingReceipt.id,
      rejectionReason.trim(),
      verifierRole === 'admin' ? 'مدير النظام (SuperAdmin)' : 'المعلم المعتمد'
    );

    if (updated) {
      toast.error(`تم رفض الإيصال (${rejectingReceipt.transactionReference})`, {
        description: `السبب: ${rejectionReason.trim()}`
      });
      setRejectingReceipt(null);
      setRejectionReason("");
      setSelectedReceipt(null);
    }
  };

  return (
    <div className="space-y-5" dir="rtl">
      {/* Metric Counters Header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-[#428177]/30 bg-white shadow-xs rounded-2xl p-4 text-right">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-black text-amber-700">{pendingCount}</span>
            <div className="p-2 bg-amber-50 rounded-xl text-amber-700">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <p className="text-xs font-bold text-[#3D3A3B] mt-1">إيصالات بانتظار التدقيق والاعتماد</p>
        </Card>

        <Card className="border border-[#428177]/30 bg-white shadow-xs rounded-2xl p-4 text-right">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-black text-emerald-800">{approvedCount}</span>
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-800">
              <UserCheck className="h-5 w-5" />
            </div>
          </div>
          <p className="text-xs font-bold text-[#3D3A3B] mt-1">حوالات معتمدة ومفعلة</p>
        </Card>

        <Card className="border border-[#428177]/30 bg-white shadow-xs rounded-2xl p-4 text-right">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-black text-[#002623]">${totalVolumeUSD}</span>
            <div className="p-2 bg-[#428177]/10 rounded-xl text-[#428177]">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <p className="text-xs font-bold text-[#3D3A3B] mt-1">إجمالي المبيعات المحصلة ($)</p>
        </Card>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#428177]/30 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="ابحث بالطالب، رقم العملية، أو الدورة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-right text-xs pr-9 rounded-xl border-[#428177]/30 h-9"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setStatusFilter('pending_verification')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'pending_verification'
                ? 'bg-[#6B1F2A] text-white shadow-xs'
                : 'bg-[#EDEBE0]/60 text-[#3D3A3B] hover:bg-[#EDEBE0]'
            }`}
          >
            بانتظار المراجعة ({pendingCount})
          </button>

          <button
            onClick={() => setStatusFilter('approved')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'approved'
                ? 'bg-[#054239] text-[#EDEBE0] shadow-xs'
                : 'bg-[#EDEBE0]/60 text-[#3D3A3B] hover:bg-[#EDEBE0]'
            }`}
          >
            المعتمدة ({approvedCount})
          </button>

          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'all'
                ? 'bg-[#002623] text-[#EDEBE0] shadow-xs'
                : 'bg-[#EDEBE0]/60 text-[#3D3A3B] hover:bg-[#EDEBE0]'
            }`}
          >
            كافة السجلات ({receipts.length})
          </button>
        </div>
      </div>

      {/* Verification Queue List */}
      {filteredReceipts.length > 0 ? (
        <div className="space-y-3">
          {filteredReceipts.map((rcpt) => {
            const methodStyle = METHOD_LABELS[rcpt.paymentMethod] || {
              label: rcpt.paymentMethod,
              bg: 'bg-gray-50',
              text: 'text-gray-800'
            };

            const isPending = rcpt.status === 'pending_verification';
            const isApproved = rcpt.status === 'approved';

            return (
              <Card
                key={rcpt.id}
                className="border border-[#428177]/25 bg-white shadow-xs rounded-2xl p-4 text-right hover:border-[#428177] transition-all"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  {/* Left: Student & Transaction Info */}
                  <div className="flex items-start gap-3">
                    <img
                      src={rcpt.receiptImageUrl}
                      alt="Receipt"
                      onClick={() => setSelectedReceipt(rcpt)}
                      className="h-14 w-14 object-cover rounded-xl border border-[#428177]/30 cursor-pointer hover:opacity-80 transition-opacity shrink-0 shadow-2xs"
                      title="انقر لمعاينة الإيصال بالحجم الكامل"
                    />

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-sm text-[#002623]">{rcpt.studentName}</span>
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${methodStyle.bg} ${methodStyle.text}`}
                        >
                          {methodStyle.label}
                        </span>

                        {isPending && (
                          <Badge className="bg-amber-100 text-amber-900 border-amber-300 text-[10px] font-bold">
                            بانتظار المراجعة ⏳
                          </Badge>
                        )}
                        {isApproved && (
                          <Badge className="bg-emerald-100 text-emerald-900 border-emerald-300 text-[10px] font-bold">
                            معتمد ومفعل ✅
                          </Badge>
                        )}
                        {rcpt.status === 'rejected' && (
                          <Badge className="bg-rose-100 text-rose-900 border-rose-300 text-[10px] font-bold">
                            مرفوض ❌
                          </Badge>
                        )}
                      </div>

                      <div className="text-xs text-[#3D3A3B] flex flex-wrap items-center gap-2">
                        <span>الدورة: <strong className="text-[#002623]">{rcpt.courseName}</strong></span>
                        <span>•</span>
                        <span className="font-mono text-[#428177] font-bold">Ref: {rcpt.transactionReference}</span>
                      </div>

                      <div className="text-[11px] text-muted-foreground flex items-center gap-3">
                        <span>المبلغ: <strong className="text-[#054239]">${rcpt.amount} {rcpt.currency}</strong></span>
                        <span>•</span>
                        <span>حصة الصانع (85%): ${rcpt.creatorEarnings}</span>
                        <span>•</span>
                        <span>رسوم المنصة (15%): ${rcpt.platformFee}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Action Buttons */}
                  <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-[#EDEBE0]">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedReceipt(rcpt)}
                      className="border-[#428177]/30 text-[#002623] hover:bg-[#EDEBE0] text-xs font-bold gap-1 rounded-xl h-9"
                    >
                      <Eye className="h-3.5 w-3.5 text-[#428177]" />
                      <span>معاينة الإيصال</span>
                    </Button>

                    {isPending && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(rcpt)}
                          className="bg-[#054239] hover:bg-[#002623] text-[#EDEBE0] font-black text-xs gap-1 rounded-xl shadow-xs h-9 px-3.5"
                        >
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          <span>تأكيد وتفعيل</span>
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setRejectingReceipt(rcpt)}
                          className="text-rose-600 hover:text-rose-800 hover:bg-rose-50 text-xs font-bold rounded-xl h-9 px-2"
                        >
                          <XCircle className="h-4 w-4" />
                          <span>رفض</span>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-[#428177]/30 rounded-2xl bg-white text-xs text-[#3D3A3B] font-medium">
          لا توجد إيصالات تطابق معايير الفلترة الحالية.
        </div>
      )}

      {/* Modal: High-Res Receipt Inspector */}
      {selectedReceipt && (
        <Dialog open={!!selectedReceipt} onOpenChange={() => setSelectedReceipt(null)}>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto p-0 rounded-3xl border border-[#428177]/30 bg-white" dir="rtl">
            <div className="bg-[#002623] text-[#EDEBE0] p-5 rounded-t-3xl flex justify-between items-center">
              <DialogHeader className="text-right">
                <DialogTitle className="text-lg font-black text-white">
                  معاينة وتدقيق إيصال التحويل المالي 🔍
                </DialogTitle>
                <p className="text-xs text-[#EDEBE0]/70 font-mono">
                  Ref: {selectedReceipt.transactionReference}
                </p>
              </DialogHeader>

              <span className="px-2.5 py-1 rounded-xl bg-[#428177] text-white text-xs font-bold">
                {METHOD_LABELS[selectedReceipt.paymentMethod]?.label || selectedReceipt.paymentMethod}
              </span>
            </div>

            <div className="p-5 space-y-4">
              {/* Receipt Image Display */}
              <div className="rounded-2xl overflow-hidden border border-[#428177]/30 bg-black/5 flex items-center justify-center p-2">
                <img
                  src={selectedReceipt.receiptImageUrl}
                  alt="Receipt Full Preview"
                  className="max-h-72 w-auto object-contain rounded-xl shadow-md"
                />
              </div>

              {/* Transaction Specs Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-[#EDEBE0]/40 p-3.5 rounded-2xl border border-[#428177]/20">
                <div>
                  <span className="text-muted-foreground block text-[11px]">اسم الطالب:</span>
                  <strong className="text-[#002623] font-black">{selectedReceipt.studentName}</strong>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[11px]">المبلغ والعملة:</span>
                  <strong className="text-[#054239] font-black">${selectedReceipt.amount} {selectedReceipt.currency}</strong>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[11px]">الدورة المستهدفة:</span>
                  <strong className="text-[#002623]">{selectedReceipt.courseName}</strong>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[11px]">تاريخ ووقت التحويل:</span>
                  <span className="text-[#3D3A3B]">{new Date(selectedReceipt.createdAt).toLocaleString('ar-EG')}</span>
                </div>

                {selectedReceipt.studentNotes && (
                  <div className="col-span-2 pt-2 border-t border-[#428177]/20">
                    <span className="text-muted-foreground block text-[11px]">ملاحظات الطالب:</span>
                    <span className="text-[#002623] font-medium">{selectedReceipt.studentNotes}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons in Modal */}
              {selectedReceipt.status === 'pending_verification' && (
                <div className="flex gap-2 pt-2 border-t border-[#EDEBE0]">
                  <Button
                    onClick={() => handleApprove(selectedReceipt)}
                    className="flex-1 bg-[#428177] hover:bg-[#054239] text-white font-black text-xs rounded-xl shadow-sm gap-1.5 py-5"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>تأكيد الدفع وتفعيل الدورة للطالب</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setRejectingReceipt(selectedReceipt);
                    }}
                    className="border-rose-300 text-rose-700 hover:bg-rose-50 font-bold text-xs rounded-xl"
                  >
                    رفض الإيصال
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal: Rejection Reason Dialog */}
      {rejectingReceipt && (
        <Dialog open={!!rejectingReceipt} onOpenChange={() => setRejectingReceipt(null)}>
          <DialogContent className="max-w-md p-5 rounded-3xl border border-rose-200 bg-white" dir="rtl">
            <DialogHeader className="text-right space-y-1">
              <DialogTitle className="text-base font-black text-rose-700 flex items-center gap-1.5">
                <XCircle className="h-5 w-5 text-rose-600" />
                <span>رفض إشعار الدفع ({rejectingReceipt.transactionReference})</span>
              </DialogTitle>
              <p className="text-xs text-[#3D3A3B]">
                اكتب سبب الرفض بوضوح ليتمكن الطالب من تصحيح العملية أو إعادة التحويل.
              </p>
            </DialogHeader>

            <div className="space-y-3 pt-2">
              <Textarea
                placeholder="مثال: رقم الحوالة غير موجود في الكشف المالي، أو صورة الإيصال غير واضحة..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="text-right text-xs rounded-xl border-[#428177]/30 min-h-[80px]"
                required
              />

              <div className="flex gap-2 justify-end pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRejectingReceipt(null)}
                  className="rounded-xl text-xs font-bold"
                >
                  إلغاء
                </Button>
                <Button
                  size="sm"
                  onClick={handleRejectConfirm}
                  className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black"
                >
                  تأكيد رفض الإيصال
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
