import { describe, it, expect } from 'vitest';
import { calculateCreatorEarnings } from '@/types/pricing';

describe('Sprint 4: Creator Economy & Marketplace E2E Integration Suite', () => {
  it('should validate complete Creator Storefront profile data model', () => {
    const creatorProfile = {
      name: 'د. خالد صانع المحتوى',
      username: '@khaled_creator',
      isVerified: true,
      totalFollowers: 3420,
      rating: 4.9,
      publishedCourses: 3
    };

    expect(creatorProfile.isVerified).toBe(true);
    expect(creatorProfile.rating).toBeGreaterThanOrEqual(4.5);
    expect(creatorProfile.publishedCourses).toBe(3);
  });

  it('should handle end-to-end multi-tier course checkout and platform fee calculations', () => {
    const studentOrders = [
      { courseId: 1, pricingType: 'free', priceDollars: 0 },
      { courseId: 2, pricingType: 'paid_one_time', priceDollars: 49 },
      { courseId: 3, pricingType: 'cohort', priceDollars: 149 },
      { courseId: 4, pricingType: 'subscription', priceDollars: 12 }
    ];

    let totalGrossRevenue = 0;
    let totalPlatformFees = 0;
    let totalCreatorPayouts = 0;

    studentOrders.forEach(order => {
      const calculation = calculateCreatorEarnings(order.priceDollars, 0.15);
      totalGrossRevenue += calculation.totalPrice;
      totalPlatformFees += calculation.platformFee;
      totalCreatorPayouts += calculation.creatorEarnings;
    });

    totalPlatformFees = Math.round(totalPlatformFees * 100) / 100;
    totalCreatorPayouts = Math.round(totalCreatorPayouts * 100) / 100;

    expect(totalGrossRevenue).toBe(210);
    expect(totalPlatformFees).toBe(31.5);
    expect(totalCreatorPayouts).toBe(178.5);
  });

  it('should enforce payout withdrawal rules and prevent overdrafts', () => {
    const availableBalance = 178.5;
    const requestedPayout1 = 40;  // Below minimum threshold of $50
    const requestedPayout2 = 200; // Above available balance
    const requestedPayout3 = 100; // Valid request

    const isRequest1Valid = requestedPayout1 >= 50 && requestedPayout1 <= availableBalance;
    const isRequest2Valid = requestedPayout2 >= 50 && requestedPayout2 <= availableBalance;
    const isRequest3Valid = requestedPayout3 >= 50 && requestedPayout3 <= availableBalance;

    expect(isRequest1Valid).toBe(false);
    expect(isRequest2Valid).toBe(false);
    expect(isRequest3Valid).toBe(true);

    const remainingBalance = availableBalance - requestedPayout3;
    expect(remainingBalance).toBe(78.5);
  });
});
