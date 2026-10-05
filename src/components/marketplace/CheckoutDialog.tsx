import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PricingBadge } from "@/components/creator/PricingBadge";
import { Course } from "@/pages/courses/types";
import { useAuth } from "@/contexts/AuthContext";
import {
  LEVANT_PAYMENT_METHODS,
  LevantPaymentMethod,
  PaymentMethodConfig
} from "@/types/payments";
import { ReceiptStore } from "@/lib/receiptStore";
import { toast } from "sonner";
import {
  CheckCircle2,
  Lock,
  Sparkles,
  Smartphone,
  Wallet,
  Landmark,
  Building2,
  Coins,
  CreditCard,
  Copy,
  Check,
  UploadCloud,
  FileImage,
  AlertCircle,
  HelpCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course & { id: number };
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Landmark: <Landmark className="h-4 w-4 text-[#428177]" />,
  Smartphone: <Smartphone className="h-4 w-4 text-[#054239]" />,
  Building2: <Building2 className="h-4 w-4 text-[#988561]" />,
  Wallet: <Wallet className="h-4 w-4 text-[#6B1F2A]" />,
  Coins: <Coins className="h-4 w-4 text-[#988561]" />,
  CreditCard: <CreditCard className="h-4 w-4 text-[#428177]" />,
};

