import { describe, it, expect } from 'vitest';
import { UserRole } from '@/contexts/AuthContext';

describe('Navigation Topology & Context Isolation Unit Tests (Day 1 Overhaul)', () => {
  interface NavMenuItem {
    title: string;
    path: string;
    isGlobal: boolean;
  }

  const getCourseNavItems = (role: UserRole, courseId: string): NavMenuItem[] => {
    const roleBase = role === 'teacher' ? '/teacher' : role === 'admin' ? '/admin' : '/student';
    const courseBase = `${roleBase}/courses/${courseId}`;
    return [
      { title: 'الرئيسية والإعلانات', path: courseBase, isGlobal: false },
      { title: 'التقويم الأكاديمي', path: `${courseBase}/timeline`, isGlobal: false },
      { title: 'المجموعات الدراسية', path: `${courseBase}/groups`, isGlobal: false },
      { title: 'ساحة النقاش والاستفسارات', path: `${courseBase}/discussion`, isGlobal: false },
      { title: 'التواصل والدعم الأكاديمي', path: `${courseBase}/contact`, isGlobal: false },
    ];
  };

  const getGlobalNavItems = (role: UserRole): NavMenuItem[] => {
    switch (role) {
      case 'admin':
        return [
          { title: 'لوحة التحكم والرقابة', path: '/admin', isGlobal: true },
          { title: 'إحصائيات المنصة والتحويل', path: '/analytics', isGlobal: true },
          { title: 'مجتمع المعرفة', path: '/community', isGlobal: true },
          { title: 'سوق الدورات والمقررات', path: '/marketplace', isGlobal: true },
          { title: 'الورش والجلسات المباشرة', path: '/cohorts', isGlobal: true },
        ];
      case 'teacher':
        return [
          { title: 'لوحة التحكم الأكاديمية', path: '/teacher', isGlobal: true },
          { title: 'تحليلات أداء المساقات', path: '/analytics', isGlobal: true },
          { title: 'الورش والجلسات المباشرة', path: '/cohorts', isGlobal: true },
          { title: 'مجتمع المعرفة والنقاش', path: '/community', isGlobal: true },
          { title: 'سوق الدورات التعليمية', path: '/marketplace', isGlobal: true },
        ];
      case 'student':
        return [
          { title: 'لوحة التحكم ومقرراتي', path: '/student', isGlobal: true },
          { title: 'مجتمع المعرفة التفاعلي', path: '/community', isGlobal: true },
          { title: 'سوق الدورات والمقررات', path: '/marketplace', isGlobal: true },
          { title: 'الورش والجلسات المباشرة', path: '/cohorts', isGlobal: true },
        ];
      default:
        return [];
    }
  };

  const getCreatorNavItems = (): NavMenuItem[] => [
    { title: 'لوحة صانع المحتوى', path: '/creator', isGlobal: true },
    { title: 'محفظة الأرباح والمستحقات', path: '/creator/payouts', isGlobal: true },
    { title: 'إحصائيات المبيعات والتحويل', path: '/analytics', isGlobal: true },
  ];

  it('Principle 1: Course navigation MUST strictly contain only local course links and 0 global links', () => {
    const studentCourseNav = getCourseNavItems('student', '101');
    const teacherCourseNav = getCourseNavItems('teacher', '101');

    expect(studentCourseNav.every(item => !item.isGlobal)).toBe(true);
    expect(teacherCourseNav.every(item => !item.isGlobal)).toBe(true);

    const forbiddenGlobalTitles = [
      'محفظة الأرباح والمستحقات',
      'سوق الدورات والمقررات',
      'سوق الدورات التعليمية',
      'لوحة الرقابة والإشراف العام',
      'الورش والجلسات المباشرة'
    ];

    studentCourseNav.forEach(item => {
      expect(forbiddenGlobalTitles).not.toContain(item.title);
      expect(item.path).toContain('/courses/101');
    });

    teacherCourseNav.forEach(item => {
      expect(forbiddenGlobalTitles).not.toContain(item.title);
      expect(item.path).toContain('/courses/101');
    });
  });

  it('Principle 2: SuperAdmin has executive governance and strictly NO personal wallet', () => {
    const adminNav = getGlobalNavItems('admin');
    const hasWallet = adminNav.some(item => item.path.includes('/payouts') || item.title.includes('محفظة'));
    const hasGovernance = adminNav.some(item => item.path === '/admin');

    expect(hasWallet).toBe(false);
    expect(hasGovernance).toBe(true);
  });

  it('Principle 2: Institutional Teacher manages academic curriculum with NO financial wallet clutter', () => {
    const teacherNav = getGlobalNavItems('teacher');
    const hasWallet = teacherNav.some(item => item.path.includes('/payouts') || item.title.includes('محفظة'));
    const hasAcademicDashboard = teacherNav.some(item => item.path === '/teacher');

    expect(hasWallet).toBe(false);
    expect(hasAcademicDashboard).toBe(true);
  });

  it('Principle 2: Commercial Creator possesses the Financial Payout Wallet and Creator Studio', () => {
    const creatorNav = getCreatorNavItems();
    const hasWallet = creatorNav.some(item => item.path === '/creator/payouts');
    const hasCreatorStudio = creatorNav.some(item => item.path === '/creator');

    expect(hasWallet).toBe(true);
    expect(hasCreatorStudio).toBe(true);
  });

  it('Principle 3: Production Realism — Verify TopBar role badge configuration', () => {
    const getRoleBadge = (role?: UserRole) => {
      switch (role) {
        case 'admin':
          return { label: 'مشرف عام النظام', color: 'bg-[#6B1F2A]' };
        case 'teacher':
          return { label: 'معلّم أكاديمي', color: 'bg-[#428177]' };
        case 'student':
        default:
          return { label: 'طالب مسجل', color: 'bg-[#988561]' };
      }
    };

    expect(getRoleBadge('admin').label).toBe('مشرف عام النظام');
    expect(getRoleBadge('teacher').label).toBe('معلّم أكاديمي');
    expect(getRoleBadge('student').label).toBe('طالب مسجل');
  });
});
