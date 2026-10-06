import { CohortEvent } from './cohortTime';

export interface LiveQuestion {
  id: string;
  eventId: string | number;
  authorName: string;
  text: string;
  upvotes: number;
  createdAt: string;
  isAnswered: boolean;
}

const STORAGE_EVENTS_KEY = 'ta3_cohort_events_v2';
const STORAGE_RSVP_KEY = 'ta3_user_rsvps_v2';
const STORAGE_QUESTIONS_KEY = 'ta3_live_questions_v2';

// In-memory fallback dictionary for non-browser/test environments
const memoryFallback: Record<string, string> = {};

function getStoredItem(key: string): string | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return memoryFallback[key] || null;
    }
  }
  return memoryFallback[key] || null;
}

function setStoredItem(key: string, value: string): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      memoryFallback[key] = value;
    }
  } else {
    memoryFallback[key] = value;
  }
}

export const INITIAL_EVENTS: CohortEvent[] = [
  {
    id: "ev-1",
    title: "جلسة برمجية تفاعلية: بناء بروتوكول التجزئة 512KB TUS في بيئات الشبكات الضعيفة",
    description: "بث عملي مباشر لتطبيق بروتوكول التجزئة المقاوم لانقطاع الإنترنت مع استفسارات برمجية مفتوحة.",
    instructorName: "د. طارق الحمصي",
    instructorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    startTime: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // Live right now!
    durationMinutes: 90,
    capacity: 100,
    enrolledCount: 88,
    streamUrl: "https://meet.jit.si/ta3allam-cohort-live-session-tus",
    category: "workshop",
    timezone: "دمشق / الرياض (UTC+3)"
  },
  {
    id: "ev-2",
    title: "ماستر كلاس: تصميم نماذج قواعد البيانات الموزعة وحل مشكلات التزامن OCC",
    description: "جلسة متقدمة تناقش فصل مسارات القراءة عن الكتابة واستراتيجيات الذاكرة المؤقتة Redis.",
    instructorName: "م. ليلى الشامي",
    instructorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString(), // in 4 hours
    durationMinutes: 75,
    capacity: 50,
    enrolledCount: 49,
    category: "masterclass",
    timezone: "دمشق / الرياض (UTC+3)"
  },
  {
    id: "ev-3",
    title: "ساعات مكتبية مفتوحة: مراجعة كود مشاريع تخرج الطلاب ونقاشات معمارية",
    description: "نقاش مباشر حر مع الطلاب لمراجعة الواجهات، استعلامات PostgreSQL ومناقشة التحديات.",
    instructorName: "أ. عمر الحلبي",
    instructorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(), // in 2 days
    durationMinutes: 60,
    capacity: 40,
    enrolledCount: 22,
    category: "office_hours",
    timezone: "دمشق / الرياض (UTC+3)"
  },
  {
    id: "ev-4",
    title: "ورشة عمل مسجلة: أسرار بناء مجتمعات المتعلمين وتفعيل تفاعل الأقران",
    description: "تسجيل كامل لورشة إطلاق مجتمعات Skool المصغرة وإدارة النقاشات التفاعلية بنجاح.",
    instructorName: "سارة الزعبي",
    instructorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), // Past
    durationMinutes: 120,
    capacity: 200,
    enrolledCount: 195,
    recordingUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    category: "qa",
    timezone: "دمشق / الرياض (UTC+3)"
  }
];

export class EventStore {
  /**
   * Retrieve all cohort events
   */
  static getEvents(): CohortEvent[] {
    const raw = getStoredItem(STORAGE_EVENTS_KEY);
    if (!raw) {
      this.setEvents(INITIAL_EVENTS);
      return INITIAL_EVENTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_EVENTS;
    }
  }

  /**
   * Overwrite all events
   */
  static setEvents(events: CohortEvent[]): void {
    setStoredItem(STORAGE_EVENTS_KEY, JSON.stringify(events));
  }