export function CheckoutDialog({
  open,
  onOpenChange,
  course
}: CheckoutDialogProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [selectedMethodId, setSelectedMethodId] = useState<LevantPaymentMethod>('shamcash');
  const [transactionRef, setTransactionRef] = useState("");
  const [senderInfo, setSenderInfo] = useState(user?.name ? `${user.name}` : "");
  const [studentNotes, setStudentNotes] = useState("");
  const [receiptImage, setReceiptImage] = useState<string>("");
  const [receiptFileName, setReceiptFileName] = useState<string>("");
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const pricingType = course.pricingType || 'free';
  const isFree = pricingType === 'free';
  const priceDollars = ((course.priceCents || 0) / 100).toFixed(0);

  const selectedConfig = LEVANT_PAYMENT_METHODS.find(m => m.id === selectedMethodId) || LEVANT_PAYMENT_METHODS[0];

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(selectedConfig.recipientAccount);
    setCopiedAccount(true);
    toast.success("تم نسخ رقم الحساب / المحفظة بنجاح!");
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setReceiptImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseMockReceipt = () => {
    setReceiptImage("https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80");
    setReceiptFileName("shamcash_verified_receipt.jpg");
    setTransactionRef(`TX-LEVANT-${Math.floor(100000 + Math.random() * 900000)}`);
    toast.info("تم توليد إيصال تحويل تجريبي جاهز للاختبار!");
  };

  const handleEnrollmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFree) {
      if (!transactionRef.trim()) {
        toast.error("يرجى إدخال رقم العملية / الحوالة المرجعي.");
        return;
      }
      if (!receiptImage) {
        toast.error("يرجى إرفاق صورة إشعار أو إيصال التحويل.");
        return;
      }
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      onOpenChange(false);

      if (isFree) {
        // Direct free enrollment
        if (user) {
          const enrolled = user.enrolledCourses || [];
          if (!enrolled.includes(course.id)) {
            user.enrolledCourses = [...enrolled, course.id];
            try {
              const storedUser = localStorage.getItem('user');
              if (storedUser) {
                const parsed = JSON.parse(storedUser);
                parsed.enrolledCourses = user.enrolledCourses;
                localStorage.setItem('user', JSON.stringify(parsed));
              }
            } catch (err) {
              console.error(err);
            }
          }
        }
        toast.success(`تم التسجيل بنجاح في الدورة المجانية: ${course.name}`);
        navigate(`/student/courses/${course.id}`);
      } else {
        // Paid manual receipt submission
        ReceiptStore.submitReceipt({
          courseId: course.id,
          courseName: course.name,
          courseCode: course.code,
          studentId: user?.username || 'student_guest',
          studentName: user?.name || senderInfo || 'طالب المنصة',
          studentEmail: user?.email,
          studentPhone: senderInfo,
          amount: parseFloat(priceDollars) || 29,
          currency: course.currency || 'USD',
          paymentMethod: selectedMethodId,
          transactionReference: transactionRef.trim(),
          receiptImageUrl: receiptImage,
          receiptImageName: receiptFileName || 'receipt.jpg',
          senderNameOrPhone: senderInfo.trim() || user?.name || 'طالب',
          studentNotes: studentNotes.trim()
        });

        toast.success("تم إرسال إشعار الدفع بنجاح إلى الإدارة! ⏳", {
          description: `رقم العملية: ${transactionRef.trim()} — سيتم مراجعة الإيصال وتفعيل دورتك خلال دقائق.`
        });
      }
    }, 800);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        dir="rtl"
        className="max-w-xl max-h-[90vh] overflow-y-auto bg-white border border-[#428177]/40 text-right rounded-3xl p-6 shadow-2xl"
      >
        <DialogHeader className="border-b border-[#EDEBE0] pb-3">
          <DialogTitle className="text-right text-[#002623] font-black text-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#988561]" />
              <span>بوابة الدفع والتحويل لمنطقة بلاد الشام 🇸🇾</span>
            </div>
            <PricingBadge
              pricingType={pricingType}
              priceCents={course.priceCents || 0}
              currency={course.currency || 'USD'}
            />
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleEnrollmentSubmit} className="space-y-4 pt-2">
          {/* Course Summary Box */}
          <div className="bg-[#EDEBE0]/40 p-4 rounded-2xl space-y-1.5 border border-[#428177]/20">
            <h3 className="font-black text-sm text-[#002623]">{course.name}</h3>
            <p className="text-xs text-[#3D3A3B]">
              المحاضر: <span className="font-bold">{course.teacher}</span> | رمز الدورة: <span className="font-mono font-bold text-[#428177]">{course.code}</span>
            </p>
            <div className="flex justify-between items-center text-xs border-t border-[#428177]/20 pt-2 font-bold text-[#002623]">
              <span>المبلغ الإجمالي المستحق:</span>
              <span className="text-[#054239] text-base font-black">
                {isFree ? 'مجاني بالكامل 🎁' : `$${priceDollars} USD`}
              </span>
            </div>
          </div>

          {!isFree && (
            <>
              {/* Payment Method Selector Grid */}
              <div className="space-y-2">
                <Label className="text-xs font-black text-[#002623]">
                  1. اختر وسيلة التحويل أو المحفظة المتاحة لديك:
                </Label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {LEVANT_PAYMENT_METHODS.map((method) => {
                    const isSelected = selectedMethodId === method.id;
                    return (
                      <div
                        key={method.id}
                        onClick={() => setSelectedMethodId(method.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                          isSelected
                            ? 'bg-[#002623] text-[#EDEBE0] border-[#002623] shadow-xs'
                            : 'bg-white hover:bg-[#EDEBE0]/30 border-[#428177]/20 text-[#002623]'
                        }`}
                      >
                        <div className={`p-1.5 rounded-xl mt-0.5 ${isSelected ? 'bg-white/10 text-white' : 'bg-[#428177]/10'}`}>
                          {ICON_MAP[method.iconName] || <Landmark className="h-4 w-4" />}
                        </div>

                        <div className="space-y-0.5 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black">{method.name}</span>
                          </div>
                          <div className={`text-[10px] ${isSelected ? 'text-[#EDEBE0]/70' : 'text-muted-foreground'}`}>
                            {method.country} ({method.currency})
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recipient Account & Instructions Card */}
              <div className="p-4 rounded-2xl bg-[#EDEBE0]/60 border border-[#988561]/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#002623] flex items-center gap-1.5">
                    <HelpCircle className="h-3.5 w-3.5 text-[#428177]" />
                    <span>بيانات المستلم والتحويل المعتمدة:</span>
                  </span>
                  {selectedConfig.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#002623] text-[#EDEBE0]">
                      {selectedConfig.badge}
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-[#3D3A3B] leading-relaxed">
                  {selectedConfig.instructions}
                </p>

                <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-[#428177]/20 gap-2">
                  <div className="space-y-0.5">
                    <div className="text-[10px] text-muted-foreground">رقم الحساب / المحفظة:</div>
                    <div className="text-xs font-mono font-black text-[#002623] select-all">
                      {selectedConfig.recipientAccount}
                    </div>
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleCopyAccount}
                    className="border-[#428177]/30 text-[#002623] hover:bg-[#EDEBE0] text-[11px] font-bold h-8 gap-1 rounded-lg shrink-0"
                  >
                    {copiedAccount ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-[#428177]" />}
                    <span>{copiedAccount ? 'تم النسخ' : 'نسخ'}</span>
                  </Button>
                </div>
              </div>

              {/* Receipt & Transaction Submission Form */}
              <div className="space-y-3 pt-1">
                <Label className="text-xs font-black text-[#002623]">
                  2. تفاصيل الإشعار وإثبات الدفع:
                </Label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[11px] font-bold text-[#3D3A3B]">
                      رقم العملية / الحوالة المرجعي (TxID / Ref) <span className="text-rose-600">*</span>
                    </Label>
                    <Input
                      placeholder="مثال: SHAM-902144 أو 0933-TX-102"
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      className="text-right text-xs border-[#428177]/40 rounded-xl font-mono"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] font-bold text-[#3D3A3B]">
                      اسم أو هاتف صاحب الحساب المحول
                    </Label>
                    <Input
                      placeholder="رقم هاتفك أو اسمك المسجل بالحوالة"
                      value={senderInfo}
                      onChange={(e) => setSenderInfo(e.target.value)}
                      className="text-right text-xs border-[#428177]/40 rounded-xl"
                    />
                  </div>
                </div>

                {/* Receipt Upload Box */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <Label className="text-[11px] font-bold text-[#3D3A3B]">
                      صورة إيصال التحويل (Screenshot) <span className="text-rose-600">*</span>
                    </Label>
                    <button
                      type="button"
                      onClick={handleUseMockReceipt}
                      className="text-[10px] font-bold text-[#428177] hover:underline"
                    >
                      (تعبئة إيصال تجريبي سريع)
                    </button>
                  </div>

                  <div className="border-2 border-dashed border-[#428177]/30 rounded-2xl p-4 text-center hover:bg-[#EDEBE0]/20 transition-colors bg-white relative">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    
                    {receiptImage ? (
                      <div className="flex items-center justify-center gap-3">
                        <img
                          src={receiptImage}
                          alt="Receipt Preview"
                          className="h-12 w-12 object-cover rounded-xl border border-[#428177]/30 shadow-xs"
                        />
                        <div className="text-right">
                          <div className="text-xs font-bold text-[#002623] flex items-center gap-1">
                            <FileImage className="h-3.5 w-3.5 text-[#428177]" />
                            <span>{receiptFileName || "تم إرفاق الإيصال"}</span>
                          </div>
                          <span className="text-[10px] text-emerald-700 font-semibold">جاهز للمراجعة والتدقيق</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <UploadCloud className="h-6 w-6 text-[#428177] mx-auto" />
                        <div className="text-xs font-bold text-[#002623]">انقر هنا لرفع صورة الإيصال أو اسحب الملف</div>
                        <div className="text-[10px] text-muted-foreground">يدعم صيغ JPG, PNG, WebP (بحد أقصى 5 ميغابايت)</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-[11px] font-bold text-[#3D3A3B]">
                    ملاحظات إضافية للمدقق (اختياري)
                  </Label>
                  <Textarea
                    placeholder="أي توضيحات تخص وقت التحويل أو اسم الفرع..."
                    value={studentNotes}
                    onChange={(e) => setStudentNotes(e.target.value)}
                    className="text-right text-xs border-[#428177]/40 rounded-xl resize-none h-16"
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground justify-center pt-1">
            <Lock className="h-3.5 w-3.5 text-[#428177]" />
            <span>معاملة آمنة ومدققة وفق معايير الحماية المالية لمنصة تعلّم</span>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="submit"
              disabled={isProcessing}
              className="flex-1 bg-[#428177] hover:bg-[#054239] text-white font-black text-xs rounded-xl shadow-md gap-1.5 py-5"
            >
              {isProcessing ? (
                <span>جاري معالجة الطلب...</span>
              ) : isFree ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>انضمام فوري مجاني للدورة</span>
                </>
              ) : (
                <>
                  <UploadCloud className="h-4 w-4" />
                  <span>إرسال إشعار الدفع للمراجعة والتفعيل ($ {priceDollars})</span>
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-24 font-bold border-[#428177]/30 text-xs rounded-xl"
            >
              إلغاء
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
