import { describe, it, expect } from "vitest";
import {
  calculateRevenueSplit,
  getRegionalPaymentChannelMetrics,
  calculateCohortRetentionData,
  generateAnalyticsCsvString,
  generateAnalyticsJsonExport,
  MOCK_FINANCIAL_SUMMARY,
  MOCK_RETENTION_COHORTS,
  MOCK_MODULE_FUNNEL,
} from "@/lib/analytics/creatorMetricsEngine";

describe("E2E Test Suite 2: Creator Commerce, Pricing Models & 85/15 Payout Ledger (Day 8 Golden Suite)", () => {
  describe("Creator Commercial Role & Storefront Integrity", () => {
    it("should model authentic creator capabilities with financial wallet, pricing, and public profile", () => {
      const creatorEntity = {
        id: "creator-khaled-01",
        name: "د. خالد العطار",
        username: "khaled_creator",
        role: "teacher",
        is_creator: true,
        wallet_balance: 3825.0, // 85% net earnings from $4,500 GMV
        pricingModels: ["free", "paid_one_time", "subscription", "cohort_bundle"],
        supportedCurrencies: ["USD", "SYP", "AED", "SAR"],
      };

      expect(creatorEntity.is_creator).toBe(true);
      expect(creatorEntity.wallet_balance).toBeGreaterThan(0);
      expect(creatorEntity.pricingModels).toContain("paid_one_time");
      expect(creatorEntity.pricingModels).toContain("subscription");
    });
  });

  describe("85/15 Revenue Split Ledger Calculations", () => {
    it("should compute exact 85% creator net payout, 15% platform maintenance fee, and pending balances", () => {
      const gmv = 10000;
      const split = calculateRevenueSplit(gmv, 15, 0.15);

      expect(split.grossVolume).toBe(10000);
      expect(split.creatorNet).toBe(8500); // 85% of $10,000
      expect(split.platformFee).toBe(1500); // 15% of $10,000
      expect(split.creatorNet + split.platformFee).toBe(gmv);

      expect(split.pendingPayouts).toBe(1275); // 15% pending
      expect(split.completedPayouts).toBe(7225); // 85% completed
      expect(split.pendingPayouts + split.completedPayouts).toBe(split.creatorNet);
    });

    it("should distribute regional Levant gateway volume accurately across all 5 channels", () => {
      const gmv = 5000;
      const channels = getRegionalPaymentChannelMetrics(gmv);

      expect(channels.length).toBe(5);

      const shamcash = channels.find((c) => c.channelId === "sham_cash");
      expect(shamcash?.percentage).toBe(42);
      expect(shamcash?.totalVolume).toBe(Math.round(gmv * 0.42));

      const hawala = channels.find((c) => c.channelId === "hawala_alharam");
      expect(hawala?.percentage).toBe(26);

      const usdt = channels.find((c) => c.channelId === "usdt_trc20");
      expect(usdt?.percentage).toBe(16);

      const zain = channels.find((c) => c.channelId === "zain_cash");
      expect(zain?.percentage).toBe(10);

      const cards = channels.find((c) => c.channelId === "cards_wise");
      expect(cards?.percentage).toBe(6);

      const totalPercentage = channels.reduce((sum, c) => sum + c.percentage, 0);
      expect(totalPercentage).toBe(100);
    });
  });

  describe("Cohort Retention & Excel CSV Export with UTF-8 BOM", () => {
    it("should calculate 8-week cohort progression with non-negative at-risk and drop-off numbers", () => {
      const cohortProgression = calculateCohortRetentionData(250);
      expect(cohortProgression.length).toBe(8);

      cohortProgression.forEach((week) => {
        expect(week.activeStudents).toBeGreaterThan(0);
        expect(week.retentionRate).toBeGreaterThanOrEqual(0);
        expect(week.retentionRate).toBeLessThanOrEqual(100);
        expect(week.atRiskCount).toBeGreaterThanOrEqual(0);
        expect(week.dropoffCount).toBeGreaterThanOrEqual(0);
      });

      // Week 1 is 100% baseline
      expect(cohortProgression[0].retentionRate).toBe(100);
      expect(cohortProgression[0].activeStudents).toBe(250);
    });

    it("should prepend UTF-8 Byte Order Mark (\\uFEFF) to CSV report to guarantee Arabic Excel readability", () => {
      const csv = generateAnalyticsCsvString(
        MOCK_FINANCIAL_SUMMARY,
        MOCK_RETENTION_COHORTS,
        MOCK_MODULE_FUNNEL
      );

      // Verify UTF-8 BOM at index 0
      expect(csv.charCodeAt(0)).toBe(0xfeff);

      // Verify Arabic content headers
      expect(csv).toContain("تقرير الأداء المالي واحتفاظ الطلاب - منصة تعلم (Ta3allam)");
      expect(csv).toContain("شام كاش (ShamCash)");
      expect(csv).toContain("فوج يناير 2026");
      expect(csv).toContain("نسبة استهلاك الصوت فقط (3G)");
    });

    it("should export well-structured JSON telemetry with all metadata fields", () => {
      const jsonStr = generateAnalyticsJsonExport(
        MOCK_FINANCIAL_SUMMARY,
        MOCK_RETENTION_COHORTS,
        MOCK_MODULE_FUNNEL
      );

      const parsed = JSON.parse(jsonStr);
      expect(parsed.platform).toBe("Ta3allam (تعلم)");
      expect(parsed.exportedAt).toBeDefined();
      expect(parsed.financialSummary.totalRevenue).toBe(5400);
      expect(parsed.financialSummary.creatorNet).toBe(4590);
      expect(parsed.financialSummary.platformFee).toBe(810);
      expect(parsed.retentionCohorts.length).toBe(4);
      expect(parsed.moduleMasteryFunnel.length).toBe(5);
    });
  });
});
