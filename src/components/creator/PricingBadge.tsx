import { Badge } from "@/components/ui/badge";
import { PricingType } from "@/types/pricing";
import { Tag, Sparkles, Calendar, CheckCircle2 } from "lucide-react";

interface PricingBadgeProps {
  pricingType?: PricingType;
  priceCents?: number;
  currency?: string;
  className?: string;
}

export function PricingBadge({
  pricingType = 'free',
  priceCents = 0,
  currency = 'USD',
  className = ''
}: PricingBadgeProps) {
  const priceInDollars = (priceCents / 100).toFixed(0);

  switch (pricingType) {
    case 'paid_one_time':
      return (
        <Badge className={`bg-[#428177] text-white border-none font-extrabold text-xs gap-1.5 px-2.5 py-1 ${className}`}>
          <Tag className="h-3.5 w-3.5" />
          <span>${priceInDollars} {currency} • شراء مرة واحدة</span>
        </Badge>
      );

    case 'subscription':
      return (
        <Badge className={`bg-[#054239] text-white border-none font-extrabold text-xs gap-1.5 px-2.5 py-1 ${className}`}>
          <Sparkles className="h-3.5 w-3.5 text-[#988561]" />
          <span>${priceInDollars}/شهرياً • باقة الاشتراكات</span>
        </Badge>
      );

    case 'cohort':
      return (
        <Badge className={`bg-[#988561] text-white border-none font-extrabold text-xs gap-1.5 px-2.5 py-1 ${className}`}>
          <Calendar className="h-3.5 w-3.5" />
          <span>${priceInDollars} {currency} • معسكر تفاعلي (Cohort)</span>
        </Badge>
      );

    case 'free':
    default:
      return (
        <Badge className={`bg-emerald-600 text-white border-none font-extrabold text-xs gap-1.5 px-2.5 py-1 ${className}`}>
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>مجاني 100%</span>
        </Badge>
      );
  }
}
