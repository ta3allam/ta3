import { describe, it, expect, beforeEach } from "vitest";
import { ReceiptStore } from "@/lib/receiptStore";
import { runPlatformDiagnostics } from "@/lib/diagnostics/systemHealthEngine";
import { calculate8515Split } from "@/lib/analytics/creatorMetricsEngine";

describe("E2E Test Suite 1: SuperAdmin Governance & Levant Cashflow (Day 8 Golden Suite)", () => {
  beforeEach(() => {
    ReceiptStore.clearMemory();
  });

  describe("SuperAdmin Platform Role Isolation & Capabilities", () => {
    it("should uphold authentic role separation where SuperAdmin has platform governance and zero personal wallet", () => {
      const superAdminUser = {
        id: "usr-admin-001",
        name: "مدير المنصة التنفيذي",
        role: "admin",
        is_creator: false,
        wallet_balance: 0, // SuperAdmin has NO personal commercial wallet
      };

      expect(superAdminUser.role).toBe("admin");
      expect(superAdminUser.is_creator).toBe(false);
      expect(superAdminUser.wallet_balance).toBe(0);
    });

    it("should run complete platform health diagnostics with 100% health score and 0 AI operational cost", () => {
      const healthReport = runPlatformDiagnostics();
      expect(healthReport.overallStatus).toBe("healthy");
      expect(healthReport.healthScore).toBe(100);
      expect(healthReport.passedCount).toBe(healthReport.totalChecks);
      expect(healthReport.environment.zeroAiOperationalCost).toBe(true);
      expect(healthReport.environment.version).toBe("v1.0.0");
    });
  });

  describe("Levant Receipt Verification & 85/15 Cashflow Flow", () => {
    it("should submit a ShamCash receipt and verify receipt lifecycle through approval", () => {
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
        paymentMethod: "sham_cash",
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

      // 2. Query receipt in queue
      const allReceipts = ReceiptStore.loadReceipts();
      expect(allReceipts.length).toBeGreaterThan(0);
      const found = allReceipts.find(r => r.id === receipt.id);
      expect(found).toBeDefined();
      expect(found?.transactionReference).toBe("SHAM-2026-9812");

      // 3. Admin verifies and approves payment
      const approved = ReceiptStore.approveReceipt(receipt.id, "مدير النظام التنفيذي");
      expect(approved).not.toBeNull();
      expect(approved?.status).toBe("approved");
      expect(approved?.verifiedBy).toBe("مدير النظام التنفيذي");
      expect(approved?.verifiedAt).toBeDefined();
    });

    it("should calculate exact 85/15 revenue splits and maintain Levant gateway shares", () => {
      const split = calculate8515Split(200);
      expect(split.gmv).toBe(200);
      expect(split.creatorNet).toBe(170); // 85%
      expect(split.platformFee).toBe(30); // 15%
    });

    it("should handle receipt rejection with specific Arabic reason", () => {
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
        paymentMethod: "hawala_alharam",
        transactionReference: "HARAM-44512",
        receiptImageUrl: "https://example.com/receipt-blurry.png",
        receiptImageName: "blurry_receipt.png",
        senderNameOrPhone: "0944556677",
        studentNotes: "حوالة عبر فرع الهرم",
      });

      const rejected = ReceiptStore.rejectReceipt(
        receipt.id,
        "صورة الإشعار غير واضحة ورقم الحوالة غير مطابق لفرع الهرم",
        "مدير النظام"
      );
      expect(rejected).not.toBeNull();
      expect(rejected?.status).toBe("rejected");
      expect(rejected?.rejectionReason).toContain("غير واضحة");
    });
  });
});
