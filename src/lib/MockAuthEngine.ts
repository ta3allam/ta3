import { User } from '@/contexts/AuthContext';

const STORAGE_KEY = 'ta3_user';

export const MOCK_USERS: Record<string, User> = {
  student: {
    id: '00000000-0000-0000-0000-000000000003',
    username: 'student',
    email: 'student@ta3.edu',
    role: 'student',
    enrolledCourses: [1, 2],
    name: 'سامي الطالب',
  },
  teacher: {
    id: '00000000-0000-0000-0000-000000000002',
    username: 'teacher',
    email: 'teacher@ta3.edu',
    role: 'teacher',
    enrolledCourses: [1, 3],
    name: 'د. داليا سليمان',
  },
  admin: {
    id: '00000000-0000-0000-0000-000000000001',
    username: 'admin',
    email: 'admin@ta3.edu',
    role: 'admin',
    enrolledCourses: [],
    name: 'أحمد مدير النظام',
  },
};

/**
 * MockAuthEngine provides persistent, safe local storage authentication logic.
 */
export class MockAuthEngine {
  public static getSavedUser(): User | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && parsed.role && parsed.name) {
        return parsed as User;
      }
      return null;
    } catch (e) {
      console.error('MockAuthEngine: Error loading user session from localStorage', e);
      return null;
    }
  }

  public static saveUser(user: User | null): void {
    try {
      if (!user) {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      }
    } catch (e) {
      console.error('MockAuthEngine: Error persisting user session', e);
    }
  }

  public static authenticateMock(username: string, password?: string): User | null {
    if (password && password !== '123') return null;
    const userKey = username.toLowerCase().trim();
    const user = MOCK_USERS[userKey];
    if (user) {
      this.saveUser(user);
      return user;
    }
    return null;
  }

  public static clearSession(): void {
    this.saveUser(null);
  }
}
