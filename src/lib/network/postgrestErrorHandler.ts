export interface PostgrestErrorPayload {
  code?: string;
  message: string;
  details?: string | null;
  hint?: string | null;
  status?: number;
}

export type PostgrestActionClassification =
  | 'REAUTH_REQUIRED'
  | 'PERMISSION_DENIED'
  | 'CONCURRENCY_CONFLICT'
  | 'RATE_LIMITED'
  | 'OFFLINE_FALLBACK'
  | 'SERVER_ERROR'
  | 'UNKNOWN_ERROR';

export interface HandledPostgrestResponse {
  action: PostgrestActionClassification;
  statusCode: number;
  userMessageAr: string;
  retryable: boolean;
  offlineFallbackAvailable: boolean;
  originalError: unknown;
}

/**
 * Enterprise PostgREST & Network Resilience Error Boundary Handler.
 * Classifies HTTP PostgREST status codes (401, 403, 409, 429, 500) and dropped connections (3G / offline).
 */
export class PostgrestErrorHandler {
  public static handle(error: unknown): HandledPostgrestResponse {
    // 1. Detect dropped connection / network failure
    if (this.isNetworkOrOfflineError(error)) {
      return {
        action: 'OFFLINE_FALLBACK',
        statusCode: 0,
        userMessageAr: 'انقطع الاتصال بالشبكة. تم تفعيل وضع عدم الاتصال وتخزين العمليات محلياً.',
        retryable: true,
        offlineFallbackAvailable: true,
        originalError: error,
      };
    }

    const payload = error as PostgrestErrorPayload;
    const status = payload.status || 500;

    // 2. Classify HTTP status codes
    switch (status) {
      case 401:
        return {
          action: 'REAUTH_REQUIRED',
          statusCode: 401,
          userMessageAr: 'انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى للمتابعة.',
          retryable: false,
          offlineFallbackAvailable: false,
          originalError: error,
        };

      case 403:
        return {
          action: 'PERMISSION_DENIED',
          statusCode: 403,
          userMessageAr: 'ليس لديك الصلاحيات الكافية لتنفيذ هذا الإجراء (انتهاك سياسة أمان RLS).',
          retryable: false,
          offlineFallbackAvailable: false,
          originalError: error,
        };

      case 409:
        return {
          action: 'CONCURRENCY_CONFLICT',
          statusCode: 409,
          userMessageAr: 'حدث تعارض في البيانات (تعديل متزامن). يرجى تحديث الصفحة والمحاولة مجدداً.',
          retryable: true,
          offlineFallbackAvailable: false,
          originalError: error,
        };

      case 429:
        return {
          action: 'RATE_LIMITED',
          statusCode: 429,
          userMessageAr: 'تم تجاوز الحد الأقصى للطلبات المسموح بها. يرجى الانتظار قليلاً قبل إعادة المحاولة.',
          retryable: true,
          offlineFallbackAvailable: false,
          originalError: error,
        };

      case 500:
      case 502:
      case 503:
      case 504:
        return {
          action: 'SERVER_ERROR',
          statusCode: status,
          userMessageAr: 'تعذر الاتصال بخدمة قواعد البيانات. يجري العمل على حل المشكلة.',
          retryable: true,
          offlineFallbackAvailable: true,
          originalError: error,
        };

      default:
        return {
          action: 'UNKNOWN_ERROR',
          statusCode: status,
          userMessageAr: payload.message || 'حدث خطأ غير متوقع أثناء معالجة الطلب.',
          retryable: false,
          offlineFallbackAvailable: false,
          originalError: error,
        };
    }
  }

  private static isNetworkOrOfflineError(error: unknown): boolean {
    if (!error) return false;

    // Check window or global navigator for online status
    const nav = typeof window !== 'undefined' ? window.navigator : (typeof navigator !== 'undefined' ? navigator : null);
    if (nav && nav.onLine === false) {
      return true;
    }

    if (error instanceof Error) {
      const msg = error.message.toLowerCase();
      if (
        msg.includes('failed to fetch') ||
        msg.includes('networkerror') ||
        msg.includes('timeout') ||
        msg.includes('connection refused') ||
        error.name === 'AbortError'
      ) {
        return true;
      }
    }

    return false;
  }
}
