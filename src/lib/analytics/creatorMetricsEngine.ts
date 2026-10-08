export interface RevenueSplitResult {
  grossVolume: number;
  gmv?: number;
  creatorNet: number; // 85%
  platformFee: number; // 15%
  pendingPayouts: number;
  completedPayouts: number;
}

export interface PaymentChannelMetric {
  channelId: string;
  name: string;
  percentage: number;
  totalVolume: number;
  transactionsCount: number;
  color: string;
}

export interface CohortRetentionWeek {
  weekNumber: number;
  label: string;
  activeStudents: number;
  retentionRate: number; // 0 - 100%
  dropoffCount: number;
  atRiskCount: number;
}

export interface HeatmapCell {
  dayIndex: number; // 0 (Sun) to 6 (Sat)
  hourIndex: number; // 0 to 23
  hour?: number;
  intensity: number; // 0 to 4 (0: None, 1: Low, 2: Mid, 3: High, 4: Peak)
  activeCount: number;
  studentCount?: number;
}

export interface RetentionCohortRow {
  cohortName: string;
  size: number;
  week1: number;
  week2: number;
  week3: number;
  week4: number;
  week5: number;
  week6: number;
  week7: number;
  week8: number;
}

export interface ModuleMasteryMetric {
  moduleId: string;
  title: string;
  totalEnrolled: number;
  completedCount: number;
  completionRate: number;
  avgQuizScore: number;
  audioOnlyPercentage: number;
  avgWatchTimeMinutes: number;
}

/**
 * Calculates authentic 85% creator payout / 15% platform split
 */
export function calculateRevenueSplit(
  grossVolume: number,
  platformFeePercent: number = 15,
  pendingRate: number = 0.15
): RevenueSplitResult {
  const safeGross = Math.max(0, grossVolume);
  const platformFee = Math.round((safeGross * (platformFeePercent / 100)) * 100) / 100;
  const creatorNet = Math.round((safeGross - platformFee) * 100) / 100;
  const pendingPayouts = Math.round((creatorNet * pendingRate) * 100) / 100;
  const completedPayouts = Math.round((creatorNet - pendingPayouts) * 100) / 100;

  return {
    grossVolume: safeGross,
    gmv: safeGross,
    creatorNet,
    platformFee,
    pendingPayouts,
    completedPayouts,
  };
}

/**
 * Convenience alias for strict 85/15 revenue split calculation
 */
export function calculate8515Split(gmv: number) {
  const res = calculateRevenueSplit(gmv, 15, 0.15);
  return {
    gmv: res.grossVolume,
    creatorNet: res.creatorNet,
    platformFee: res.platformFee,
  };
}

/**
 * Generates regional payment channel distribution metrics
 */
export function getRegionalPaymentChannelMetrics(grossVolume: number): PaymentChannelMetric[] {
  return [
    {
      channelId: 'sham_cash',
      name: 'سيرياتيل كاش / شام كاش (Syria)',
      percentage: 42,
      totalVolume: Math.round(grossVolume * 0.42),
      transactionsCount: 148,
      color: '#428177',
    },
    {
      channelId: 'hawala_alharam',
      name: 'حوالة الهرم والفؤاد (Levant)',
      percentage: 26,
      totalVolume: Math.round(grossVolume * 0.26),
      transactionsCount: 84,
      color: '#6B1F2A',
    },
    {
      channelId: 'usdt_trc20',
      name: 'USDT (TRC-20 Crypto)',
      percentage: 16,
      totalVolume: Math.round(grossVolume * 0.16),
      transactionsCount: 42,
      color: '#054239',
    },
    {
      channelId: 'zain_cash',
      name: 'زين كاش (Iraq / Jordan)',
      percentage: 10,
      totalVolume: Math.round(grossVolume * 0.10),
      transactionsCount: 30,
      color: '#988561',
    },
    {
      channelId: 'cards_wise',
      name: 'بطاقات دولية / Wise (GCC & Global)',
      percentage: 6,
      totalVolume: Math.round(grossVolume * 0.06),
      transactionsCount: 18,
      color: '#B9A779',
    },
  ];
}

/**
 * Calculates 8-week cohort retention drop-off progression
 */
export function calculateCohortRetentionData(initialCohortSize: number = 100): CohortRetentionWeek[] {
  const retentionRates = [100, 88, 79, 72, 67, 63, 60, 58];
  
  return retentionRates.map((rate, idx) => {
    const active = Math.round((initialCohortSize * rate) / 100);
    const prevActive = idx === 0 ? initialCohortSize : Math.round((initialCohortSize * retentionRates[idx - 1]) / 100);
    const dropoff = Math.max(0, prevActive - active);
    const atRisk = Math.round(active * 0.08);

    return {
      weekNumber: idx + 1,
      label: `الأسبوع ${idx + 1}`,
      activeStudents: active,
      retentionRate: rate,
      dropoffCount: dropoff,
      atRiskCount: atRisk,
    };
  });
}

/**
 * Returns weekly retention matrix across multiple cohorts
 */
