import { PaymentReceipt, LevantPaymentMethod } from '@/types/payments';

const STORAGE_KEY = 'ta3_payment_receipts';

const INITIAL_MOCK_RECEIPTS: PaymentReceipt[] = [
  {
    id: 'rcpt-101',
    courseId: 1,
    courseName: 'مقدمة في الذكاء الاصطناعي وتعلم الآلة',
    courseCode: 'CS-101',
    studentId: 'student-204',
    studentName: 'سامر الحلبي',
    studentEmail: 'samer.h@gmail.com',
    studentPhone: '0933-112-445',
    amount: 49,
    currency: 'USD',
    paymentMethod: 'shamcash',
    transactionReference: 'SHAM-TX-984210',
    receiptImageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    receiptImageName: 'shamcash_receipt_samer.jpg',
    senderNameOrPhone: '0933-112-445 (سامر الحلبي)',
    studentNotes: 'تم التحويل من حساب شام كاش الشخصي في حلب.',
    status: 'pending_verification',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    creatorEarnings: 41.65, // 85%
    platformFee: 7.35 // 15%
  },
  {
    id: 'rcpt-102',
    courseId: 2,
    courseName: 'هندسة البرمجيات وبناء النظم الموزعة',
    courseCode: 'CS-202',
    studentId: 'student-308',
    studentName: 'نور الهدى الشامي',
    studentEmail: 'nour.shami@gmail.com',
    studentPhone: '0944-998-112',
    amount: 35,
    currency: 'USD',
    paymentMethod: 'syriatel_cash',
    transactionReference: 'SYR-8841029',
    receiptImageUrl: 'https://images.unsplash.com/photo-1580048915913-4f8f5cb481c4?w=600&auto=format&fit=crop&q=80',
    receiptImageName: 'syriatel_receipt_nour.png',
    senderNameOrPhone: '0944-998-112',
    studentNotes: 'تحويل سيريتل كاش فوري، يرجى تفعيل حسابي للانضمام للجلسة المباشرة.',
    status: 'pending_verification',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    creatorEarnings: 29.75,
    platformFee: 5.25
  },
  {
    id: 'rcpt-103',
    courseId: 3,
    courseName: 'تطوير تطبيقات الويب الكاملة باستخدام React & Node.js',
    courseCode: 'CS-303',
    studentId: 'student-410',
    studentName: 'كريم البغدادي',
    studentEmail: 'kareem.b@yahoo.com',
    studentPhone: '079-8833211',
    amount: 59,
    currency: 'USD',
    paymentMethod: 'zaincash',
    transactionReference: 'ZAIN-IQ-77621',
    receiptImageUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=80',
    receiptImageName: 'zaincash_iq_receipt.jpg',
    senderNameOrPhone: '079-8833211',
    studentNotes: 'تحويل محفظة زين كاش.',
    status: 'approved',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    verifiedAt: new Date(Date.now() - 3600000 * 22).toISOString(),
    verifiedBy: 'مدير النظام المالي (SuperAdmin)',
    creatorEarnings: 50.15,
    platformFee: 8.85
  },
  {
    id: 'rcpt-104',
    courseId: 4,
    courseName: 'أمن المعلومات واختبار الاختراق الأخلاقي',
    courseCode: 'SEC-401',
    studentId: 'student-512',
    studentName: 'عمر الدمشقي',
    studentEmail: 'omar.d@outlook.com',
    studentPhone: '0999-332-110',
    amount: 75,
    currency: 'USDT',
    paymentMethod: 'usdt_trc20',
    transactionReference: 'e4a2d7f89c1b3e5a0d2f4a6b8c0e2a4d6f8a0b2c4e6f8a0b2c4e6f8a0b2c4e6',
    receiptImageUrl: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=600&auto=format&fit=crop&q=80',
    receiptImageName: 'tronscan_txid_proof.png',
    senderNameOrPhone: 'TKn78qW...9vNx (TRC20)',
    studentNotes: 'تم التحويل عبر شبكة TRON بنجاح.',
    status: 'pending_verification',
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    creatorEarnings: 63.75,
    platformFee: 11.25
  }
];

type ReceiptListener = (receipts: PaymentReceipt[]) => void;
const listeners = new Set<ReceiptListener>();

