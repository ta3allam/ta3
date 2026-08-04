import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { UserProfile, UserRole } from '../types/user';
import { MockAuthEngine } from '../lib/MockAuthEngine';

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
    return MockAuthEngine.getSavedUser();
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
        MockAuthEngine.saveUser(sbUser);
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
