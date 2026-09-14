export type EventStatus = 'upcoming' | 'live' | 'ended';

export interface CohortEvent {
  id: string | number;
  title: string;
  description: string;
  instructorName: string;
  instructorAvatar?: string;
  startTime: string; // ISO string e.g. 2026-09-20T17:00:00Z
  durationMinutes: number;
  capacity: number;
  enrolledCount: number;
  streamUrl?: string;
  recordingUrl?: string;
  category: 'workshop' | 'office_hours' | 'masterclass' | 'qa';
  timezone: string;
}

export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isLiveNow: boolean;
  hasEnded: boolean;
  formattedText: string;
}

/**
 * Calculates countdown or live status from current time to event start/end
 */
export function calculateEventCountdown(startTimeIso: string, durationMinutes: number = 60, now = new Date()): CountdownResult {
  const start = new Date(startTimeIso).getTime();
  const end = start + durationMinutes * 60 * 1000;
  const current = now.getTime();

  if (isNaN(start)) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isLiveNow: false,
      hasEnded: true,
      formattedText: 'تاريخ غير صالح'
    };
  }

  // Live now
  if (current >= start && current < end) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isLiveNow: true,
      hasEnded: false,
      formattedText: 'البث مباشر الآن 🔴'
    };
  }

  // Ended
  if (current >= end) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isLiveNow: false,
      hasEnded: true,
      formattedText: 'انتهت الجلسة'
    };
  }

  // Upcoming
  const diffMs = start - current;
  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  let formattedText = '';
  if (days > 0) {
    formattedText = `يبدأ خلال ${days} يوم و ${hours} ساعة`;
  } else if (hours > 0) {
    formattedText = `يبدأ خلال ${hours} ساعة و ${minutes} دقيقة`;
  } else {
    formattedText = `يبدأ خلال ${minutes} دقيقة و ${seconds} ثانية`;
  }

  return {
    days,
    hours,
    minutes,
    seconds,
    isLiveNow: false,
    hasEnded: false,
    formattedText
  };
}

/**
 * Check remaining seats and capacity status
 */
export function checkSeatAvailability(capacity: number, enrolledCount: number): {
  isFull: boolean;
  remainingSeats: number;
  percentageFilled: number;
} {
  const validCapacity = Math.max(0, capacity);
  const validEnrolled = Math.max(0, enrolledCount);
  const remaining = Math.max(0, validCapacity - validEnrolled);
  const percentage = validCapacity > 0 ? Math.min(100, Math.round((validEnrolled / validCapacity) * 100)) : 100;

  return {
    isFull: remaining === 0,
    remainingSeats: remaining,
    percentageFilled: percentage
  };
}

/**
 * Format Arabic event time string with timezone note
 */
export function formatArabicEventTime(startTimeIso: string, timezoneLabel: string = 'بتوقيت دمشق / مكة المكرمة'): string {
  try {
    const date = new Date(startTimeIso);
    if (isNaN(date.getTime())) return 'موعد غير محدد';

    const formatter = new Intl.DateTimeFormat('ar-SY', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });

    return `${formatter.format(date)} (${timezoneLabel})`;
  } catch {
    return startTimeIso;
  }
}
