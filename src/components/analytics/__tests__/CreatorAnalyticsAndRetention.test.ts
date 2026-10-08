import { describe, it, expect } from "vitest";
import {
  calculate8515Split,
  getWeeklyRetentionMatrix,
  generateWeeklyHeatmap,
  generateAnalyticsCsvString,
  generateAnalyticsJsonExport,
  MOCK_FINANCIAL_SUMMARY,
  MOCK_RETENTION_COHORTS,
  MOCK_MODULE_FUNNEL,
} from "@/lib/analytics/creatorMetricsEngine";

describe("Creator Analytics & Retention Engine (Day 7)", () => {
  describe("85/15 Revenue Split Calculations", () => {
    it("should calculate exact 85% creator net and 15% platform fee for standard GMV", () => {
      const split1000 = calculate8515Split(1000);
      expect(split1000.gmv).toBe(1000);
      expect(split1000.creatorNet).toBe(850);
      expect(split1000.platformFee).toBe(150);
      expect(split1000.creatorNet + split1000.platformFee).toBe(1000);
    });

    it("should handle rounding properly with decimal GMVs", () => {
      const split = calculate8515Split(149.99);
      expect(split.gmv).toBe(149.99);
      expect(split.creatorNet).toBe(127.49);
      expect(split.platformFee).toBe(22.5);
      expect(Math.round((split.creatorNet + split.platformFee) * 100) / 100).toBe(149.99);
    });

    it("should return zero values for zero GMV", () => {
      const zeroSplit = calculate8515Split(0);
      expect(zeroSplit.gmv).toBe(0);
      expect(zeroSplit.creatorNet).toBe(0);
      expect(zeroSplit.platformFee).toBe(0);
    });

    it("should maintain 100% total sum for Levant payment channels in mock summary", () => {
      const totalGatewayPercent = MOCK_FINANCIAL_SUMMARY.gatewaysBreakdown.reduce(
        (sum, g) => sum + g.percentage,
        0
      );
      expect(totalGatewayPercent).toBe(100);
    });
  });

  describe("Cohort Retention & Weekly Heatmap Matrices", () => {
    it("should generate retention matrix with monotonically non-increasing or realistic drop-off", () => {
      const matrix = getWeeklyRetentionMatrix(MOCK_RETENTION_COHORTS);
      expect(matrix.length).toBe(MOCK_RETENTION_COHORTS.length);

      matrix.forEach((cohort) => {
        expect(cohort.size).toBeGreaterThan(0);
        expect(cohort.week1).toBe(100); // Week 1 is always 100% registration baseline
        expect(cohort.week2).toBeLessThanOrEqual(100);
        expect(cohort.week8).toBeGreaterThanOrEqual(0);
      });
    });

    it("should generate 168 activity slots (7 days x 24 hours) with peak hours", () => {
      const heatmap = generateWeeklyHeatmap();
      expect(heatmap.length).toBe(7 * 24);

      const invalidIntensity = heatmap.find(
        (cell) => cell.intensity < 0 || cell.intensity > 1
      );
      expect(invalidIntensity).toBeUndefined();

      // Peak evening hours (19:00 - 22:00) should have higher student counts than early morning (03:00 - 05:00)
      const eveningCell = heatmap.find((c) => c.dayIndex === 0 && c.hour === 20);
      const earlyMorningCell = heatmap.find((c) => c.dayIndex === 0 && c.hour === 4);
      expect(eveningCell?.studentCount).toBeGreaterThan(earlyMorningCell?.studentCount || 0);
    });
  });

  describe("CSV & JSON Report Exporting with Arabic BOM", () => {
    it("should prepend UTF-8 Byte Order Mark (\\uFEFF) to CSV export for Arabic Excel compatibility", () => {
      const csv = generateAnalyticsCsvString(
        MOCK_FINANCIAL_SUMMARY,
        MOCK_RETENTION_COHORTS,
        MOCK_MODULE_FUNNEL
      );

      // Verify the UTF-8 BOM is at index 0
      expect(csv.startsWith("\uFEFF")).toBe(true);

      // Verify key Arabic column headers exist in the CSV output
      expect(csv).toContain("تقرير الأداء المالي واحتفاظ الطلاب");
      expect(csv).toContain("إجمالي المبيعات (GMV)");
      expect(csv).toContain("صافي أرباح صانع المحتوى (85%)");
      expect(csv).toContain("عمولة المنصة التشغيلية (15%)");
      expect(csv).toContain("شام كاش (ShamCash)");
      expect(csv).toContain("سيريتل كاش (Syriatel Cash)");
      expect(csv).toContain("الحوالات المالية المحلية (Hawala)");
    });

    it("should generate valid JSON export matching data schema", () => {
      const jsonString = generateAnalyticsJsonExport(
        MOCK_FINANCIAL_SUMMARY,
        MOCK_RETENTION_COHORTS,
        MOCK_MODULE_FUNNEL
      );

      const parsed = JSON.parse(jsonString);
      expect(parsed).toHaveProperty("platform", "Ta3allam (تعلم)");
      expect(parsed).toHaveProperty("financialSummary");
      expect(parsed.financialSummary.totalRevenue).toBe(MOCK_FINANCIAL_SUMMARY.totalRevenue);
      expect(parsed.financialSummary.creatorNet).toBe(MOCK_FINANCIAL_SUMMARY.creatorNet);
      expect(parsed.retentionCohorts.length).toBe(MOCK_RETENTION_COHORTS.length);
      expect(parsed.moduleMasteryFunnel.length).toBe(MOCK_MODULE_FUNNEL.length);
    });
  });

  describe("Module Mastery & Low-Bandwidth Telemetry", () => {
    it("should compute valid audio-only percentage telemetry across modules", () => {
      MOCK_MODULE_FUNNEL.forEach((mod) => {
        expect(mod.audioOnlyPercentage).toBeGreaterThanOrEqual(0);
        expect(mod.audioOnlyPercentage).toBeLessThanOrEqual(100);
        expect(mod.completionRate).toBeGreaterThanOrEqual(0);
        expect(mod.completionRate).toBeLessThanOrEqual(100);
        expect(mod.avgQuizScore).toBeGreaterThanOrEqual(0);
        expect(mod.avgQuizScore).toBeLessThanOrEqual(100);
      });
    });
  });
});
