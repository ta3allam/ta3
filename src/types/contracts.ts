import { z } from 'zod';
import { LevantPaymentMethod, ReceiptStatus } from './payments';

/**
 * Zod Runtime Contract Guard for Ta3 LMS
 *
 * Enforces strict runtime data validation, shape assertion, and domain invariants
 * across API payloads, payment receipts, creator payout disbursements, and course creation.
 */

export const LevantPaymentMethodSchema = z.enum([
  'shamcash',
  'syriatel_cash',
  'mtn_cash',
  'hawala_haram',
  'zaincash',
  'usdt_trc20',
  'card_visa_master',
  'wise',
]) satisfies z.ZodType<LevantPaymentMethod>;

export const ReceiptStatusSchema = z.enum([
  'pending_verification',
  'approved',
  'rejected',
]) satisfies z.ZodType<ReceiptStatus>;

export const PaymentReceiptContractSchema = z.object({
  id: z.string().min(1, 'معرّف الإيصال مطلوب'),
  courseId: z.number().int().positive('معرّف الدورة يجب أن يكون رقماً موجباً'),
  courseName: z.string().min(2, 'اسم الدورة يجب أن يتكون من حرفين على الأقل'),
  courseCode: z.string().min(1, 'رمز الدورة مطلوب'),
  studentId: z.string().min(1, 'معرّف الطالب مطلوب'),
  studentName: z.string().min(2, 'اسم الطالب مطلوب'),
  studentEmail: z.string().email('البريد الإلكتروني غير صالح').optional().or(z.literal('')),
  studentPhone: z.string().optional().or(z.literal('')),
  amount: z.number().positive('المبلغ يجب أن يكون أكبر من صفر'),
  currency: z.string().min(2, 'رمز العملة مطلوب'),
  paymentMethod: LevantPaymentMethodSchema,
  transactionReference: z.string().min(3, 'الرقم المرجعي للتحويل مطلوب'),
  receiptImageUrl: z.string().min(1, 'رابط إشعار الدفع مطلوب'),
  receiptImageName: z.string().optional(),
  senderNameOrPhone: z.string().min(3, 'اسم أو رقم المرسل مطلوب'),
  studentNotes: z.string().optional(),
  status: ReceiptStatusSchema,
  rejectionReason: z.string().optional(),
  createdAt: z.string().min(1, 'تاريخ الإنشاء مطلوب'),
  verifiedAt: z.string().optional(),
  verifiedBy: z.string().optional(),
  creatorEarnings: z.number().nonnegative('أرباح المنشئ يجب ألا تكون سالبة'),
  platformFee: z.number().nonnegative('عمولة المنصة يجب ألا تكون سالبة'),
});

export type ValidatedPaymentReceipt = z.infer<typeof PaymentReceiptContractSchema>;

export const CreatorPayoutStatusSchema = z.enum([
  'pending',
  'processing',
  'completed',
  'rejected',
]);

export type CreatorPayoutStatus = z.infer<typeof CreatorPayoutStatusSchema>;

export const CreatorPayoutContractSchema = z.object({
  id: z.string().min(1, 'معرّف طلب السحب مطلوب'),
  creatorId: z.string().min(1, 'معرّف المنشئ مطلوب'),
  creatorName: z.string().min(2, 'اسم المنشئ مطلوب'),
  requestedAmount: z.number().positive('مبلغ السحب يجب أن يكون موجباً'),
  currency: z.string().min(2, 'العملة مطلوبة'),
  payoutMethod: LevantPaymentMethodSchema,
  recipientAccount: z.string().min(4, 'رقم أو حساب المستلم مطلوب'),
  status: CreatorPayoutStatusSchema,
  requestedAt: z.string().min(1, 'تاريخ الطلب مطلوب'),
  completedAt: z.string().optional(),
  transactionReference: z.string().optional(),
  adminNotes: z.string().optional(),
});

export type ValidatedCreatorPayout = z.infer<typeof CreatorPayoutContractSchema>;

export const CourseCreationContractSchema = z.object({
  name: z.string().min(3, 'اسم الدورة يجب أن يتكون من 3 أحرف على الأقل'),
  code: z.string().min(2, 'رمز الدورة مطلوب'),
  category: z.string().optional(),
  teacher: z.string().min(2, 'اسم المعلم مطلوب'),
  pricingType: z.enum(['free', 'one_time', 'recurring', 'pay_what_you_want']).default('free'),
  priceCents: z.number().int().nonnegative('السعر لا يمكن أن يكون سالباً').default(0),
  currency: z.string().default('USD'),
  difficulty: z.enum(['مبتدئ', 'متوسط', 'متقدم']).optional().default('متوسط'),
});

export type ValidatedCourseCreation = z.infer<typeof CourseCreationContractSchema>;

/**
 * Validates raw payment receipt payload against the Zod schema
 */
export function validatePaymentReceipt(data: unknown): ValidatedPaymentReceipt {
  return PaymentReceiptContractSchema.parse(data);
}

/**
 * Safely validates payment receipt payload without throwing
 */
export function safeValidatePaymentReceipt(data: unknown) {
  return PaymentReceiptContractSchema.safeParse(data);
}

/**
 * Validates raw creator payout payload against the Zod schema
 */
export function validateCreatorPayout(data: unknown): ValidatedCreatorPayout {
  return CreatorPayoutContractSchema.parse(data);
}

/**
 * Safely validates course creation payload without throwing
 */
export function safeValidateCourseCreation(data: unknown) {
  return CourseCreationContractSchema.safeParse(data);
}
