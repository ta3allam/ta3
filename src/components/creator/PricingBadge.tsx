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
        <Badge
          variant="outline"
          className={`bg-[#428177]/15 text-[#428177] dark:text-[#78bab1] border-[#428177]/40 font-bold text-xs gap-1.5 px-2.5 py-1 tabular-nums shadow-sm ${className}`}
        >
          <Tag className="h-3.5 w-3.5 text-[#428177] dark:text-[#78bab1]" />
          <span>${priceInDollars} {currency} • شراء مرة واحدة</span>
        </Badge>
      );

    case 'subscription':
      return (
        <Badge
          variant="outline"
          className={`bg-[#054239]/15 text-[#054239] dark:text-[#a5d6a7] border-[#054239]/40 font-bold text-xs gap-1.5 px-2.5 py-1 tabular-nums shadow-sm ${className}`}
        >
          <Sparkles className="h-3.5 w-3.5 text-[#988561]" />
          <span>${priceInDollars}/شهرياً • باقة الاشتراكات</span>
        </Badge>
      );

    case 'cohort':
      return (
        <Badge
          variant="outline"
          className={`bg-[#988561]/15 text-[#988561] dark:text-[#EDEBE0] border-[#988561]/40 font-bold text-xs gap-1.5 px-2.5 py-1 tabular-nums shadow-sm ${className}`}
        >
          <Calendar className="h-3.5 w-3.5 text-[#988561]" />
          <span>${priceInDollars} {currency} • معسكر تفاعلي (Cohort)</span>
        </Badge>
      );

    case 'free':
    default:
      return (
        <Badge
          variant="outline"
          className={`bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 font-bold text-xs gap-1.5 px-2.5 py-1 tabular-nums shadow-sm ${className}`}
        >
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>مجاني 100%</span>
        </Badge>
      );
  }
}
