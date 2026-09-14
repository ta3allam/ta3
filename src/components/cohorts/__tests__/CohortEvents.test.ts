import { describe, it, expect } from 'vitest';
import {
  calculateEventCountdown,
  checkSeatAvailability,
  formatArabicEventTime
} from '@/lib/cohorts/cohortTime';

describe('Live Cohort Events & Interactive Webinars Engine Unit Tests', () => {
  it('should correctly detect active live stream status when current time is within duration', () => {
    const fixedNow = new Date('2026-09-20T14:30:00Z');
    const startTime = '2026-09-20T14:00:00Z';
    const durationMinutes = 60; // Ends at 15:00:00Z

    const result = calculateEventCountdown(startTime, durationMinutes, fixedNow);

    expect(result.isLiveNow).toBe(true);
    expect(result.hasEnded).toBe(false);
    expect(result.formattedText).toContain('البث مباشر الآن');
  });

  it('should compute remaining days, hours and minutes for upcoming webinars', () => {
    const fixedNow = new Date('2026-09-20T10:00:00Z');
    const startTime = '2026-09-21T14:30:00Z'; // 1 day and 4.5 hours later
    const durationMinutes = 90;

    const result = calculateEventCountdown(startTime, durationMinutes, fixedNow);

    expect(result.isLiveNow).toBe(false);
    expect(result.hasEnded).toBe(false);
    expect(result.days).toBe(1);
    expect(result.hours).toBe(4);
    expect(result.formattedText).toContain('1 يوم و 4 ساعة');
  });

  it('should flag session as ended when current time exceeds duration', () => {
    const fixedNow = new Date('2026-09-20T16:05:00Z');
    const startTime = '2026-09-20T14:00:00Z';
    const durationMinutes = 90; // Ended at 15:30:00Z

    const result = calculateEventCountdown(startTime, durationMinutes, fixedNow);

    expect(result.isLiveNow).toBe(false);
    expect(result.hasEnded).toBe(true);
    expect(result.formattedText).toBe('انتهت الجلسة');
  });

  it('should gracefully handle invalid or unparseable timestamps', () => {
    const result = calculateEventCountdown('invalid-date-format', 60);

    expect(result.hasEnded).toBe(true);
    expect(result.isLiveNow).toBe(false);
    expect(result.formattedText).toBe('تاريخ غير صالح');
  });

  it('should calculate seat availability, capacity limits and fill percentage correctly', () => {
    // Normal available
    const available = checkSeatAvailability(100, 75);
    expect(available.isFull).toBe(false);
    expect(available.remainingSeats).toBe(25);
    expect(available.percentageFilled).toBe(75);

    // Completely full
    const full = checkSeatAvailability(50, 50);
    expect(full.isFull).toBe(true);
    expect(full.remainingSeats).toBe(0);
    expect(full.percentageFilled).toBe(100);

    // Over-enrolled edge case guard
    const overCapacity = checkSeatAvailability(50, 60);
    expect(overCapacity.isFull).toBe(true);
    expect(overCapacity.remainingSeats).toBe(0);
    expect(overCapacity.percentageFilled).toBe(100);
  });

  it('should format Arabic date with designated regional Levant/GCC timezone', () => {
    const isoDate = '2026-09-25T17:00:00Z';
    const formatted = formatArabicEventTime(isoDate, 'بتوقيت دمشق / الرياض');

    expect(typeof formatted).toBe('string');
    expect(formatted).toContain('بتوقيت دمشق / الرياض');
  });
});
