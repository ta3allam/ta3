export interface LectureMaterial {
  id: number | string;
  title: string;
  file_url: string;
  file_type?: string;
  file_size?: number;
}

export interface Lecture {
  id: number | string;
  title: string;
  description: string;
  materials: LectureMaterial[];
}

export interface Assignment {
  id: number | string;
  title: string;
  description: string;
  dueDate: string;
  hasFile?: boolean;
  fileName?: string;
}

export interface Announcement {
  id: number | string;
  title: string;
  content: string;
  authorName: string;
  createdAt: string;
}

export interface CourseEvent {
  id: number | string;
  title: string;
  description?: string;
  event_type: 'assignment' | 'quiz' | 'lecture';
  due_date: string;
}

export interface CourseData {
  id: string;
  name: string;
  code: string;
  category: string;
  rating: number;
  difficulty: string;
  teacher: string;
  language: string;
  announcements: Announcement[];
  events: CourseEvent[];
  assignments: Assignment[];
  lectures: Lecture[];
}
