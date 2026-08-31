import { PricingType } from "@/types/pricing";

export interface Announcement {
    id: number;
    title: string;
    content: string;
    authorName: string;
    createdAt: string;
}

export type EventType = 'assignment' | 'quiz' | 'exam' | 'other';

export interface CourseEvent {
    id: number;
    title: string;
    description?: string;
    event_type: EventType;
    due_date: string;
}

export interface Assignment {
    id: number;
    title: string;
    description: string;
    hasFile?: boolean;
    fileName?: string;
    dueDate: string;
}

export type FileType = 'pdf' | 'video' | 'document' | 'other';

export interface Material {
    id: number;
    title: string;
    file_url: string;
    file_type: FileType;
    file_size?: number;
}

export interface Lecture {
    id: number;
    title: string;
    description?: string;
    materials: Material[];
}

export interface Submission {
    id: number;
    assignmentId: number;
    studentId: string;
    studentName: string;
    submittedAt: string;
    fileUrl?: string;
    fileName?: string;
    comment?: string;
    grade?: number;
    feedback?: string;
}

export interface Course {
    id?: number;
    name: string;
    code: string;
    category: string;
    rating: number;
    difficulty: string;
    teacher: string;
    language: string;
    bgImage?: string;
    pricingType?: PricingType;
    priceCents?: number;
    currency?: string;
    cohortStartDate?: string;
    announcements: Announcement[];
    events: CourseEvent[];
    assignments: Assignment[];
    lectures: Lecture[];
    submissions?: Submission[];
}

export interface CourseData {
    [key: string]: Course;
}
