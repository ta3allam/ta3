import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PricingType } from "@/types/pricing";
import { toast } from "sonner";
import { Tag, Sparkles, Calendar, CheckCircle2, DollarSign } from "lucide-react";

interface CoursePricingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseTitle: string;
  initialPricingType?: PricingType;
  initialPriceDollars?: number;
  onSavePricing: (config: { pricingType: PricingType; priceCents: number; currency: string }) => void;
}

export function CoursePricingDialog({
  open,
  onOpenChange,
  courseTitle,
  initialPricingType = 'free',
  initialPriceDollars = 0,
  onSavePricing
}: CoursePricingDialogProps) {
  const [pricingType, setPricingType] = useState<PricingType>(initialPricingType);
  const [priceInput, setPriceInput] = useState<string>(initialPriceDollars ? initialPriceDollars.toString() : "49");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let priceCents = 0;
    if (pricingType !== 'free') {
      const parsedPrice = parseFloat(priceInput);
      if (isNaN(parsedPrice) || parsedPrice <= 0) {
        toast.error("يرجى إدخال سعر صالح بالدولار أكبر من صفر");
        return;
      }
      priceCents = Math.round(parsedPrice * 100);
    }

    onSavePricing({
      pricingType,
      priceCents,
      currency: 'USD'
    });

    toast.success("تم تحديث واعتماد نموذج التسعير التجاري للدورة بنجاح");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="max-w-md bg-white border border-[#428177] text-right">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-right text-[#002623] font-bold text-base">
            تحديد نموذج التسعير التجاري: {courseTitle}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-[#002623]">اختر نوع ونموذج التسعير:</Label>
            <RadioGroup
              value={pricingType}
              onValueChange={(val) => setPricingType(val as PricingType)}
              className="space-y-2"
            >
              <div className="flex items-center justify-between p-3 border rounded-xl hover:bg-muted/20 cursor-pointer">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="free" id="r-free" />
                  <Label htmlFor="r-free" className="cursor-pointer text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    مجاني (Free Access)
                  </Label>
                </div>
                <span className="text-[11px] text-muted-foreground">$0.00</span>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-xl hover:bg-muted/20 cursor-pointer">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="paid_one_time" id="r-paid" />
                  <Label htmlFor="r-paid" className="cursor-pointer text-xs font-bold flex items-center gap-1.5">
                    <Tag className="h-4 w-4 text-[#428177]" />
                    دفعة واحدة (One-Time Purchase)
                  </Label>
                </div>
                <span className="text-[11px] text-muted-foreground">وصول مدى الحياة</span>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-xl hover:bg-muted/20 cursor-pointer">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="subscription" id="r-sub" />
                  <Label htmlFor="r-sub" className="cursor-pointer text-xs font-bold flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-[#054239]" />
                    اشتراك شهري (Subscription)
                  </Label>
                </div>
                <span className="text-[11px] text-muted-foreground">تجديد شهري</span>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-xl hover:bg-muted/20 cursor-pointer">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="cohort" id="r-cohort" />
                  <Label htmlFor="r-cohort" className="cursor-pointer text-xs font-bold flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-[#988561]" />
                    معسكر تفاعلي (Cohort Bootcamp)
                  </Label>
                </div>
                <span className="text-[11px] text-muted-foreground">بث مباشر ومواعيد</span>
              </div>
            </RadioGroup>
          </div>

          {pricingType !== 'free' && (
            <div className="space-y-1.5 pt-1">
              <Label htmlFor="price-input" className="text-xs font-bold text-[#002623] flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5 text-[#428177]" />
                حدد السعر بالدولار ($ USD):
              </Label>
              <Input
                id="price-input"
                type="number"
                min="1"
                step="1"
                required
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                className="text-right font-bold border-[#428177]/40 text-[#002623]"
                placeholder="مثال: 49"
              />
              <p className="text-[11px] text-muted-foreground pt-0.5">
                تأخذ المنصة عمولة 15% ($
                {((parseFloat(priceInput) || 0) * 0.15).toFixed(2)}) ويصل لحسابك $
                {((parseFloat(priceInput) || 0) * 0.85).toFixed(2)}.
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1 bg-[#428177] hover:bg-[#054239] text-white font-bold text-xs">
              حفظ نموذج التسعير
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
