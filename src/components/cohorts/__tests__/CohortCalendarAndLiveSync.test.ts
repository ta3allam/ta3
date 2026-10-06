import { describe, it, expect, beforeEach } from 'vitest';
import { EventStore } from '@/lib/cohorts/eventStore';
import {
  generateGoogleCalendarUrl,
  generateIcsCalendarData,
  formatUtcDateTime
} from '@/lib/cohorts/calendarExport';
import {
  MENA_TIMEZONES,
  formatArabicEventTime,
  calculateEventCountdown
} from '@/lib/cohorts/cohortTime';

describe('Cohort Calendar, Live Event Sync & RSVP Store Tests', () => {
  beforeEach(() => {
    EventStore.reset();
  });

  describe('EventStore Persistence & Management', () => {
    it('should retrieve default initial events', () => {
      const events = EventStore.getEvents();
      expect(events.length).toBeGreaterThanOrEqual(4);
      expect(events[0]).toHaveProperty('id');
      expect(events[0]).toHaveProperty('title');
      expect(events[0]).toHaveProperty('category');
    });

    it('should allow instructors to add custom cohort events', () => {
      const newEv = EventStore.addEvent({
        title: 'ورشة بناء أنظمة الذكاء الاصطناعي الخفيفة',
        description: 'جلسة عملية لبناء أنظمة سريعة بدون استهلاك كبير للباندويث',
        instructorName: 'د. سامر الحمصي',
        startTime: '2026-10-15T18:00:00Z',
        durationMinutes: 90,
        capacity: 60,
        category: 'workshop',
        timezone: 'دمشق / مكة المكرمة (UTC+3)'
      });

      expect(newEv.id).toBeDefined();
      expect(newEv.enrolledCount).toBe(0);

      const all = EventStore.getEvents();
      expect(all.some(e => e.title === 'ورشة بناء أنظمة الذكاء الاصطناعي الخفيفة')).toBe(true);
    });

    it('should toggle RSVP status and correctly update attendee counter', () => {
      const events = EventStore.getEvents();
      const target = events[0];
      const initialCount = target.enrolledCount;

      // 1. Register
      const registerRes = EventStore.toggleRsvp(target.id);
      expect(registerRes.isRegistered).toBe(true);
      expect(registerRes.newCount).toBe(initialCount + 1);
      expect(EventStore.isRegistered(target.id)).toBe(true);

      // 2. Unregister
      const unregisterRes = EventStore.toggleRsvp(target.id);
      expect(unregisterRes.isRegistered).toBe(false);
      expect(unregisterRes.newCount).toBe(initialCount);
      expect(EventStore.isRegistered(target.id)).toBe(false);
    });

    it('should manage live questions and upvotes in live sessions', () => {
      const eventId = 'ev-test-101';
      
      const q1 = EventStore.addQuestion(eventId, 'أحمد الحلبي', 'كيف نقوم بحساب الحجم الأقصى للـ Chunk؟');
      expect(q1.id).toBeDefined();
      expect(q1.upvotes).toBe(1);
      expect(q1.authorName).toBe('أحمد الحلبي');

      const questions = EventStore.getQuestions(eventId);
      expect(questions.length).toBe(1);
      expect(questions[0].text).toContain('Chunk');

      // Upvote question
      const upvoted = EventStore.upvoteQuestion(q1.id);
      expect(upvoted).toBe(2);

      const updatedQs = EventStore.getQuestions(eventId);
      expect(updatedQs[0].upvotes).toBe(2);
    });
  });

  describe('Calendar Export Utilities', () => {
    const sampleEvent = {
      id: 'ev-test-calendar',
      title: 'جلسة تصميم واجهات مستخدم عربية فاخرة',
      description: 'نقاش المعايير الجمالية وتوافق الخطوط العربية',
      instructorName: 'م. ياسمين الشام',
      startTime: '2026-10-20T15:00:00.000Z',
      durationMinutes: 60,
      capacity: 100,
      enrolledCount: 45,
      streamUrl: 'https://meet.jit.si/ta3allam-arabic-design',
      category: 'masterclass' as const,
      timezone: 'دمشق / الرياض (UTC+3)'
    };

    it('should format UTC date time strings for calendar standards', () => {
      const formatted = formatUtcDateTime('2026-10-20T15:00:00.000Z');
      expect(formatted).toBe('20261020T150000Z');
    });

    it('should generate valid Google Calendar template URL with encoded parameters', () => {
      const url = generateGoogleCalendarUrl(sampleEvent);
      expect(url).toContain('https://calendar.google.com/calendar/render');
      expect(url).toContain('action=TEMPLATE');
      expect(url).toContain('dates=20261020T150000Z%2F20261020T160000Z');
      
      const parsedUrl = new URL(url);
      expect(parsedUrl.searchParams.get('text')).toBe(sampleEvent.title);
      expect(parsedUrl.searchParams.get('location')).toBe(sampleEvent.streamUrl);
    });

    it('should generate standard RFC 5545 compliant iCalendar string (.ics)', () => {
      const ics = generateIcsCalendarData(sampleEvent);
      expect(ics).toContain('BEGIN:VCALENDAR');
      expect(ics).toContain('VERSION:2.0');
      expect(ics).toContain('BEGIN:VEVENT');
      expect(ics).toContain('DTSTART:20261020T150000Z');
      expect(ics).toContain('DTEND:20261020T160000Z');
      expect(ics).toContain('SUMMARY:جلسة تصميم واجهات مستخدم عربية فاخرة');
      expect(ics).toContain('LOCATION:https://meet.jit.si/ta3allam-arabic-design');
      expect(ics).toContain('END:VEVENT');
      expect(ics).toContain('END:VCALENDAR');
    });
  });

  describe('MENA Regional Timezone Handling', () => {
    it('should contain all major Levant, Gulf, and North Africa timezone definitions', () => {
      expect(MENA_TIMEZONES.length).toBeGreaterThanOrEqual(5);
      const damascus = MENA_TIMEZONES.find(tz => tz.id === 'damascus_riyadh');
      expect(damascus).toBeDefined();
      expect(damascus?.offset).toBe(3);

      const cairo = MENA_TIMEZONES.find(tz => tz.id === 'cairo_beirut');
      expect(cairo).toBeDefined();
      expect(cairo?.offset).toBe(2);
    });

    it('should format Arabic date with custom IANA timezone specifiers', () => {
      const isoDate = '2026-10-20T12:00:00Z';
      const formatted = formatArabicEventTime(isoDate, 'بتوقيت دمشق', 'Asia/Damascus');
      expect(formatted).toContain('بتوقيت دمشق');
      expect(typeof formatted).toBe('string');
    });
  });
});