  /**
   * Add a new cohort event
   */
  static addEvent(event: Omit<CohortEvent, 'id' | 'enrolledCount'> & { id?: string | number }): CohortEvent {
    const events = this.getEvents();
    const newEvent: CohortEvent = {
      ...event,
      id: event.id || `ev-${Date.now()}`,
      enrolledCount: 0,
    };
    events.unshift(newEvent);
    this.setEvents(events);
    return newEvent;
  }

  /**
   * Retrieve user RSVP list (set of event IDs)
   */
  static getUserRsvps(): string[] {
    const raw = getStoredItem(STORAGE_RSVP_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  /**
   * Toggle user RSVP status for an event and update attendee count
   */
  static toggleRsvp(eventId: string | number): { isRegistered: boolean; newCount: number } {
    const rsvps = this.getUserRsvps();
    const strId = String(eventId);
    const isAlready = rsvps.includes(strId);
    let updatedRsvps: string[];

    if (isAlready) {
      updatedRsvps = rsvps.filter(id => id !== strId);
    } else {
      updatedRsvps = [...rsvps, strId];
    }
    setStoredItem(STORAGE_RSVP_KEY, JSON.stringify(updatedRsvps));

    // Update event enrolled count
    const events = this.getEvents();
    let newCount = 0;
    const updatedEvents = events.map(ev => {
      if (String(ev.id) === strId) {
        newCount = isAlready ? Math.max(0, ev.enrolledCount - 1) : Math.min(ev.capacity, ev.enrolledCount + 1);
        return { ...ev, enrolledCount: newCount };
      }
      return ev;
    });
    this.setEvents(updatedEvents);

    return {
      isRegistered: !isAlready,
      newCount,
    };
  }

  /**
   * Check if user is registered for event
   */
  static isRegistered(eventId: string | number): boolean {
    const rsvps = this.getUserRsvps();
    return rsvps.includes(String(eventId));
  }

  /**
   * Retrieve live questions for an event
   */
  static getQuestions(eventId: string | number): LiveQuestion[] {
    const raw = getStoredItem(STORAGE_QUESTIONS_KEY);
    if (!raw) return [];
    try {
      const all: LiveQuestion[] = JSON.parse(raw);
      return all.filter(q => String(q.eventId) === String(eventId));
    } catch {
      return [];
    }
  }

  /**
   * Post a new live question
   */
  static addQuestion(eventId: string | number, authorName: string, text: string): LiveQuestion {
    const raw = getStoredItem(STORAGE_QUESTIONS_KEY);
    const all: LiveQuestion[] = raw ? JSON.parse(raw) : [];
    const newQ: LiveQuestion = {
      id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      eventId,
      authorName: authorName.trim() || 'طالب مشارك',
      text: text.trim(),
      upvotes: 1,
      createdAt: new Date().toISOString(),
      isAnswered: false,
    };
    all.unshift(newQ);
    setStoredItem(STORAGE_QUESTIONS_KEY, JSON.stringify(all));
    return newQ;
  }

  /**
   * Upvote a live question
   */
  static upvoteQuestion(questionId: string): number {
    const raw = getStoredItem(STORAGE_QUESTIONS_KEY);
    const all: LiveQuestion[] = raw ? JSON.parse(raw) : [];
    let updatedVotes = 0;
    const updated = all.map(q => {
      if (q.id === questionId) {
        updatedVotes = q.upvotes + 1;
        return { ...q, upvotes: updatedVotes };
      }
      return q;
    });
    setStoredItem(STORAGE_QUESTIONS_KEY, JSON.stringify(updated));
    return updatedVotes;
  }

  /**
   * Reset store (useful for tests)
   */
  static reset(): void {
    setStoredItem(STORAGE_EVENTS_KEY, JSON.stringify(INITIAL_EVENTS));
    setStoredItem(STORAGE_RSVP_KEY, JSON.stringify([]));
    setStoredItem(STORAGE_QUESTIONS_KEY, JSON.stringify([]));
  }
}
