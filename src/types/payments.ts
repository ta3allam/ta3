export type LevantPaymentMethod =
  | 'shamcash'
  | 'syriatel_cash'
  | 'mtn_cash'
  | 'hawala_haram'
  | 'zaincash'
  | 'usdt_trc20'
  | 'card_visa_master'
  | 'wise';

export type ReceiptStatus = 'pending_verification' | 'approved' | 'rejected';

export interface PaymentReceipt {
  id: string;
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
  status: ReceiptStatus;
  rejectionReason?: string;
  createdAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  creatorEarnings: number;
  platformFee: number;
}

export interface PaymentMethodConfig {
  id: LevantPaymentMethod;
  name: string;
  shortLabel: string;
  country: string;
  currency: string;
  iconName: string;
  instructions: string;
  recipientAccount: string;
  recipientName: string;
  badge?: string;
}

export const LEVANT_PAYMENT_METHODS: PaymentMethodConfig[] = [
  {
    id: 'shamcash',
    name: 'شام كاش / بنك الشام',
    shortLabel: 'ShamCash',
    country: 'سوريا',
    currency: 'SYP',
    iconName: 'Landmark',
    instructions: 'يرجى تحويل قيمة الدورة إلى حساب شام كاش الموضح أدناه، ثم إرفاق رقم الحوالة وصورة الإشعار.',
    recipientAccount: '0988-124-559 (ACC-SHAM-9021)',
    recipientName: 'منصة تعلّم التعليمية — الحساب المالي المعتمد',
    badge: 'الأكثر استخداماً في سوريا 🇸🇾'
  },
  {
    id: 'syriatel_cash',
    name: 'سيريتل كاش (Syriatel Cash)',
    shortLabel: 'سيريتل كاش',
    country: 'سوريا',
    currency: 'SYP',
    iconName: 'Smartphone',
    instructions: 'قم بإجراء التحويل عبر كود USSD أو تطبيق أقرب إليك إلى الرقم التالي، ثم ارفع صورة الإشعار.',
    recipientAccount: '0933-456-789',
    recipientName: 'حساب سيريتل كاش المعتمد (منصة تعلّم)',
    badge: 'دفع فوري مباشر ⚡'
  },
  {
    id: 'hawala_haram',
    name: 'حوالات الهرم والفؤاد (Al-Haram / Al-Fouad)',
    shortLabel: 'حوالة الهرم',
    country: 'كافة المحافظات السورية',
    currency: 'SYP',
    iconName: 'Building2',
    instructions: 'أرسل الحوالة باسم المستلم الموضح أدناه إلى فرع دمشق، واكتب رقم إشعار الحوالة الصادر من الشركة.',
    recipientAccount: 'هاتف: 0944-112-233 — فرع دمشق المركزي',
    recipientName: 'أحمد المحمد (المعتمد المالي لمنصة تعلّم)',
    badge: 'كافة المحافظات 🏢'
  },
  {
    id: 'zaincash',
    name: 'محفظة زين كاش (ZainCash)',
    shortLabel: 'ZainCash',
    country: 'الأردن والعراق',
    currency: 'USD / JOD / IQD',
    iconName: 'Wallet',
    instructions: 'أرسل المبلغ لمحفظة زين كاش التالية ثم قم بإدخال الرقم المرجعي للعملية.',
    recipientAccount: '079-8800112',
    recipientName: 'Ta3allam Educational Wallet',
    badge: 'الأردن والعراق 🇯🇴 🇮🇶'
  },
  {
    id: 'usdt_trc20',
    name: 'العملات الرقمية المشفرة (USDT TRC-20)',
    shortLabel: 'USDT TRC20',
    country: 'دولي ومحلي',
    currency: 'USDT',
    iconName: 'Coins',
    instructions: 'قم بتحويل المبلغ الدقيق إلى عنوان المحفظة (شبكة TRON / TRC-20) وأرفق TxID تجزئة المعاملة.',
    recipientAccount: 'TYj89Wkm2XqR9pL7Zq1vN4mK8tE3bH9sVw',
    recipientName: 'Ta3allam USDT Vault (TRC-20)',
    badge: 'بدون قيود دولية 🌐'
  },
  {
    id: 'card_visa_master',
    name: 'بطاقة فيزا / ماستركارد / Wise',
    shortLabel: 'بطاقة دولية',
    country: 'عالمي',
    currency: 'USD',
    iconName: 'CreditCard',
    instructions: 'الدفع الآمن بالبطاقات الدولية مع معالجة وتفعيل فوري للاشتراك.',
    recipientAccount: 'checkout@ta3allam.sy (Wise / Stripe Gateway)',
    recipientName: 'Ta3allam Learning Ltd',
    badge: 'تفعيل فوري ⚡'
  }
];
