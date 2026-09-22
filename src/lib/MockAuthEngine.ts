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
    title: 'طالب هندسة برمجيات وعلوم البيانات',
    organization: 'جامعة دمشق - كلية الهندسة المعلوماتية',
    location: 'دمشق، سوريا',
    bio: 'طالب جامعي شغوف بالذكاء الاصطناعي وهندسة النظم الموزعة. أسعى لإتقان بناء التطبيقات السحابية الحديثة والمساهمة في المبادرات التقنية مفتوحة المصدر.',
    phone: '+963 944 123 456',
    joinDate: 'أكتوبر 2024',
    twoFactorEnabled: true,
    completedCoursesCount: 4,
    stats: {
      points: 2450,
      streakDays: 14,
      completedQuizzes: 28,
      totalHoursLearned: 112,
    },
    certificatesEarned: [
      {
        id: 'CERT-2026-8891',
        courseId: 1,
        courseTitle: 'هندسة البرمجيات المتقدمة والأنظمة الموزعة',
        instructorName: 'د. داليا سليمان',
        issueDate: '2026-02-15',
        grade: 'امتياز (94%)',
        verificationCode: 'TA3-DIST-SYS-94-8891',
      },
      {
        id: 'CERT-2026-7732',
        courseId: 2,
        courseTitle: 'تصميم واجهات وتجربة المستخدم الحديثة (UI/UX)',
        instructorName: 'أ. طارق الحلبي',
        issueDate: '2026-01-20',
        grade: 'امتياز مع مرتبة الشرف (98%)',
        verificationCode: 'TA3-UIUX-ADV-98-7732',
      },
    ],
    activeSessions: [
      {
        id: 'SESS-01',
        device: 'MacBook Pro 16"',
        browser: 'Chrome 128.0 (macOS)',
        ip: '194.126.17.84',
        location: 'دمشق، سوريا',
        lastActive: 'الآن (الجلسة الحالية)',
        isCurrent: true,
      },
      {
        id: 'SESS-02',
        device: 'iPhone 15 Pro',
        browser: 'Safari Mobile',
        ip: '194.126.17.89',
        location: 'دمشق، سوريا',
        lastActive: 'منذ ساعتين',
        isCurrent: false,
      },
    ],
  },
  teacher: {
    id: '00000000-0000-0000-0000-000000000002',
    username: 'teacher',
    email: 'teacher@ta3.edu',
    role: 'teacher',
    enrolledCourses: [1, 3],
    name: 'د. داليا سليمان',
    title: 'أستاذ مشارك في علوم الحاسوب وهندسة البرمجيات',
    organization: 'الجامعة الافتراضية السورية',
    location: 'دمشق، سوريا',
    bio: 'أكاديمية وباحثة متخصصة في نظم الحوسبة السحابية وهندسة المنصات التعليمية التفاعلية. قمت بتدريس أكثر من 15 دفعة جامعية وتطوير مناهج الأنظمة الموزعة.',
    phone: '+963 933 789 012',
    joinDate: 'سبتمبر 2023',
    twoFactorEnabled: true,
    completedCoursesCount: 8,
    stats: {
      points: 8900,
      activeStudentsCount: 340,
      completedQuizzes: 120,
      totalHoursLearned: 450,
    },
    certificatesEarned: [
      {
        id: 'CERT-ACAD-2025',
        courseId: 1,
        courseTitle: 'الاعتماد الأكاديمي للتعليم الرقمي المتطور',
        instructorName: 'مجلس التعليم العالي',
        issueDate: '2025-11-10',
        grade: 'درجة الزمالة الفخرية',
        verificationCode: 'TA3-ACAD-HONOR-2025',
      },
    ],
    activeSessions: [
      {
        id: 'SESS-T1',
        device: 'Dell XPS 15',
        browser: 'Edge 128.0 (Windows 11)',
        ip: '178.135.22.10',
        location: 'دمشق، سوريا',
        lastActive: 'الآن (الجلسة الحالية)',
        isCurrent: true,
      },
    ],
  },
  creator: {
    id: '00000000-0000-0000-0000-000000000004',
    username: 'creator',
    email: 'creator@ta3.edu',
    role: 'creator',
    enrolledCourses: [1, 2],
    name: 'طارق النابلسي',
    title: 'صانع محتوى تقني أول وخبير Full-Stack TypeScript',
    organization: 'أكاديمية تعلّم المستقلة لصنّاع المحتوى',
    location: 'عمّان، الأردن',
    bio: 'مطور برمجيات وصانع محتوى تعليمي مرئي يتابعه أكثر من 50,000 مهندس في العالم العربي. أقدم دورات عملية تركز على بناء مشاريع حقيقية ونقل الخبرة السوقية.',
    phone: '+962 79 555 1234',
    joinDate: 'يناير 2024',
    twoFactorEnabled: true,
    completedCoursesCount: 12,
    stats: {
      points: 15400,
      activeStudentsCount: 1280,
      totalEarningsUsd: 14250,
      publishedCoursesCount: 6,
    },
    certificatesEarned: [
      {
        id: 'CERT-CREATOR-2026',
        courseId: 2,
        courseTitle: 'الريادة الرقمية في إنتاج المحتوى التعليمي',
        instructorName: 'منصة تعلّـم',
        issueDate: '2026-03-01',
        grade: 'المستوى البلاتيني الممتاز',
        verificationCode: 'TA3-CREATOR-PLAT-2026',
      },
    ],
    activeSessions: [
      {
        id: 'SESS-C1',
        device: 'Mac Studio M2',
        browser: 'Safari 18.0 (macOS)',
        ip: '213.139.54.12',
        location: 'عمّان، الأردن',
        lastActive: 'الآن (الجلسة الحالية)',
        isCurrent: true,
      },
    ],
  },
  admin: {
    id: '00000000-0000-0000-0000-000000000001',
    username: 'admin',
    email: 'admin@ta3.edu',
    role: 'admin',
    enrolledCourses: [],
    name: 'أحمد مدير النظام',
    title: 'كبير مدققي المنصة ومشرف أمن العمليات (SecOps)',
    organization: 'الإدارة المركزية لمنصة تعلّـم (MENA Ops)',
    location: 'الرياض، المملكة العربية السعودية',
    bio: 'مسؤول الرقابة والحوكمة ومطابقة السياسات الأمنية والمعايير الأكاديمية على منصة تعلّم.',
    phone: '+966 50 123 4567',
    joinDate: 'أغسطس 2023',
    twoFactorEnabled: true,
    completedCoursesCount: 0,
    stats: {
      points: 50000,
      moderationAuditsCount: 480,
    },
    certificatesEarned: [],
    activeSessions: [
      {
        id: 'SESS-A1',
        device: 'Lenovo ThinkPad X1 Carbon',
        browser: 'Firefox Developer Edition',
        ip: '188.50.112.4',
        location: 'الرياض، المملكة العربية السعودية',
        lastActive: 'الآن (الجلسة الحالية)',
        isCurrent: true,
      },
    ],
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

  public static updateUserProfile(updatedFields: Partial<User>): User | null {
    const currentUser = this.getSavedUser();
    if (!currentUser) return null;
    const updatedUser: User = {
      ...currentUser,
      ...updatedFields,
      stats: {
        ...currentUser.stats,
        ...updatedFields.stats,
      },
    };
    this.saveUser(updatedUser);
    return updatedUser;
  }

  public static terminateSession(sessionId: string): User | null {
    const currentUser = this.getSavedUser();
    if (!currentUser || !currentUser.activeSessions) return null;
    const filtered = currentUser.activeSessions.filter((s) => s.id !== sessionId);
    return this.updateUserProfile({ activeSessions: filtered });
  }

  public static clearSession(): void {
    this.saveUser(null);
  }
}
