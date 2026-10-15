import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/user";
import {
  canAccessRoute,
  getDashboardRouteForRole,
  hasComponentPermission,
  ActionPermission,
} from "@/lib/security/rbacGuard";

interface RequireAuthProps {
  allowedRoles: UserRole[];
  requiredPermission?: ActionPermission;
}

/**
 * Tier 1 Route & Layout Authorization Guard
 *
 * Verifies active session authentication, validates role authorization against
 * the current route requirements, and deterministically redirects unauthorized
 * access attempts to the user's localized domain dashboard.
 */
export default function RequireAuth({ allowedRoles, requiredPermission }: RequireAuthProps) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    // Preserve requested path for post-login redirection
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Tier 1 Check: Role-level route access
  const isRoleAllowed = canAccessRoute(user.role, allowedRoles);
  if (!isRoleAllowed) {
    const targetDashboard = getDashboardRouteForRole(user.role);
    return <Navigate to={targetDashboard} replace />;
  }

  // Optional fine-grained permission check
  if (requiredPermission && !hasComponentPermission(user.role, requiredPermission)) {
    const targetDashboard = getDashboardRouteForRole(user.role);
    return <Navigate to={targetDashboard} replace />;
  }

  return <Outlet />;
}

