export interface RevenueSplitResult {
  grossVolume: number;
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
  intensity: number; // 0 to 4 (0: None, 1: Low, 2: Mid, 3: High, 4: Peak)
  activeCount: number;
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
    creatorNet,
    platformFee,
    pendingPayouts,
    completedPayouts,
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
    const atRisk = Math.round(active * 0.08); // 8% considered at risk of stalling

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
 * Generates 7x6 weekly heatmap matrix (7 days, 6 time slots)
 */
export function generateWeeklyActivityHeatmap(): HeatmapCell[] {
  const cells: HeatmapCell[] = [];
  const days = [0, 1, 2, 3, 4, 5, 6];
  const slots = [0, 4, 8, 12, 16, 20]; // 4-hour windows

  days.forEach((day) => {
    slots.forEach((hour) => {
      // Peak hours in MENA: 6 PM - 11 PM (hour 16 and 20), weekend (Fri/Sat)
      let base = 1;
      if (hour >= 16) base += 2;
      if (day === 5 || day === 6) base += 1;
      const intensity = Math.min(4, Math.max(0, base + Math.floor(Math.random() * 2) - 1));
      const activeCount = intensity * 18 + Math.floor(Math.random() * 12);

      cells.push({
        dayIndex: day,
        hourIndex: hour,
        intensity,
        activeCount,
      });
    });
  });

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

  // Prepend UTF-8 BOM for Arabic Excel compatibility
  return `\uFEFF${headerRow}\r\n${rows.join('\r\n')}`;
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
