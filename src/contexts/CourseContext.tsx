import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import coursesJson from '@/pages/courses/courses.json';
import { CourseData, Announcement, Lecture, CourseEvent, Assignment, Submission } from '@/pages/courses/types';

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
    addCourse: (course: { name: string; code: string; category?: string; teacher?: string }) => void;
    addSubmission: (courseId: number, submission: Omit<Submission, 'id'>) => void;
    gradeSubmission: (courseId: number, submissionId: number, grade: number, feedback?: string) => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export function CourseProvider({ children }: { children: ReactNode }) {
    const [courseData, setCourseData] = useState<CourseData>(() => {
        try {
            const saved = localStorage.getItem('ta3_courses');
            return saved ? JSON.parse(saved) : (coursesJson as unknown as CourseData);
        } catch (e) {
            console.error('Failed to load courses from localStorage', e);
            return coursesJson as unknown as CourseData;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('ta3_courses', JSON.stringify(courseData));
        } catch (e) {
            console.error('Failed to save courses to localStorage', e);
        }
    }, [courseData]);

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

    const addCourse = (course: { name: string; code: string; category?: string; teacher?: string }) => {
        setCourseData(prev => {
            const nextId = Math.max(0, ...Object.keys(prev).map(Number)) + 1;
            return {
                ...prev,
                [nextId]: {
                    name: course.name,
                    code: course.code,
                    category: course.category || "عام",
                    rating: 5,
                    difficulty: "متوسط",
                    teacher: course.teacher || "المعلم",
                    language: "العربية",
                    announcements: [],
                    events: [],
                    assignments: [],
                    lectures: [],
                    submissions: []
                }
            };
        });
    };

    const addSubmission = (courseId: number, submission: Omit<Submission, 'id'>) => {
        setCourseData(prev => {
            const course = prev[courseId];
            if (!course) return prev;

            const existingSubmissions = course.submissions || [];
            const newId = Math.max(0, ...existingSubmissions.map(s => s.id)) + 1;
            return {
                ...prev,
                [courseId]: {
                    ...course,
                    submissions: [...existingSubmissions, { ...submission, id: newId }]
                }
            };
        });
    };

    const gradeSubmission = (courseId: number, submissionId: number, grade: number, feedback?: string) => {
        setCourseData(prev => {
            const course = prev[courseId];
            if (!course) return prev;

            const existingSubmissions = course.submissions || [];
            return {
                ...prev,
                [courseId]: {
                    ...course,
                    submissions: existingSubmissions.map(s =>
                        s.id === submissionId ? { ...s, grade, feedback } : s
                    )
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
            deleteAssignment,
            addCourse,
            addSubmission,
            gradeSubmission
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
