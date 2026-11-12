import { describe, it, expect, beforeEach } from "vitest";
import { ReceiptStore } from "@/lib/receiptStore";
import { runPlatformDiagnostics } from "@/lib/diagnostics/systemHealthEngine";
import { calculate8515Split } from "@/lib/analytics/creatorMetricsEngine";
import {
  hasComponentPermission,
  assertActionAuthorized,
  AuthorizationError,
} from "@/lib/security/rbacGuard";
import { auditLogger } from "@/lib/security/auditLogger";

describe("E2E Test Suite 1: SuperAdmin Governance, Security Telemetry & Levant Cashflow (Day 8 Golden Suite)", () => {
  beforeEach(() => {
    ReceiptStore.clearMemory();
    auditLogger.clear();
  });

  describe("SuperAdmin Platform Governance & RBAC Guard Defense", () => {
    it("enforces authentic governance capabilities exclusively for SuperAdmin", () => {
      // SuperAdmin must possess complete oversight capabilities
      expect(hasComponentPermission("admin", "receipt:verify")).toBe(true);
      expect(hasComponentPermission("admin", "payout:approve")).toBe(true);
      expect(hasComponentPermission("admin", "user:manage")).toBe(true);
      expect(hasComponentPermission("admin", "community:moderate")).toBe(true);

      // Non-admin roles must be blocked from financial verification and approval
      expect(hasComponentPermission("student", "receipt:verify")).toBe(false);
      expect(hasComponentPermission("teacher", "receipt:verify")).toBe(false);
      expect(hasComponentPermission("creator", "receipt:verify")).toBe(false);

      expect(() => assertActionAuthorized("admin", "receipt:verify")).not.toThrow();
      expect(() => assertActionAuthorized("student", "receipt:verify")).toThrow(AuthorizationError);
      expect(() => assertActionAuthorized("teacher", "payout:approve")).toThrow(AuthorizationError);
    });

    it("records security audit log entries with telemetry context when anomalies occur", () => {
      auditLogger.log(
        "UNAUTHORIZED_ACTION_ATTEMPT",
        "warn",
        { action: "payout:approve", requiredRole: "admin" },
        { userId: "student-101", role: "student", path: "/admin/payouts" }
      );

      const events = auditLogger.getEvents();
      expect(events).toHaveLength(1);
      expect(events[0].type).toBe("UNAUTHORIZED_ACTION_ATTEMPT");
      expect(events[0].severity).toBe("warn");
      expect(events[0].userId).toBe("student-101");
      expect(events[0].path).toBe("/admin/payouts");

      const anomalies = auditLogger.getAnomalies();
      expect(anomalies).toHaveLength(1);
    });

    it("executes platform diagnostic engine verifying all 7 architectural pillars", () => {
      const healthReport = runPlatformDiagnostics();
      expect(healthReport.overallStatus).toBe("healthy");
      expect(healthReport.healthScore).toBe(100);
      expect(healthReport.passedCount).toBe(healthReport.totalChecks);
      expect(healthReport.totalChecks).toBeGreaterThanOrEqual(7);
      expect(healthReport.environment.zeroAiOperationalCost).toBe(true);
      expect(healthReport.environment.version).toBe("v1.0.0");
    });
  });

  describe("Levant Receipt Verification & 85/15 Cashflow Flow", () => {
    it("submits ShamCash receipt, validates cryptographic checksum, and executes approval workflow", () => {
      // 1. Submit ShamCash receipt
      const receipt = ReceiptStore.submitReceipt({
        courseId: 101,
        courseName: "هندسة الأنظمة الموزعة للشركات",
        courseCode: "CS101",
        studentId: "std-99",
        studentName: "باسل الشامي",
        studentEmail: "basel@sham.sy",
        studentPhone: "+963933112233",
        amount: 50,
        currency: "USD",
        paymentMethod: "shamcash",
        transactionReference: "SHAM-2026-9812",
        receiptImageUrl: "https://example.com/receipt-sham.png",
        receiptImageName: "receipt_sham_cash.png",
        senderNameOrPhone: "باسل الشامي / 0933112233",
        studentNotes: "تم التحويل عبر محفظة شام كاش في دمشق",
      });

      expect(receipt.id).toBeDefined();
      expect(receipt.status).toBe("pending_verification");
      expect(receipt.creatorEarnings).toBe(42.5); // 85% of $50
      expect(receipt.platformFee).toBe(7.5); // 15% of $50
      expect(receipt.checksum).toBeDefined();

      // 2. Anti-tamper checksum validation
      const isChecksumValid = ReceiptStore.verifyReceiptChecksum(receipt);
      expect(isChecksumValid).toBe(true);

      // Checksum must fail if receipt payload is tampered
      const tamperedReceipt = { ...receipt, amount: 10 };
      expect(ReceiptStore.verifyReceiptChecksum(tamperedReceipt)).toBe(false);

      // 3. Admin verifies and approves payment
      const approved = ReceiptStore.approveReceipt(receipt.id, "مدير النظام التنفيذي");
      expect(approved).not.toBeNull();
      expect(approved?.status).toBe("approved");
      expect(approved?.verifiedBy).toBe("مدير النظام التنفيذي");
      expect(approved?.verifiedAt).toBeDefined();
    });

    it("calculates exact 85/15 revenue splits across different GMV transaction volumes", () => {
      const split200 = calculate8515Split(200);
      expect(split200.gmv).toBe(200);
      expect(split200.creatorNet).toBe(170); // 85%
      expect(split200.platformFee).toBe(30); // 15%

      const split50 = calculate8515Split(50);
      expect(split50.creatorNet).toBe(42.5);
      expect(split50.platformFee).toBe(7.5);

      const split0 = calculate8515Split(0);
      expect(split0.creatorNet).toBe(0);
      expect(split0.platformFee).toBe(0);
    });

    it("handles receipt rejection with explicit reason and audit tracking", () => {
      const receipt = ReceiptStore.submitReceipt({
        courseId: 102,
        courseName: "الذكاء الاصطناعي التطبيقي",
        courseCode: "AI102",
        studentId: "std-100",
        studentName: "رنا العلي",
        studentEmail: "rana@sham.sy",
        studentPhone: "+963944556677",
        amount: 80,
        currency: "USD",
        paymentMethod: "syriatel_cash",
        transactionReference: "SYR-44512",
        receiptImageUrl: "https://example.com/receipt-blurry.png",
        receiptImageName: "blurry_receipt.png",
        senderNameOrPhone: "0944556677",
        studentNotes: "حوالة سيريتل كاش",
      });

      const rejectionReason = "صورة الإشعار غير واضحة ورقم الحوالة غير مطابق لسجلات المحفظة";
      const rejected = ReceiptStore.rejectReceipt(receipt.id, rejectionReason, "مدير النظام");

      expect(rejected).not.toBeNull();
      expect(rejected?.status).toBe("rejected");
      expect(rejected?.rejectionReason).toBe(rejectionReason);
      expect(rejected?.verifiedBy).toBe("مدير النظام");
      expect(rejected?.verifiedAt).toBeDefined();
    });
  });
});
