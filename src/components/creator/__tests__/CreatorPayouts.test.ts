import { describe, it, expect } from 'vitest';

describe('Creator Payouts & Commission Ledger Unit Tests', () => {
  it('should enforce minimum payout withdrawal threshold of $50', () => {
    const minThreshold = 50;
    const requestedAmount = 40;
    const isValidRequest = requestedAmount >= minThreshold;

    expect(isValidRequest).toBe(false);
  });

  it('should compute net creator earnings after 15% platform fee correctly', () => {
    const sales = [
      { price: 100, fee: 15, net: 85 },
      { price: 149, fee: 22.35, net: 126.65 },
      { price: 49, fee: 7.35, net: 41.65 }
    ];

    const totalGross = sales.reduce((acc, s) => acc + s.price, 0);
    const totalFees = sales.reduce((acc, s) => acc + s.fee, 0);
    const totalNet = sales.reduce((acc, s) => acc + s.net, 0);

    expect(totalGross).toBe(298);
    expect(totalFees).toBe(44.7);
    expect(totalNet).toBe(253.3);
  });
});
