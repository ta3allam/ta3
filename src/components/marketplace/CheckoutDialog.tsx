import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PricingBadge } from "@/components/creator/PricingBadge";
import { Course } from "@/pages/courses/types";
import { useAuth } from "@/contexts/AuthContext";
import { useCourseData } from "@/contexts/CourseContext";
import { toast } from "sonner";
import {
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  Lock,
  Sparkles,
  Smartphone,
  Wallet,
  Landmark
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type PaymentGateway = 'card' | 'zaincash' | 'shamcash' | 'usdt';

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
  const { user } = useAuth();
  const [gateway, setGateway] = useState<PaymentGateway>('card');
  const [accountDetails, setAccountDetails] = useState("");
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

      // Register course enrollment into current user profile in storage
      if (user) {
        const enrolled = user.enrolledCourses || [];
        if (!enrolled.includes(course.id)) {
          user.enrolledCourses = [...enrolled, course.id];
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            try {
              const parsed = JSON.parse(storedUser);
              parsed.enrolledCourses = user.enrolledCourses;
              localStorage.setItem('user', JSON.stringify(parsed));
            } catch (err) {
              console.error(err);
            }
          }
        }
      }

      toast.success(
        isFree
          ? `تم التسجيل بنجاح في الدورة المجانية: ${course.name}`
          : `تم إتمام عملية الدفع والانضمام بنجاح للدورة: ${course.name}`
      );
      navigate(`/student/courses/${course.id}`);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="max-w-md bg-white border border-[#428177]/40 text-right rounded-3xl p-6 shadow-2xl">
        <DialogHeader className="border-b border-[#EDEBE0] pb-3">
          <DialogTitle className="text-right text-[#002623] font-black text-base flex items-center justify-between">
            <span>تأكيد التسجيل والدفع</span>
            <PricingBadge pricingType={pricingType} priceCents={course.priceCents || 0} currency={course.currency || 'USD'} />
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleEnrollmentSubmit} className="space-y-4 pt-2">
          <div className="bg-[#EDEBE0]/40 p-4 rounded-2xl space-y-2 border border-[#428177]/20">
            <h3 className="font-extrabold text-sm text-[#002623]">{course.name}</h3>
            <p className="text-xs text-[#3D3A3B]">المحاضر: <span className="font-bold">{course.teacher}</span></p>
            <div className="flex justify-between items-center text-xs border-t border-[#428177]/20 pt-2 font-bold text-[#002623]">
              <span>المبلغ الإجمالي:</span>
              <span className="text-[#054239] text-sm font-black">{isFree ? 'مجاني بالكامل' : `$${priceDollars} USD`}</span>
            </div>
          </div>

          {!isFree && (
            <div className="space-y-3">
              <Label className="text-xs font-bold text-[#002623]">اختر وسيلة الدفع المناسبة:</Label>
              <RadioGroup
                value={gateway}
                onValueChange={(val) => setGateway(val as PaymentGateway)}
                className="space-y-2"
              >
                <div className="flex items-center justify-between p-2.5 border border-[#EDEBE0] rounded-xl hover:bg-[#EDEBE0]/30 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="card" id="gw-card" />
                    <Label htmlFor="gw-card" className="cursor-pointer text-xs font-bold flex items-center gap-1.5">
                      <CreditCard className="h-4 w-4 text-[#428177]" />
                      بطاقة بنكية / فيزا / ماستركارد
                    </Label>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 border border-[#EDEBE0] rounded-xl hover:bg-[#EDEBE0]/30 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="zaincash" id="gw-zain" />
                    <Label htmlFor="gw-zain" className="cursor-pointer text-xs font-bold flex items-center gap-1.5">
                      <Smartphone className="h-4 w-4 text-[#988561]" />
                      محفظة زين كاش (الأردن / العراق)
                    </Label>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 border border-[#EDEBE0] rounded-xl hover:bg-[#EDEBE0]/30 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="shamcash" id="gw-sham" />
                    <Label htmlFor="gw-sham" className="cursor-pointer text-xs font-bold flex items-center gap-1.5">
                      <Landmark className="h-4 w-4 text-[#428177]" />
                      شام بنك / سيريتل كاش (سوريا)
                    </Label>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 border border-[#EDEBE0] rounded-xl hover:bg-[#EDEBE0]/30 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="usdt" id="gw-usdt" />
                    <Label htmlFor="gw-usdt" className="cursor-pointer text-xs font-bold flex items-center gap-1.5">
                      <Wallet className="h-4 w-4 text-[#054239]" />
                      محفظة رقمية مشفرة (USDT TRC20)
                    </Label>
                  </div>
                </div>
              </RadioGroup>

              <div className="space-y-1">
                <Label htmlFor="account-num" className="text-[11px] text-[#3D3A3B] font-bold">
                  {gateway === 'card'
                    ? 'رقم البطاقة الائتمانية (16 رقم):'
                    : gateway === 'zaincash'
                    ? 'رقم هاتف محفظة زين كاش:'
                    : gateway === 'shamcash'
                    ? 'رقم حساب سيريتل كاش / شام بنك:'
                    : 'عنوان محفظة الإرسال (USDT):'}
                </Label>
                <Input
                  id="account-num"
                  placeholder={
                    gateway === 'card'
                      ? '4000 1234 5678 9010'
                      : gateway === 'zaincash'
                      ? '079XXXXXXX'
                      : gateway === 'shamcash'
                      ? '09XXXXXXX / ACC-1092'
                      : 'TXxxxxxxxxxxxxxxxxxxxxxxxx'
                  }
                  value={accountDetails}
                  onChange={(e) => setAccountDetails(e.target.value)}
                  className="text-right text-xs border-[#428177]/40 rounded-xl"
                  required
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground justify-center pt-1">
            <Lock className="h-3.5 w-3.5 text-[#428177]" />
            <span>معاملة آمنة ومشفرة بالكامل عبر بوابة الدفع المعتمدة</span>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="submit"
              disabled={isProcessing}
              className="flex-1 bg-[#002623] hover:bg-[#054239] text-[#EDEBE0] font-bold text-xs rounded-xl shadow-md gap-1.5"
            >
              {isProcessing ? (
                <span>جاري تأكيد التسجيل...</span>
              ) : isFree ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>انضمام فوري مجاني</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>تأكيد عملية الدفع ($ {priceDollars})</span>
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
