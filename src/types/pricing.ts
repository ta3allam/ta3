export type PricingType = 'free' | 'paid_one_time' | 'subscription' | 'cohort';

export interface PricingConfig {
  pricingType: PricingType;
  priceCents: number; // e.g. 4900 for $49.00 USD
  currency: string;   // e.g. 'USD'
  cohortStartDate?: string; // ISO date string for live cohort bootcamps
}

export interface PlatformFeeResult {
  totalPrice: number;
  platformFee: number;     // 10-15% fee retained by Ta3
  creatorEarnings: number; // 85-90% paid to Creator
}

export function calculateCreatorEarnings(priceInDollars: number, feePercentage: number = 0.15): PlatformFeeResult {
  const platformFee = Math.round(priceInDollars * feePercentage * 100) / 100;
  const creatorEarnings = Math.round((priceInDollars - platformFee) * 100) / 100;
  return {
    totalPrice: priceInDollars,
    platformFee,
    creatorEarnings
  };
}
