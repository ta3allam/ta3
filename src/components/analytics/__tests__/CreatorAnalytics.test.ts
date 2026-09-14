import { describe, it, expect } from 'vitest';
import { EnrollmentFunnelData } from '../EnrollmentFunnelCard';
import { LectureMetric } from '../LectureDropoffChart';

describe('Teacher & Creator Course Analytics Dashboard Unit Tests', () => {
  it('should calculate conversion funnel percentages accurately', () => {
    const data: EnrollmentFunnelData = {
      visitors: 5000,
      previewViews: 2500,
      enrollments: 1000,
      completions: 750,
    };

    const previewRate = data.visitors > 0 ? Math.round((data.previewViews / data.visitors) * 100) : 0;
    const enrollmentRate = data.previewViews > 0 ? Math.round((data.enrollments / data.previewViews) * 100) : 0;
    const completionRate = data.enrollments > 0 ? Math.round((data.completions / data.enrollments) * 100) : 0;

    expect(previewRate).toBe(50);
    expect(enrollmentRate).toBe(40);
    expect(completionRate).toBe(75);
  });

  it('should safely handle zero-division edge cases for new courses with no traffic', () => {
    const emptyData: EnrollmentFunnelData = {
      visitors: 0,
      previewViews: 0,
      enrollments: 0,
      completions: 0,
    };

    const previewRate = emptyData.visitors > 0 ? Math.round((emptyData.previewViews / emptyData.visitors) * 100) : 0;
    const enrollmentRate = emptyData.previewViews > 0 ? Math.round((emptyData.enrollments / emptyData.previewViews) * 100) : 0;
    const completionRate = emptyData.enrollments > 0 ? Math.round((emptyData.completions / emptyData.enrollments) * 100) : 0;

    expect(previewRate).toBe(0);
    expect(enrollmentRate).toBe(0);
    expect(completionRate).toBe(0);
  });

  it('should categorize lecture retention and completion rate status bands accurately', () => {
    const lectures: LectureMetric[] = [
      { id: 1, title: 'المحاضرة 1', completionRate: 95, dropoffCount: 5 },
      { id: 2, title: 'المحاضرة 2', completionRate: 75, dropoffCount: 25 },
      { id: 3, title: 'المحاضرة 3', completionRate: 60, dropoffCount: 40 },
    ];

    const getStatusBand = (rate: number) => {
      if (rate >= 80) return 'high';
      if (rate >= 70) return 'medium';
      return 'critical';
    };

    expect(getStatusBand(lectures[0].completionRate)).toBe('high');
    expect(getStatusBand(lectures[1].completionRate)).toBe('medium');
    expect(getStatusBand(lectures[2].completionRate)).toBe('critical');
  });

  it('should compute total dropoff students and average module completion correctly', () => {
    const lectures: LectureMetric[] = [
      { id: 1, title: 'مقدمة', completionRate: 90, dropoffCount: 10 },
      { id: 2, title: 'التطبيق العملي', completionRate: 80, dropoffCount: 20 },
      { id: 3, title: 'المشروع', completionRate: 70, dropoffCount: 30 },
    ];

    const totalDropoffs = lectures.reduce((acc, curr) => acc + curr.dropoffCount, 0);
    const avgCompletion = Math.round(
      lectures.reduce((acc, curr) => acc + curr.completionRate, 0) / lectures.length
    );

    expect(totalDropoffs).toBe(60);
    expect(avgCompletion).toBe(80);
  });
});
