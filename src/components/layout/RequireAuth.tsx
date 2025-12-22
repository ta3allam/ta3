import { Navigate, Outlet } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";

interface RequireAuthProps {
    allowedRoles: UserRole[];
}

export default function RequireAuth({ allowedRoles }: RequireAuthProps) {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (user && !allowedRoles.includes(user.role)) {
        // Redirect to their appropriate dashboard if they try to access unauthorized pages
        if (user.role === 'student') return <Navigate to="/student" replace />;
        if (user.role === 'teacher') return <Navigate to="/teacher" replace />;
        if (user.role === 'admin') return <Navigate to="/admin" replace />;
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