export function getWeeklyRetentionMatrix(cohorts: RetentionCohortRow[]): RetentionCohortRow[] {
  return cohorts.map((c) => ({
    ...c,
    week1: Math.min(100, Math.max(0, c.week1)),
    week2: Math.min(100, Math.max(0, c.week2)),
    week3: Math.min(100, Math.max(0, c.week3)),
    week4: Math.min(100, Math.max(0, c.week4)),
    week5: Math.min(100, Math.max(0, c.week5)),
    week6: Math.min(100, Math.max(0, c.week6)),
    week7: Math.min(100, Math.max(0, c.week7)),
    week8: Math.min(100, Math.max(0, c.week8)),
  }));
}

/**
 * Generates 7x6 weekly heatmap matrix
 */
export function generateWeeklyActivityHeatmap(): HeatmapCell[] {
  const cells: HeatmapCell[] = [];
  const days = [0, 1, 2, 3, 4, 5, 6];
  const slots = [0, 4, 8, 12, 16, 20];

  days.forEach((day) => {
    slots.forEach((hour) => {
      let base = 1;
      if (hour >= 16) base += 2;
      if (day === 5 || day === 6) base += 1;
      const intensity = Math.min(4, Math.max(0, base + Math.floor(Math.random() * 2) - 1));
      const activeCount = intensity * 18 + Math.floor(Math.random() * 12);

      cells.push({
        dayIndex: day,
        hourIndex: hour,
        hour,
        intensity,
        activeCount,
        studentCount: activeCount,
      });
    });
  });

  return cells;
}

/**
 * Generates 24-hour x 7-day normalized heatmap
 */
export function generateWeeklyHeatmap(): { dayIndex: number; hour: number; intensity: number; studentCount: number }[] {
  const cells = [];
  for (let d = 0; d < 7; d++) {
    for (let h = 0; h < 24; h++) {
      let baseCount = 5;
      if (h >= 18 && h <= 23) baseCount = 45; // peak evening
      else if (h >= 12 && h < 18) baseCount = 25; // afternoon
      else if (h >= 0 && h < 6) baseCount = 2; // early morning
      else baseCount = 15; // morning

      const count = baseCount + (d === 5 ? 10 : 0);
      const intensity = Math.min(1, Math.max(0, count / 60));

      cells.push({
        dayIndex: d,
        hour: h,
        intensity,
        studentCount: count,
      });
    }
  }
  return cells;
}

/**
 * Converts array of records to downloadable CSV string with UTF-8 BOM for Arabic Excel support
 */
export function exportToCsv(
  data: Record<string, any>[],
  headers: { key: string; label: string }[]
): string {
  if (!data || !data.length) return '';

  const headerRow = headers.map(h => `"${h.label.replace(/"/g, '""')}"`).join(',');
  const rows = data.map(item =>
    headers
      .map(h => {
        const val = item[h.key] !== undefined && item[h.key] !== null ? String(item[h.key]) : '';
        return `"${val.replace(/"/g, '""')}"`;
      })
      .join(',')
  );

  return `\uFEFF${headerRow}\r\n${rows.join('\r\n')}`;
}

/**
 * Generates comprehensive CSV string report for financial, cohort retention, and module telemetry
 */
export function generateAnalyticsCsvString(
  financial: typeof MOCK_FINANCIAL_SUMMARY,
  retention: RetentionCohortRow[],
  modules: ModuleMasteryMetric[]
): string {
  const lines: string[] = [];

  // Title Section
  lines.push(`"تقرير الأداء المالي واحتفاظ الطلاب - منصة تعلم (Ta3allam)"`);
  lines.push(`"تاريخ التقرير:","${new Date().toISOString().split('T')[0]}"`);
  lines.push(``);

  // Financial Section
  lines.push(`"--- الملخص المالي وتوزيع الأرباح (85% لصانع المحتوى / 15% للمنصة) ---"`);
  lines.push(`"المؤشر","القيمة بالدولار ($)"`);
  lines.push(`"إجمالي المبيعات (GMV)","${financial.totalRevenue}"`);
  lines.push(`"صافي أرباح صانع المحتوى (85%)","${financial.creatorNet}"`);
  lines.push(`"عمولة المنصة التشغيلية (15%)","${financial.platformFee}"`);
  lines.push(`"المستحقات المعلقة للتحويل","${financial.pendingPayouts}"`);
  lines.push(`"المبالغ المحولة بنجاح","${financial.completedPayouts}"`);
  lines.push(``);

  // Payment Channels Section
  lines.push(`"--- توزيع قنوات الدفع الإقليمية في بلاد الشام ---"`);
  lines.push(`"القناة","النسبة (%)","الحجم المالي ($)","العمليات"`);
  financial.gatewaysBreakdown.forEach(g => {
    lines.push(`"${g.name}","${g.percentage}%","${g.totalVolume}","${g.transactionsCount}"`);
  });
  lines.push(``);

  // Retention Cohorts Section
  lines.push(`"--- مصفوفة احتفاظ أفواج الطلاب (Cohort Retention) ---"`);
  lines.push(`"الفوج","العدد","الأسبوع 1","الأسبوع 2","الأسبوع 3","الأسبوع 4","الأسبوع 5","الأسبوع 6","الأسبوع 7","الأسبوع 8"`);
  retention.forEach(r => {
    lines.push(`"${r.cohortName}","${r.size}","${r.week1}%","${r.week2}%","${r.week3}%","${r.week4}%","${r.week5}%","${r.week6}%","${r.week7}%","${r.week8}%"`);
  });
  lines.push(``);

  // Module Mastery Section
  lines.push(`"--- مسار إتقان الوحدات ونمط الصوت فقط (3G Audio-Only) ---"`);
  lines.push(`"الوحدة التعليمية","المسجلين","معدل الإكمال","متوسط درجات الاختبار","نسبة استهلاك الصوت فقط (3G)"`);
  modules.forEach(m => {
    lines.push(`"${m.title}","${m.totalEnrolled}","${m.completionRate}%","${m.avgQuizScore}%","${m.audioOnlyPercentage}%"`);
  });

  return `\uFEFF${lines.join('\r\n')}`;
}