// Safe in-memory fallback for environments where window.localStorage is unavailable
let memoryStore: Record<string, string> = {};

function getStoredItem(key: string): string | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage.getItem(key);
  }
  return memoryStore[key] || null;
}

function setStoredItem(key: string, value: string): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(key, value);
  }
  memoryStore[key] = value;
}

export const ReceiptStore = {
  clearMemory(): void {
    memoryStore = {};
  },

  loadReceipts(): PaymentReceipt[] {
    try {
      const data = getStoredItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to parse receipts from storage', e);
    }
    setStoredItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_RECEIPTS));
    return INITIAL_MOCK_RECEIPTS;
  },

  saveReceipts(receipts: PaymentReceipt[]): void {
    try {
      setStoredItem(STORAGE_KEY, JSON.stringify(receipts));
    } catch (e) {
      console.error('Failed to save receipts', e);
    }
    listeners.forEach(fn => fn(receipts));
  },

  subscribe(listener: ReceiptListener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  submitReceipt(data: {
    courseId: number;
    courseName: string;
    courseCode: string;
    studentId: string;
    studentName: string;
    studentEmail?: string;
    studentPhone?: string;
    amount: number;
    currency: string;
    paymentMethod: LevantPaymentMethod;
    transactionReference: string;
    receiptImageUrl: string;
    receiptImageName?: string;
    senderNameOrPhone: string;
    studentNotes?: string;
  }): PaymentReceipt {
    const receipts = this.loadReceipts();
    const newReceipt: PaymentReceipt = {
      id: `rcpt-${Date.now()}`,
      courseId: data.courseId,
      courseName: data.courseName,
      courseCode: data.courseCode,
      studentId: data.studentId,
      studentName: data.studentName,
      studentEmail: data.studentEmail,
      studentPhone: data.studentPhone,
      amount: data.amount,
      currency: data.currency,
      paymentMethod: data.paymentMethod,
      transactionReference: data.transactionReference,
      receiptImageUrl: data.receiptImageUrl,
      receiptImageName: data.receiptImageName || 'payment_receipt.jpg',
      senderNameOrPhone: data.senderNameOrPhone,
      studentNotes: data.studentNotes,
      status: 'pending_verification',
      createdAt: new Date().toISOString(),
      creatorEarnings: Math.round(data.amount * 0.85 * 100) / 100,
      platformFee: Math.round(data.amount * 0.15 * 100) / 100
    };

    const updated = [newReceipt, ...receipts];
    this.saveReceipts(updated);
    return newReceipt;
  },

  approveReceipt(receiptId: string, verifiedBy = 'مدير النظام (Admin)'): PaymentReceipt | null {
    const receipts = this.loadReceipts();
    const index = receipts.findIndex(r => r.id === receiptId);
    if (index === -1) return null;

    const receipt = receipts[index];
    const updatedReceipt: PaymentReceipt = {
      ...receipt,
      status: 'approved',
      verifiedAt: new Date().toISOString(),
      verifiedBy
    };

    receipts[index] = updatedReceipt;
    this.saveReceipts(receipts);

    // Enroll student in user profile
    try {
      const storedUser = getStoredItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const enrolled = user.enrolledCourses || [];
        if (!enrolled.includes(receipt.courseId)) {
          user.enrolledCourses = [...enrolled, receipt.courseId];
          setStoredItem('user', JSON.stringify(user));
        }
      }
    } catch (e) {
      console.error('Error updating enrolledCourses on receipt approval', e);
    }

    return updatedReceipt;
  },

  rejectReceipt(receiptId: string, reason: string, verifiedBy = 'مدير النظام (Admin)'): PaymentReceipt | null {
    const receipts = this.loadReceipts();
    const index = receipts.findIndex(r => r.id === receiptId);
    if (index === -1) return null;

    const updatedReceipt: PaymentReceipt = {
      ...receipts[index],
      status: 'rejected',
      rejectionReason: reason,
      verifiedAt: new Date().toISOString(),
      verifiedBy
    };

    receipts[index] = updatedReceipt;
    this.saveReceipts(receipts);
    return updatedReceipt;
  }
};
