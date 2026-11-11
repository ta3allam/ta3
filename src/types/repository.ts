import { CourseData, Announcement, Lecture, Assignment, Submission } from '@/pages/courses/types';
import { PaymentReceipt, LevantPaymentMethod } from '@/types/payments';

/**
 * Repository interface for Course domain entities.
 * Abstracts local mock storage from future PostgREST/Supabase backend services.
 */
export interface ICourseRepository {
  loadCourses(): Promise<CourseData> | CourseData;
  saveCourses(data: CourseData): Promise<void> | void;
  addAnnouncement(courseId: number, announcement: Omit<Announcement, 'id'>): Promise<CourseData> | CourseData;
  addLecture(courseId: number, lecture: Omit<Lecture, 'id'>): Promise<CourseData> | CourseData;
  addAssignment(courseId: number, assignment: Omit<Assignment, 'id'>): Promise<CourseData> | CourseData;
  addSubmission(courseId: number, submission: Omit<Submission, 'id'>): Promise<CourseData> | CourseData;
  subscribe(listener: (data: CourseData) => void): () => void;
}

/**
 * Input DTO for submitting a new payment receipt.
 */
export interface SubmitReceiptInput {
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
}

/**
 * Repository interface for Levant Payment Receipts & Verification workflows.
 */
export interface IReceiptRepository {
  loadReceipts(): Promise<PaymentReceipt[]> | PaymentReceipt[];
  saveReceipts(receipts: PaymentReceipt[]): Promise<void> | void;
  submitReceipt(data: SubmitReceiptInput): Promise<PaymentReceipt> | PaymentReceipt;
  approveReceipt(receiptId: string, verifiedBy?: string): Promise<PaymentReceipt | null> | PaymentReceipt | null;
  rejectReceipt(receiptId: string, reason: string, verifiedBy?: string): Promise<PaymentReceipt | null> | PaymentReceipt | null;
  verifyReceiptChecksum(receipt: PaymentReceipt): boolean;
  subscribe(listener: (receipts: PaymentReceipt[]) => void): () => void;
  clearMemory?(): void;
}

/**
 * Dynamic Repository Registry enabling zero-hardcoding runtime swap
 * between Local Mock Storage and Remote Supabase PostgREST clients.
 */
class RepositoryRegistry {
  private courseRepo: ICourseRepository | null = null;
  private receiptRepo: IReceiptRepository | null = null;

  public registerCourseRepository(repo: ICourseRepository): void {
    this.courseRepo = repo;
  }

  public getCourseRepository(): ICourseRepository {
    if (!this.courseRepo) {
      throw new Error('CourseRepository has not been registered in RepositoryRegistry');
    }
    return this.courseRepo;
  }

  public registerReceiptRepository(repo: IReceiptRepository): void {
    this.receiptRepo = repo;
  }

  public getReceiptRepository(): IReceiptRepository {
    if (!this.receiptRepo) {
      throw new Error('ReceiptRepository has not been registered in RepositoryRegistry');
    }
    return this.receiptRepo;
  }
}

export const repositoryRegistry = new RepositoryRegistry();
