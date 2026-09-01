import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PricingBadge } from "@/components/creator/PricingBadge";
import { Course } from "@/pages/courses/types";
import { toast } from "sonner";
import { CreditCard, CheckCircle2, ShieldCheck, Lock, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course & { id: number };
}

export function CheckoutDialog({
  open,
  onOpenChange,
  course
}: CheckoutDialogProps) {
  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const pricingType = course.pricingType || 'free';
  const isFree = pricingType === 'free';
  const priceDollars = ((course.priceCents || 0) / 100).toFixed(0);

  const handleEnrollmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      onOpenChange(false);
      toast.success(
        isFree
          ? `تم التسجيل بنجاح في الدورة المجانية: ${course.name}`
          : `تم إتمام عملية الشراء والانضمام بنجاح للدورة: ${course.name}`
      );
      navigate(`/student/courses/${course.id}`);
    }, 1200);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="max-w-md bg-white border border-[#428177] text-right">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-right text-[#002623] font-bold text-base flex items-center justify-between">
            <span>تأكيد التسجيل والانضمام للدورة</span>
            <PricingBadge pricingType={pricingType} priceCents={course.priceCents || 0} currency={course.currency || 'USD'} />
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleEnrollmentSubmit} className="space-y-4 pt-2">
          <div className="bg-[#EDEBE0]/40 p-4 rounded-xl space-y-2 border border-[#428177]/20">
            <h3 className="font-extrabold text-sm text-[#002623]">{course.name}</h3>
            <p className="text-xs text-[#3D3A3B]">المحاضر / صانع المحتوى: <span className="font-bold">{course.teacher}</span></p>
            <div className="flex justify-between items-center text-xs border-t border-[#428177]/20 pt-2 font-bold text-[#002623]">
              <span>المبلغ الإجمالي المطلـوب:</span>
              <span className="text-[#054239] text-sm">{isFree ? 'مجاني بالكامل' : `$${priceDollars} USD`}</span>
            </div>
          </div>

          {!isFree && (
            <div className="space-y-3 border-t border-b py-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#002623]">
                <CreditCard className="h-4 w-4 text-[#428177]" />
                <span>بيانات بطاقة الدفع (محاكاة دفع آمن):</span>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="card-num" className="text-[11px] text-[#3D3A3B]">رقم البطاقة الائتمانية:</Label>
                <Input
                  id="card-num"
                  placeholder="4000 1234 5678 9010"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="text-right text-xs border-[#428177]/30"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="expiry" className="text-[11px] text-[#3D3A3B]">تاريخ الانتهاء:</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="text-right text-xs border-[#428177]/30"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="cvv" className="text-[11px] text-[#3D3A3B]">رمز CVC:</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className="text-right text-xs border-[#428177]/30"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground justify-center">
            <Lock className="h-3 w-3 text-[#428177]" />
            <span>معاملة مشفرة ومحمية 100% بنظام الحماية المعتمد</span>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="submit"
              disabled={isProcessing}
              className="flex-1 bg-[#428177] hover:bg-[#054239] text-white font-bold text-xs gap-1.5"
            >
              {isProcessing ? (
                <span>جاري المعالجة...</span>
              ) : isFree ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>انضمام فوري مجاني</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>تأكيد عملية الشراء ($ {priceDollars})</span>
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-24 font-bold border-[#428177]/30 text-xs"
            >
              إلغاء
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
