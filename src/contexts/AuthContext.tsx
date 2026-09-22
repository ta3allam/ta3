import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { UserProfile, UserRole, Certificate, UserSession, UserStats } from '../types/user';
import { MockAuthEngine } from '../lib/MockAuthEngine';

export type { UserRole, Certificate, UserSession, UserStats };

export interface User extends UserProfile {
  enrolledCourses: (number | string)[];
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password?: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updatedData: Partial<User>) => Promise<boolean>;
  toggleTwoFactor: () => Promise<boolean>;
  terminateSession: (sessionId: string) => Promise<boolean>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    return MockAuthEngine.getSavedUser();
  });

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const email = session.user.email || '';
        const role: UserRole = (session.user.user_metadata?.role as UserRole) || 'student';
        const name = session.user.user_metadata?.full_name || session.user.user_metadata?.name || email.split('@')[0];

        const currentUser = MockAuthEngine.getSavedUser();
        const sbUser: User = {
          id: session.user.id,
          username: email,
          email: email,
          role: role,
          enrolledCourses: currentUser?.enrolledCourses || [1, 2],
          name: name,
          bio: currentUser?.bio || '',
          title: currentUser?.title || (role === 'teacher' ? 'معلم أكاديمي' : role === 'admin' ? 'مشرف النظام' : 'طالب مسجل'),
          organization: currentUser?.organization || 'منصة تعلّـم',
          location: currentUser?.location || 'الشرق الأوسط وشمال أفريقيا',
          joinDate: currentUser?.joinDate || '2024',
          twoFactorEnabled: currentUser?.twoFactorEnabled ?? true,
          completedCoursesCount: currentUser?.completedCoursesCount || 2,
          certificatesEarned: currentUser?.certificatesEarned || [],
          stats: currentUser?.stats || { points: 1200, streakDays: 5 },
          activeSessions: currentUser?.activeSessions || [],
        };
        setUser(sbUser);
        MockAuthEngine.saveUser(sbUser);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (username: string, password?: string): Promise<boolean> => {
    if (username.includes('@')) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: username,
          password: password || '123',
        });
        if (!error && data.user) {
          const role: UserRole = (data.user.user_metadata?.role as UserRole) || 'student';
          const name = data.user.user_metadata?.full_name || data.user.user_metadata?.name || username;
          const sbUser: User = {
            id: data.user.id,
            username: data.user.email || username,
            email: data.user.email || username,
            role: role,
            enrolledCourses: [1, 2],
            name: name,
          };
          setUser(sbUser);
          MockAuthEngine.saveUser(sbUser);
          return true;
        }
      } catch (e) {
        console.warn('Supabase auth fallback to mock auth', e);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 300));

    const loggedInUser = MockAuthEngine.authenticateMock(username, password);
    if (loggedInUser) {
      setUser(loggedInUser);
      return true;
    }
    return false;
  }, []);

  const register = useCallback(async (email: string, password: string, name: string, role: UserRole) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            name: name,
            role: role,
          }
        }
      });

      if (error) {
        return { success: false, message: error.message };
      }

      if (data.user) {
        const newUser: User = {
          id: data.user.id,
          username: email,
          email: email,
          role: role,
          name: name,
          enrolledCourses: [1, 2],
          title: role === 'teacher' ? 'معلم أكاديمي' : role === 'admin' ? 'مشرف النظام' : 'طالب مسجل',
          organization: 'منصة تعلّـم',
          joinDate: 'سبتمبر 2026',
          twoFactorEnabled: false,
          completedCoursesCount: 0,
          certificatesEarned: [],
          stats: { points: 100, streakDays: 1 },
        };
        setUser(newUser);
        MockAuthEngine.saveUser(newUser);
        return { success: true };
      }
    } catch (e) {
      console.warn('Supabase signup fallback to mock registration', e);
    }

    // Local fallback mock registration
    const newUser: User = {
      id: `user-${Date.now()}`,
      username: email,
      email: email,
      name: name,
      role: role,
      enrolledCourses: [1, 2],
      title: role === 'teacher' ? 'معلم أكاديمي' : role === 'admin' ? 'مشرف النظام' : 'طالب مسجل',
      organization: 'منصة تعلّـم',
      joinDate: 'سبتمبر 2026',
      twoFactorEnabled: false,
      completedCoursesCount: 0,
      certificatesEarned: [],
      stats: { points: 100, streakDays: 1 },
    };
    setUser(newUser);
    MockAuthEngine.saveUser(newUser);
    return { success: true };
  }, []);

  const updateProfile = useCallback(async (updatedData: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    const updated = MockAuthEngine.updateUserProfile(updatedData);
    if (updated) {
      setUser(updated);
      return true;
    }
    return false;
  }, [user]);

  const toggleTwoFactor = useCallback(async (): Promise<boolean> => {
    if (!user) return false;
    const newStatus = !user.twoFactorEnabled;
    const updated = MockAuthEngine.updateUserProfile({ twoFactorEnabled: newStatus });
    if (updated) {
      setUser(updated);
      return true;
    }
    return false;
  }, [user]);

  const terminateSession = useCallback(async (sessionId: string): Promise<boolean> => {
    if (!user) return false;
    const updated = MockAuthEngine.terminateSession(sessionId);
    if (updated) {
      setUser(updated);
      return true;
    }
    return false;
  }, [user]);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error('Supabase signOut error', e);
    }
    setUser(null);
    MockAuthEngine.clearSession();
  }, []);

  const value = useMemo(
    () => ({
      user,
      login,
      register,
      logout,
      updateProfile,
      toggleTwoFactor,
      terminateSession,
      isAuthenticated: !!user,
    }),
    [user, login, register, logout, updateProfile, toggleTwoFactor, terminateSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
