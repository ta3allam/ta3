import coursesJson from '@/pages/courses/courses.json';
import { CourseData, Announcement, Lecture, CourseEvent, Assignment, Submission } from '@/pages/courses/types';

const STORAGE_KEY = 'ta3_courses';

type DataChangeListener = (data: CourseData) => void;

/**
 * MockDataEngine encapsulates local persistence, reactive event dispatching,
 * and CRUD logic for courses, lectures, announcements, assignments, and submissions.
 */
export class MockDataEngine {
  private static listeners: Set<DataChangeListener> = new Set();

  public static loadCourses(): CourseData {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved) as CourseData;
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
