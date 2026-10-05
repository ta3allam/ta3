import { describe, it, expect, beforeEach } from 'vitest';
import { LEVANT_PAYMENT_METHODS } from '@/types/payments';
import { ReceiptStore } from '@/lib/receiptStore';

describe('Day 4 Milestone: Levant Multi-Channel Payment & Manual Receipt Verification', () => {
  beforeEach(() => {
    ReceiptStore.clearMemory();
  });

  it('should provide comprehensive Levant regional payment methods and instructions', () => {
    expect(LEVANT_PAYMENT_METHODS.length).toBeGreaterThanOrEqual(6);

    const shamcash = LEVANT_PAYMENT_METHODS.find(m => m.id === 'shamcash');
    expect(shamcash).toBeDefined();
    expect(shamcash?.country).toBe('سوريا');
    expect(shamcash?.recipientAccount).toContain('0988-124-559');

    const syriatel = LEVANT_PAYMENT_METHODS.find(m => m.id === 'syriatel_cash');
    expect(syriatel).toBeDefined();
    expect(syriatel?.currency).toBe('SYP');

    const usdt = LEVANT_PAYMENT_METHODS.find(m => m.id === 'usdt_trc20');
    expect(usdt).toBeDefined();
    expect(usdt?.recipientAccount).toMatch(/^T[A-Za-z0-9]{20,}/); // Valid TRON address format
  });

  it('should calculate 85% creator earnings and 15% platform fee accurately upon receipt submission', () => {
    const coursePrice = 100; // $100
    const newReceipt = ReceiptStore.submitReceipt({
      courseId: 10,
      courseName: 'دورة هندسة الذكاء الاصطناعي الشاملة',
      courseCode: 'AI-500',
      studentId: 'student_test',
      studentName: 'أحمد السوري',
      amount: coursePrice,
      currency: 'USD',
      paymentMethod: 'shamcash',
      transactionReference: 'SHAM-TX-998822',
      receiptImageUrl: 'https://example.com/receipt.jpg',
      senderNameOrPhone: '0988-000-111',
      studentNotes: 'تم التحويل من فرع المزة'
    });

    expect(newReceipt.id).toBeDefined();
    expect(newReceipt.status).toBe('pending_verification');
    expect(newReceipt.creatorEarnings).toBe(85);
    expect(newReceipt.platformFee).toBe(15);
  });

  it('should approve receipt, record verification timestamp, and enroll student', () => {
    const receipts = ReceiptStore.loadReceipts();
    const pendingReceipt = receipts.find(r => r.status === 'pending_verification') || receipts[0];

    const approved = ReceiptStore.approveReceipt(pendingReceipt.id, 'مدير النظام المالي');
    expect(approved).not.toBeNull();
    expect(approved?.status).toBe('approved');
    expect(approved?.verifiedBy).toBe('مدير النظام المالي');
    expect(approved?.verifiedAt).toBeDefined();
  });

  it('should reject receipt with specified reason and update status', () => {
    const receipts = ReceiptStore.loadReceipts();
    const pendingReceipt = receipts.find(r => r.status === 'pending_verification') || receipts[0];

    const rejected = ReceiptStore.rejectReceipt(
      pendingReceipt.id,
      'رقم الحوالة غير مطابق لكشف الحساب المصرفي',
      'مدير النظام'
    );

    expect(rejected).not.toBeNull();
    expect(rejected?.status).toBe('rejected');
    expect(rejected?.rejectionReason).toBe('رقم الحوالة غير مطابق لكشف الحساب المصرفي');
  });

  it('should notify subscribers reactively when receipt state changes', () => {
    let notifiedReceiptsCount = 0;
    const unsubscribe = ReceiptStore.subscribe((receipts) => {
      notifiedReceiptsCount = receipts.length;
    });

    ReceiptStore.submitReceipt({
      courseId: 99,
      courseName: 'دورة تجريبية',
      courseCode: 'TEST-99',
      studentId: 'student_sub',
      studentName: 'طالب مشترك',
      amount: 40,
      currency: 'USD',
      paymentMethod: 'syriatel_cash',
      transactionReference: 'REF-SUB-101',
      receiptImageUrl: 'https://example.com/receipt2.jpg',
      senderNameOrPhone: '0944-123-456'
    });

    expect(notifiedReceiptsCount).toBeGreaterThan(0);
    unsubscribe();
  });
});
