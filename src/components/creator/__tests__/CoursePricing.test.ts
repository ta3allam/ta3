import { describe, it, expect } from 'vitest';
import { calculateCreatorEarnings } from '@/types/pricing';

describe('Course Pricing & Monetization Unit Tests', () => {
  it('should convert price dollars to cents accurately', () => {
    const priceDollars = 49;
    const cents = Math.round(priceDollars * 100);

    expect(cents).toBe(4900);
  });

  it('should calculate 15% platform fee deduction across different pricing models', () => {
    // $49 one-time course purchase
    const result1 = calculateCreatorEarnings(49, 0.15);
    expect(result1.platformFee).toBe(7.35);
    expect(result1.creatorEarnings).toBe(41.65);

    // $149 6-week intensive cohort bootcamp
    const result2 = calculateCreatorEarnings(149, 0.15);
    expect(result2.platformFee).toBe(22.35);
    expect(result2.creatorEarnings).toBe(126.65);

    // $12/month subscription access
    const result3 = calculateCreatorEarnings(12, 0.15);
    expect(result3.platformFee).toBe(1.8);
    expect(result3.creatorEarnings).toBe(10.2);
  });
});
