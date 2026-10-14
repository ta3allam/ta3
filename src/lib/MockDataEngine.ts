import coursesJson from '@/pages/courses/courses.json';
import { CourseData, Announcement, Lecture, CourseEvent, Assignment, Submission, Course } from '@/pages/courses/types';
import { CommandBus, EventBus, createDomainEvent } from '@/lib/cqrs/commandBus';

const STORAGE_KEY = 'ta3_courses';

type DataChangeListener = (data: CourseData) => void;

export const COURSE_COMMANDS = {
  ADD_LECTURE: 'course:add_lecture',
  ADD_ANNOUNCEMENT: 'course:add_announcement',
  ADD_ASSIGNMENT: 'course:add_assignment',
  ADD_SUBMISSION: 'course:add_submission',
} as const;

export const COURSE_EVENTS = {
  LECTURE_ADDED: 'course:lecture_added',
  ANNOUNCEMENT_ADDED: 'course:announcement_added',
  ASSIGNMENT_ADDED: 'course:assignment_added',
  SUBMISSION_ADDED: 'course:submission_added',
  STATE_PERSISTED: 'course:state_persisted',
} as const;

/**
 * MockDataEngine encapsulates local persistence, reactive event dispatching,
 * and CQRS command/query logic for courses, lectures, announcements, assignments, and submissions.
 */
export class MockDataEngine {
  private static listeners: Set<DataChangeListener> = new Set();
  private static initialized = false;

  public static initialize(): void {
    if (this.initialized) return;

    CommandBus.register(COURSE_COMMANDS.ADD_LECTURE, async (cmd) => {
      const { courseId, lecture } = cmd.payload;
      const current = this.loadCourses();
      return this.addLecture(current, courseId, lecture);
    });

    CommandBus.register(COURSE_COMMANDS.ADD_ANNOUNCEMENT, async (cmd) => {
      const { courseId, announcement } = cmd.payload;
      const current = this.loadCourses();
      return this.addAnnouncement(current, courseId, announcement);
    });

    CommandBus.register(COURSE_COMMANDS.ADD_ASSIGNMENT, async (cmd) => {
      const { courseId, assignment } = cmd.payload;
      const current = this.loadCourses();
      return this.addAssignment(current, courseId, assignment);
    });

    this.initialized = true;
  }

  public static loadCourses(): CourseData {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as CourseData;
        // Ensure bgImage is merged for existing courses in cache
        Object.keys(parsed).forEach((id) => {
          if (!parsed[id].bgImage && coursesJson[id as keyof typeof coursesJson]) {
            parsed[id].bgImage = (coursesJson[id as keyof typeof coursesJson] as unknown as Course).bgImage;
          }
        });
        return parsed;
      }
    } catch (e) {
      console.error('MockDataEngine: Failed to parse courses from localStorage', e);
    }
    return coursesJson as unknown as CourseData;
  }

  public static saveCourses(data: CourseData): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      this.notify(data);
      EventBus.publish(createDomainEvent(COURSE_EVENTS.STATE_PERSISTED, { timestamp: new Date().toISOString() }));
    } catch (e) {
      console.error('MockDataEngine: Failed to save courses to localStorage', e);
    }
  }

  public static subscribe(listener: DataChangeListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private static notify(data: CourseData): void {
    this.listeners.forEach((listener) => {
      try {
        listener(data);
      } catch (e) {
        console.error('MockDataEngine: Listener notification error', e);
      }
    });
  }

  public static addAnnouncement(
    currentData: CourseData,
    courseId: number,
    announcement: Omit<Announcement, 'id'>
  ): CourseData {
    const course = currentData[courseId];
    if (!course) return currentData;
    const newId = Math.max(0, ...(course.announcements || []).map((a) => a.id)) + 1;
    const updated: CourseData = {
      ...currentData,
      [courseId]: {
        ...course,
        announcements: [...(course.announcements || []), { ...announcement, id: newId }],
      },
    };
    this.saveCourses(updated);
    return updated;
  }

  public static addLecture(
    currentData: CourseData,
    courseId: number,
    lecture: Omit<Lecture, 'id'>
  ): CourseData {
    const course = currentData[courseId];
    if (!course) return currentData;
    const newId = Math.max(0, ...(course.lectures || []).map((l) => l.id)) + 1;
    const updated: CourseData = {
      ...currentData,
      [courseId]: {
        ...course,
        lectures: [...(course.lectures || []), { ...lecture, id: newId }],
      },
    };
    this.saveCourses(updated);
    return updated;
  }

  public static addAssignment(
    currentData: CourseData,
    courseId: number,
    assignment: Omit<Assignment, 'id'>
  ): CourseData {
    const course = currentData[courseId];
    if (!course) return currentData;
    const newId = Math.max(0, ...(course.assignments || []).map((a) => a.id)) + 1;
    const updated: CourseData = {
      ...currentData,
      [courseId]: {
        ...course,
        assignments: [...(course.assignments || []), { ...assignment, id: newId }],
      },
    };
    this.saveCourses(updated);
    return updated;
  }

  public static addSubmission(
    currentData: CourseData,
    courseId: number,
    submission: Omit<Submission, 'id'>
  ): CourseData {
    const course = currentData[courseId];
    if (!course) return currentData;
    const existing = course.submissions || [];
    const newId = Math.max(0, ...existing.map((s) => s.id)) + 1;
    const updated: CourseData = {
      ...currentData,
      [courseId]: {
        ...course,
        submissions: [...existing, { ...submission, id: newId }],
      },
    };
    this.saveCourses(updated);
    return updated;
  }
}
