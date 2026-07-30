import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
    username: string;
    role: UserRole;
    enrolledCourses: number[]; // Array of Course IDs
    name: string;
}

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
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

    const login = async (username: string, password: string): Promise<boolean> => {
        // Mock authentication delay
        await new Promise(resolve => setTimeout(resolve, 500));

        if (password === '123') {
            let loggedInUser: User | null = null;
            if (username === 'student') {
                loggedInUser = {
                    username: 'student',
                    role: 'student',
                    enrolledCourses: [1, 2], // Enrolled in CS101 and MATH201
                    name: 'أحمد علي'
                };
            } else if (username === 'teacher') {
                loggedInUser = {
                    username: 'teacher',
                    role: 'teacher',
                    enrolledCourses: [1, 3], // Teaches CS101 and CS301
                    name: 'د. خالد'
                };
            } else if (username === 'admin') {
                loggedInUser = {
                    username: 'admin',
                    role: 'admin',
                    enrolledCourses: [],
                    name: 'مدير النظام'
                };
            }

            if (loggedInUser) {
                setUser(loggedInUser);
                localStorage.setItem('ta3_user', JSON.stringify(loggedInUser));
                return true;
            }
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('ta3_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
