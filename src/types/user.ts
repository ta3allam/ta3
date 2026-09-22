export type UserRole = 'student' | 'teacher' | 'creator' | 'admin';

export interface Certificate {
  id: string;
  courseId: number | string;
  courseTitle: string;
  instructorName: string;
  issueDate: string;
  grade: string;
  verificationCode: string;
  credentialUrl?: string;
}

export interface UserSession {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface UserStats {
  points?: number;
  streakDays?: number;
  completedQuizzes?: number;
  totalHoursLearned?: number;
  activeStudentsCount?: number;
  totalEarningsUsd?: number;
  publishedCoursesCount?: number;
  moderationAuditsCount?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  username: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  title?: string;
  organization?: string;
  location?: string;
  joinDate?: string;
  twoFactorEnabled?: boolean;
  enrolledCourses?: (number | string)[];
  completedCoursesCount?: number;
  certificatesEarned?: Certificate[];
  stats?: UserStats;
  activeSessions?: UserSession[];
}
