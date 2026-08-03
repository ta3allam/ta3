import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { UserProfile, UserRole } from '../types/user';

export type { UserRole };

export interface User extends UserProfile {
  enrolledCourses: number[];
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('ta3_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Failed to load user session from localStorage', e);
      return null;
    }
  });

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const email = session.user.email || '';
        const role: UserRole = (session.user.user_metadata?.role as UserRole) || 'student';
        const name = session.user.user_metadata?.full_name || email.split('@')[0];

        const sbUser: User = {
          id: session.user.id,
          username: email,
          email: email,
          role: role,
          enrolledCourses: [1, 2],
          name: name,
        };
        setUser(sbUser);
        localStorage.setItem('ta3_user', JSON.stringify(sbUser));
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    if (username.includes('@')) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: username,
          password: password,
        });
        if (!error && data.user) {
          const role: UserRole = (data.user.user_metadata?.role as UserRole) || 'student';
          const sbUser: User = {
            id: data.user.id,
            username: data.user.email || username,
            email: data.user.email || username,
            role: role,
            enrolledCourses: [1, 2],
            name: data.user.user_metadata?.full_name || username,
          };
          setUser(sbUser);
          localStorage.setItem('ta3_user', JSON.stringify(sbUser));
          return true;
        }
      } catch (e) {
        console.warn('Supabase auth fallback to mock auth', e);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 300));

    if (password === '123') {
      let loggedInUser: User | null = null;
      if (username === 'student') {
        loggedInUser = {
          id: '00000000-0000-0000-0000-000000000003',
          username: 'student',
          email: 'student@ta3.edu',
          role: 'student',
          enrolledCourses: [1, 2],
          name: 'سامي الطالب',
        };
      } else if (username === 'teacher') {
        loggedInUser = {
          id: '00000000-0000-0000-0000-000000000002',
          username: 'teacher',
          email: 'teacher@ta3.edu',
          role: 'teacher',
          enrolledCourses: [1, 3],
          name: 'د. داليا سليمان',
        };
      } else if (username === 'admin') {
        loggedInUser = {
          id: '00000000-0000-0000-0000-000000000001',
          username: 'admin',
          email: 'admin@ta3.edu',
          role: 'admin',
          enrolledCourses: [],
          name: 'أحمد مدير النظام',
        };
      }

      if (loggedInUser) {
        setUser(loggedInUser);
        localStorage.setItem('ta3_user', JSON.stringify(loggedInUser));
        return true;
      }
    }
    return false;
  }, []);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error('Supabase signOut error', e);
    }
    setUser(null);
    localStorage.removeItem('ta3_user');
  }, []);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      isAuthenticated: !!user,
    }),
    [user, login, logout]
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
