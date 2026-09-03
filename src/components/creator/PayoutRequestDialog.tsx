import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { DollarSign, Landmark, Send, ShieldCheck, Wallet } from "lucide-react";

interface PayoutRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableBalance: number;
  onRequestPayout: (payout: {
    amount: number;
    method: 'bank' | 'wise' | 'paypal' | 'usdt';
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
  const [method, setMethod] = useState<'bank' | 'wise' | 'paypal' | 'usdt'>('bank');
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="max-w-md bg-white border border-[#428177] text-right">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-right text-[#002623] font-bold text-base flex items-center justify-between">
            <span>طلب سحب الأرباح للمحفظة</span>
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
              className="text-right font-bold border-[#428177]/40 text-[#002623]"
              required
            />
            <p className="text-[11px] text-muted-foreground">الحد الأدنى لطلب السحب هو $50 دولار أمريكي.</p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-[#002623]">اختر طريقة استلام الأرباح:</Label>
            <RadioGroup
              value={method}
              onValueChange={(val) => setMethod(val as 'bank' | 'wise' | 'paypal' | 'usdt')}
              className="space-y-2"
            >
              <div className="flex items-center justify-between p-3 border rounded-xl hover:bg-muted/20 cursor-pointer">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="bank" id="m-bank" />
                  <Label htmlFor="m-bank" className="cursor-pointer text-xs font-bold flex items-center gap-1.5">
                    <Landmark className="h-4 w-4 text-[#428177]" />
                    تحويل بنكي محلي / دولي (IBAN / SWIFT)
                  </Label>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-xl hover:bg-muted/20 cursor-pointer">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="wise" id="m-wise" />
                  <Label htmlFor="m-wise" className="cursor-pointer text-xs font-bold flex items-center gap-1.5">
                    <Send className="h-4 w-4 text-[#054239]" />
                    حساب وايز (Wise Transfer)
                  </Label>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-xl hover:bg-muted/20 cursor-pointer">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="usdt" id="m-usdt" />
                  <Label htmlFor="m-usdt" className="cursor-pointer text-xs font-bold flex items-center gap-1.5">
                    <Wallet className="h-4 w-4 text-[#988561]" />
                    محفظة رقمية مشفرة (USDT TRC20 / ERC20)
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="account-details" className="text-xs font-bold text-[#002623]">
              بيانات الحساب / المحفظة:
            </Label>
            <Input
              id="account-details"
              placeholder={
                method === 'bank'
                  ? 'رقم الآيبان (IBAN) واسم البنك واسم المستفيد'
                  : method === 'wise'
                  ? 'البريد الإلكتروني المسجل في Wise'
                  : 'عنوان محفظة USDT'
              }
              value={accountDetails}
              onChange={(e) => setAccountDetails(e.target.value)}
              className="text-right text-xs border-[#428177]/40"
              required
            />
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground justify-center">
            <ShieldCheck className="h-3.5 w-3.5 text-[#428177]" />
            <span>تتم معالجة عمليات السحب وتدقيقها أمنياً خلال 24–48 ساعة عمل</span>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1 bg-[#428177] hover:bg-[#054239] text-white font-bold text-xs">
              تأكيد وتقديم طلب السحب
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