/**
 * Generates formatted JSON export
 */
export function generateAnalyticsJsonExport(
  financial: typeof MOCK_FINANCIAL_SUMMARY,
  retention: RetentionCohortRow[],
  modules: ModuleMasteryMetric[]
): string {
  return JSON.stringify(
    {
      platform: "Ta3allam (تعلم)",
      exportedAt: new Date().toISOString(),
      financialSummary: financial,
      retentionCohorts: retention,
      moduleMasteryFunnel: modules,
    },
    null,
    2
  );
}

/**
 * Initiates browser download of generated data file
 */
export function triggerFileDownload(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Mock Datasets for Testing & UI Display
export const MOCK_FINANCIAL_SUMMARY = {
  totalRevenue: 5400,
  creatorNet: 4590, // 85%
  platformFee: 810, // 15%
  pendingPayouts: 680,
  completedPayouts: 3910,
  totalOrders: 142,
  gatewaysBreakdown: [
    { channelId: 'sham_cash', name: 'شام كاش (ShamCash)', percentage: 42, totalVolume: 2268, transactionsCount: 68, color: '#428177' },
    { channelId: 'syriatel_cash', name: 'سيريتل كاش (Syriatel Cash)', percentage: 26, totalVolume: 1404, transactionsCount: 39, color: '#6B1F2A' },
    { channelId: 'hawala', name: 'الحوالات المالية المحلية (Hawala)', percentage: 16, totalVolume: 864, transactionsCount: 22, color: '#988561' },
    { channelId: 'zain_cash', name: 'زين كاش (ZainCash)', percentage: 10, totalVolume: 540, transactionsCount: 13, color: '#054239' },
    { channelId: 'usdt', name: 'العملات الرقمية (USDT TRC-20)', percentage: 6, totalVolume: 324, transactionsCount: 8, color: '#B9A779' },
  ],
};

export const MOCK_RETENTION_COHORTS: RetentionCohortRow[] = [
  { cohortName: "فوج يناير 2026", size: 120, week1: 100, week2: 88, week3: 79, week4: 72, week5: 67, week6: 63, week7: 60, week8: 58 },
  { cohortName: "فوج فبراير 2026", size: 145, week1: 100, week2: 91, week3: 84, week4: 78, week5: 74, week6: 70, week7: 68, week8: 65 },
  { cohortName: "فوج مارس 2026", size: 160, week1: 100, week2: 94, week3: 87, week4: 82, week5: 79, week6: 75, week7: 72, week8: 70 },
  { cohortName: "فوج أبريل 2026", size: 185, week1: 100, week2: 96, week3: 90, week4: 85, week5: 82, week6: 80, week7: 77, week8: 75 },
];

export const MOCK_MODULE_FUNNEL: ModuleMasteryMetric[] = [
  { moduleId: "mod-1", title: "مقدمة وتأسيس البيئة البرمجية", totalEnrolled: 185, completedCount: 180, completionRate: 97.3, avgQuizScore: 92.5, audioOnlyPercentage: 28.4, avgWatchTimeMinutes: 45 },
  { moduleId: "mod-2", title: "هندسة الأنظمة والخدمات المصغرة", totalEnrolled: 180, completedCount: 162, completionRate: 90.0, avgQuizScore: 88.0, audioOnlyPercentage: 36.2, avgWatchTimeMinutes: 72 },
  { moduleId: "mod-3", title: "قواعد البيانات الموزعة و RLS", totalEnrolled: 162, completedCount: 141, completionRate: 87.0, avgQuizScore: 84.5, audioOnlyPercentage: 42.0, avgWatchTimeMinutes: 90 },
  { moduleId: "mod-4", title: "الأمان وإدارة المفاتيح التشفيرية", totalEnrolled: 141, completedCount: 118, completionRate: 83.7, avgQuizScore: 81.2, audioOnlyPercentage: 48.5, avgWatchTimeMinutes: 65 },
  { moduleId: "mod-5", title: "المشروع التخرجي والإنتاج الحي", totalEnrolled: 118, completedCount: 96, completionRate: 81.3, avgQuizScore: 91.0, audioOnlyPercentage: 52.3, avgWatchTimeMinutes: 120 },
];
