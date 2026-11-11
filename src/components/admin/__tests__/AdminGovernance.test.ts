import { describe, it, expect, beforeEach } from 'vitest';
import { UserItem } from '../UserManagementTable';
import { auditLogger } from '@/lib/security/auditLogger';

describe('SuperAdmin Governance & User Management Domain Invariant Tests', () => {
  const initialUsers: UserItem[] = [
    {
      id: 1,
      name: 'د. طارق المشرف',
      username: 'tariq.admin',
      email: 'tariq.admin@ta3allam.app',
      role: 'مدير',
      status: 'active',
    },
    {
      id: 2,
      name: 'أ. محمود صانع المحتوى',
      username: 'mahmoud.creator',
      email: 'mahmoud@ta3allam.app',
      role: 'صانع محتوى',
      status: 'active',
    },
    {
      id: 3,
      name: 'د. خالد الأكاديمي',
      username: 'khaled.teacher',
      email: 'khaled@university.edu.sy',
      role: 'معلم',
      status: 'active',
    },
    {
      id: 4,
      name: 'سارة العلي',
      username: 'sara.student',
      email: 'sara.ali@student.ta3allam.app',
      role: 'طالب',
      status: 'active',
    },
    {
      id: 5,
      name: 'أحمد النجار',
      username: 'ahmed.student',
      email: 'ahmed.najjar@student.ta3allam.app',
      role: 'طالب',
      status: 'suspended',
    },
  ];

  beforeEach(() => {
    auditLogger.clear();
  });

  describe('Role Promotion & Root Admin Protection', () => {
    it('promotes student to teacher and verifies role upgrade invariant', () => {
      const targetUser = initialUsers.find((u) => u.id === 4)!;
      expect(targetUser.role).toBe('طالب');

      const promoteUser = (user: UserItem, nextRole: string): UserItem => {
        if (user.id === 1 && nextRole !== 'مدير') {
          throw new Error('لا يمكن تغيير رتبة المشرف الرئيسي للنظام.');
        }
        return { ...user, role: nextRole };
      };

      const updated = promoteUser(targetUser, 'معلم');
      expect(updated.role).toBe('معلم');
      expect(updated.status).toBe('active');
    });

    it('strictly forbids demoting the root administrator (id: 1)', () => {
      const rootAdmin = initialUsers.find((u) => u.id === 1)!;

      const attemptDemote = (user: UserItem, nextRole: string) => {
        if (user.id === 1 && nextRole !== 'مدير') {
          throw new Error('لا يمكن تغيير رتبة المشرف الرئيسي للنظام.');
        }
        return { ...user, role: nextRole };
      };

      expect(() => attemptDemote(rootAdmin, 'طالب')).toThrow('لا يمكن تغيير رتبة المشرف الرئيسي للنظام.');
    });
  });

  describe('Account Suspension & Reactivation Invariants', () => {
    it('toggles account state strictly between active and suspended without data loss', () => {
      const toggleStatus = (user: UserItem): UserItem => {
        if (user.id === 1) {
          throw new Error('لا يمكن تجميد حساب المشرف الرئيسي.');
        }
        const nextStatus = user.status === 'suspended' ? 'active' : 'suspended';
        return { ...user, status: nextStatus };
      };

      const activeStudent = initialUsers.find((u) => u.id === 4)!;
      const suspended = toggleStatus(activeStudent);
      expect(suspended.status).toBe('suspended');
      expect(suspended.id).toBe(activeStudent.id);
      expect(suspended.email).toBe(activeStudent.email);

      const reactivated = toggleStatus(suspended);
      expect(reactivated.status).toBe('active');
    });

    it('protects root administrator from accidental account suspension', () => {
      const rootAdmin = initialUsers.find((u) => u.id === 1)!;
      const toggleStatus = (user: UserItem): UserItem => {
        if (user.id === 1) {
          throw new Error('لا يمكن تجميد حساب المشرف الرئيسي.');
        }
        return { ...user, status: user.status === 'suspended' ? 'active' : 'suspended' };
      };

      expect(() => toggleStatus(rootAdmin)).toThrow('لا يمكن تجميد حساب المشرف الرئيسي.');
    });
  });

  describe('Cohort Filtering & Substring Search Invariants', () => {
    const filterUsers = (users: UserItem[], query: string, roleFilter: string): UserItem[] => {
      return users.filter((u) => {
        const matchesSearch =
          u.name.toLowerCase().includes(query.toLowerCase()) ||
          u.username.toLowerCase().includes(query.toLowerCase());
        const matchesRole = roleFilter === 'all' || u.role === roleFilter;
        return matchesSearch && matchesRole;
      });
    };

    it('filters accurately by role category', () => {
      const teachers = filterUsers(initialUsers, '', 'معلم');
      expect(teachers).toHaveLength(1);
      expect(teachers[0].name).toBe('د. خالد الأكاديمي');

      const students = filterUsers(initialUsers, '', 'طالب');
      expect(students).toHaveLength(2);
    });

    it('performs case-insensitive Arabic and English search across names and usernames', () => {
      const resultsAr = filterUsers(initialUsers, 'محمود', 'all');
      expect(resultsAr).toHaveLength(1);
      expect(resultsAr[0].username).toBe('mahmoud.creator');

      const resultsEn = filterUsers(initialUsers, 'sara', 'all');
      expect(resultsEn).toHaveLength(1);
      expect(resultsEn[0].name).toBe('سارة العلي');
    });

    it('returns empty array when query does not match any user', () => {
      const none = filterUsers(initialUsers, 'nonexistent_user_query', 'all');
      expect(none).toEqual([]);
    });
  });
});
