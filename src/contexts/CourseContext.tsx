import { createContext, useContext, useState, ReactNode } from 'react';
import coursesJson from '@/pages/courses/courses.json';
import { CourseData, Announcement, Lecture, CourseEvent, Assignment } from '@/pages/courses/types';

interface CourseContextType {
    courseData: CourseData;
    addAnnouncement: (courseId: number, announcement: Omit<Announcement, 'id'>) => void;
    updateAnnouncement: (courseId: number, announcementId: number, announcement: Partial<Announcement>) => void;
    deleteAnnouncement: (courseId: number, announcementId: number) => void;
    addLecture: (courseId: number, lecture: Omit<Lecture, 'id'>) => void;
    updateLecture: (courseId: number, lectureId: number, lecture: Partial<Lecture>) => void;
    deleteLecture: (courseId: number, lectureId: number) => void;
    addEvent: (courseId: number, event: Omit<CourseEvent, 'id'>) => void;
    updateEvent: (courseId: number, eventId: number, event: Partial<CourseEvent>) => void;
    deleteEvent: (courseId: number, eventId: number) => void;
    addAssignment: (courseId: number, assignment: Omit<Assignment, 'id'>) => void;
    updateAssignment: (courseId: number, assignmentId: number, assignment: Partial<Assignment>) => void;
    deleteAssignment: (courseId: number, assignmentId: number) => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export function CourseProvider({ children }: { children: ReactNode }) {
    const [courseData, setCourseData] = useState<CourseData>(coursesJson as unknown as CourseData);

    const addAnnouncement = (courseId: number, announcement: Omit<Announcement, 'id'>) => {
        setCourseData(prev => {
            const course = prev[courseId];
            if (!course) return prev;

            const newId = Math.max(0, ...course.announcements.map(a => a.id)) + 1;
            return {
                ...prev,
                [courseId]: {
                    ...course,
                    announcements: [...course.announcements, { ...announcement, id: newId }]
                }
            };
        });
    };

    const updateAnnouncement = (courseId: number, announcementId: number, announcement: Partial<Announcement>) => {
        setCourseData(prev => {
            const course = prev[courseId];
            if (!course) return prev;

            return {
                ...prev,
                [courseId]: {
                    ...course,
                    announcements: course.announcements.map(a =>
                        a.id === announcementId ? { ...a, ...announcement } : a
                    )
                }
            };
        });
    };

    const deleteAnnouncement = (courseId: number, announcementId: number) => {
        setCourseData(prev => {
            const course = prev[courseId];
            if (!course) return prev;

            return {
                ...prev,
                [courseId]: {
                    ...course,
                    announcements: course.announcements.filter(a => a.id !== announcementId)
                }
            };
        });
    };

    const addLecture = (courseId: number, lecture: Omit<Lecture, 'id'>) => {
        setCourseData(prev => {
            const course = prev[courseId];
            if (!course) return prev;

            const newId = Math.max(0, ...course.lectures.map(l => l.id)) + 1;
            return {
                ...prev,
                [courseId]: {
                    ...course,
                    lectures: [...course.lectures, { ...lecture, id: newId }]
                }
            };
        });
    };

    const updateLecture = (courseId: number, lectureId: number, lecture: Partial<Lecture>) => {
        setCourseData(prev => {
            const course = prev[courseId];
            if (!course) return prev;

            return {
                ...prev,
                [courseId]: {
                    ...course,
                    lectures: course.lectures.map(l =>
                        l.id === lectureId ? { ...l, ...lecture } : l
                    )
                }
            };
        });
    };

    const deleteLecture = (courseId: number, lectureId: number) => {
        setCourseData(prev => {
            const course = prev[courseId];
            if (!course) return prev;

            return {
                ...prev,
                [courseId]: {
                    ...course,
                    lectures: course.lectures.filter(l => l.id !== lectureId)
                }
            };
        });
    };

    const addEvent = (courseId: number, event: Omit<CourseEvent, 'id'>) => {
        setCourseData(prev => {
            const course = prev[courseId];
            if (!course) return prev;

            const newId = Math.max(0, ...course.events.map(e => e.id)) + 1;
            return {
                ...prev,
                [courseId]: {
                    ...course,
                    events: [...course.events, { ...event, id: newId }]
                }
            };
        });
    };

    const updateEvent = (courseId: number, eventId: number, event: Partial<CourseEvent>) => {
        setCourseData(prev => {
            const course = prev[courseId];
            if (!course) return prev;

            return {
                ...prev,
                [courseId]: {
                    ...course,
                    events: course.events.map(e =>
                        e.id === eventId ? { ...e, ...event } : e
                    )
                }
            };
        });
    };

    const deleteEvent = (courseId: number, eventId: number) => {
        setCourseData(prev => {
            const course = prev[courseId];
            if (!course) return prev;

            return {
                ...prev,
                [courseId]: {
                    ...course,
                    events: course.events.filter(e => e.id !== eventId)
                }
            };
        });
    };

    const addAssignment = (courseId: number, assignment: Omit<Assignment, 'id'>) => {
        setCourseData(prev => {
            const course = prev[courseId];
            if (!course) return prev;

            const newId = Math.max(0, ...course.assignments.map(a => a.id)) + 1;
            return {
                ...prev,
                [courseId]: {
                    ...course,
                    assignments: [...course.assignments, { ...assignment, id: newId }]
                }
            };
        });
    };

    const updateAssignment = (courseId: number, assignmentId: number, assignment: Partial<Assignment>) => {
        setCourseData(prev => {
            const course = prev[courseId];
            if (!course) return prev;

            return {
                ...prev,
                [courseId]: {
                    ...course,
                    assignments: course.assignments.map(a =>
                        a.id === assignmentId ? { ...a, ...assignment } : a
                    )
                }
            };
        });
    };

    const deleteAssignment = (courseId: number, assignmentId: number) => {
        setCourseData(prev => {
            const course = prev[courseId];
            if (!course) return prev;

            return {
                ...prev,
                [courseId]: {
                    ...course,
                    assignments: course.assignments.filter(a => a.id !== assignmentId)
                }
            };
        });
    };

    return (
        <CourseContext.Provider value={{
            courseData,
            addAnnouncement,
            updateAnnouncement,
            deleteAnnouncement,
            addLecture,
            updateLecture,
            deleteLecture,
            addEvent,
            updateEvent,
            deleteEvent,
            addAssignment,
            updateAssignment,
            deleteAssignment
        }}>
            {children}
        </CourseContext.Provider>
    );
}

export function useCourseData() {
    const context = useContext(CourseContext);
    if (context === undefined) {
        throw new Error('useCourseData must be used within a CourseProvider');
    }
    return context;
}
