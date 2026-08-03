export type UserRole = 'student' | 'teacher' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  username: string;
  avatar?: string;
  enrolledCourses?: string[];
}
