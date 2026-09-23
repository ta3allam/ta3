import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { DollarSign, Landmark, Send, ShieldCheck, Wallet, Smartphone, CreditCard } from "lucide-react";

export type PayoutMethod = 'bank' | 'wise' | 'paypal' | 'zaincash' | 'shamcash' | 'usdt';

interface PayoutRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableBalance: number;
  onRequestPayout: (payout: {
    amount: number;
    method: PayoutMethod;
    accountDetails: string;
  }) => void;
}

export function PayoutRequestDialog({
  open,
  onOpenChange,
  availableBalance,
  onRequestPayout
}: PayoutRequestDialogProps) {
  const [amountInput, setAmountInput] = useState<string>(availableBalance.toString());
  const [method, setMethod] = useState<PayoutMethod>('bank');
  const [accountDetails, setAccountDetails] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(amountInput);

    if (isNaN(amount) || amount < 50) {
      toast.error("الحد الأدنى لطلب السحب هو 50 دولار");
      return;
    }

    if (amount > availableBalance) {
      toast.error("المبلغ المطلوب أكبر من الرصيد المتاح للسحب");
      return;
    }

    if (!accountDetails.trim()) {
      toast.error("يرجى إدخال تفاصيل الحساب أو المحفظة");
      return;
    }

    onRequestPayout({
      amount,
      method,
      accountDetails
    });

    toast.success(`تم تقديم طلب سحب أرباح بقيمة $${amount} بنجاح`);
    onOpenChange(false);
  };

  const getMethodPlaceholder = () => {
    switch (method) {
      case 'bank':
        return 'رقم الآيبان (IBAN) واسم البنك واسم المستفيد الكامل';
      case 'wise':
        return 'البريد الإلكتروني المسجل في Wise وحساب العملة';
      case 'paypal':
        return 'البريد الإلكتروني المسجل في PayPal';
      case 'zaincash':
        return 'رقم هاتف محفظة زين كاش (الأردن / العراق)';
      case 'shamcash':
        return 'رقم الحساب المصرفي / محفظة سيريتل كاش أو شام بنك';
      case 'usdt':
      default:
        return 'عنوان محفظة USDT (شبكة TRC20 أو Arbitrum)';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="max-w-md bg-white border border-[#428177]/30 text-right rounded-3xl shadow-2xl p-6">
        <DialogHeader className="border-b border-[#EDEBE0] pb-3">
          <DialogTitle className="text-right text-[#002623] font-black text-base flex items-center justify-between">
            <span>طلب سحب أرباح صانع المحتوى</span>
            <span className="text-xs bg-[#428177]/10 text-[#054239] px-2.5 py-1 rounded-full font-extrabold">
              الرصيد المتاح: ${availableBalance}
            </span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="amount-input" className="text-xs font-bold text-[#002623] flex items-center gap-1">
              <DollarSign className="h-3.5 w-3.5 text-[#428177]" />
              المبلغ المراد سحبه ($ USD):
            </Label>
            <Input
              id="amount-input"
              type="number"
              min="50"
              max={availableBalance}
              step="1"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              className="text-right font-bold border-[#428177]/40 text-[#002623] rounded-xl text-xs"
              required
            />
            <p className="text-[11px] text-muted-foreground">الحد الأدنى لطلب السحب هو $50 دولار أمريكي.</p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-[#002623]">اختر طريقة وقناة استلام الأرباح:</Label>
            <RadioGroup
              value={method}
              onValueChange={(val) => setMethod(val as PayoutMethod)}
              className="space-y-2"
            >
              <div className="flex items-center justify-between p-2.5 border border-[#EDEBE0] rounded-xl hover:bg-[#EDEBE0]/30 cursor-pointer transition-colors">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="bank" id="m-bank" />
                  <Label htmlFor="m-bank" className="cursor-pointer text-xs font-bold flex items-center gap-1.5">
                    <Landmark className="h-4 w-4 text-[#428177]" />
                    تحويل بنكي مباشر (IBAN / SWIFT)
                  </Label>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 border border-[#EDEBE0] rounded-xl hover:bg-[#EDEBE0]/30 cursor-pointer transition-colors">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="zaincash" id="m-zain" />
                  <Label htmlFor="m-zain" className="cursor-pointer text-xs font-bold flex items-center gap-1.5">
                    <Smartphone className="h-4 w-4 text-[#988561]" />
                    محفظة زين كاش (ZainCash - الأردن / العراق)
                  </Label>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 border border-[#EDEBE0] rounded-xl hover:bg-[#EDEBE0]/30 cursor-pointer transition-colors">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="shamcash" id="m-sham" />
                  <Label htmlFor="m-sham" className="cursor-pointer text-xs font-bold flex items-center gap-1.5">
                    <CreditCard className="h-4 w-4 text-[#428177]" />
                    شام بنك / سيريتل كاش (ShamBank - سوريا)
                  </Label>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 border border-[#EDEBE0] rounded-xl hover:bg-[#EDEBE0]/30 cursor-pointer transition-colors">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="wise" id="m-wise" />
                  <Label htmlFor="m-wise" className="cursor-pointer text-xs font-bold flex items-center gap-1.5">
                    <Send className="h-4 w-4 text-[#054239]" />
                    حساب وايز (Wise Transfer)
                  </Label>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 border border-[#EDEBE0] rounded-xl hover:bg-[#EDEBE0]/30 cursor-pointer transition-colors">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="usdt" id="m-usdt" />
                  <Label htmlFor="m-usdt" className="cursor-pointer text-xs font-bold flex items-center gap-1.5">
                    <Wallet className="h-4 w-4 text-[#988561]" />
                    محفظة رقمية مشفرة (USDT TRC20)
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="account-details" className="text-xs font-bold text-[#002623]">
              بيانات المستفيد ورقم الحساب / المحفظة:
            </Label>
            <Input
              id="account-details"
              placeholder={getMethodPlaceholder()}
              value={accountDetails}
              onChange={(e) => setAccountDetails(e.target.value)}
              className="text-right text-xs border-[#428177]/40 rounded-xl"
              required
            />
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground justify-center pt-1">
            <ShieldCheck className="h-3.5 w-3.5 text-[#428177]" />
            <span>تتم معالجة السحوبات والتحقق الأمني خلال 24–48 ساعة عمل</span>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1 bg-[#002623] hover:bg-[#054239] text-[#EDEBE0] font-bold text-xs rounded-xl shadow-md">
              تأكيد وإرسال طلب السحب
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-24 font-bold border-[#428177]/30 text-xs rounded-xl hover:bg-[#EDEBE0]"
            >
              إلغاء
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
