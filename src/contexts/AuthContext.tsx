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
    const [user, setUser] = useState<User | null>(null);

    const login = async (username: string, password: string): Promise<boolean> => {
        // Mock authentication delay
        await new Promise(resolve => setTimeout(resolve, 500));

        if (password === '123') {
            if (username === 'student') {
                setUser({
                    username: 'student',
                    role: 'student',
                    enrolledCourses: [1, 2], // Enrolled in CS101 and MATH201
                    name: 'أحمد علي'
                });
                return true;
            } else if (username === 'teacher') {
                setUser({
                    username: 'teacher',
                    role: 'teacher',
                    enrolledCourses: [1, 3], // Teaches CS101 and CS301
                    name: 'د. خالد'
                });
                return true;
            } else if (username === 'admin') {
                setUser({
                    username: 'admin',
                    role: 'admin',
                    enrolledCourses: [],
                    name: 'مدير النظام'
                });
                return true;
            }
        }
        return false;
    };

    const logout = () => {
        setUser(null);
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
