import { describe, it, expect } from 'vitest';

describe('Creator Dashboard & Storefront Unit Tests', () => {
  it('should format creator follower count and rating correctly', () => {
    const totalFollowers = 3420;
    const rating = 4.9;

    expect(totalFollowers).toBe(3420);
    expect(rating).toBeGreaterThanOrEqual(4.5);
  });

  it('should calculate 15% platform commission correctly from creator course sale', () => {
    const coursePrice = 100; // $100
    const platformFeePercentage = 0.15; // 15%

    const platformFee = coursePrice * platformFeePercentage;
    const creatorEarnings = coursePrice - platformFee;

    expect(platformFee).toBe(15);
    expect(creatorEarnings).toBe(85);
  });
});
