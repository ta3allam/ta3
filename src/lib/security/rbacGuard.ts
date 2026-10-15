import { UserRole } from '@/types/user';

/**
 * Three-Tier Role-Based Access Control (RBAC) Guard
 *
 * Enforces strict boundary defense across:
 *  - Tier 1: Route Level (URL navigation & page layout guards)
 *  - Tier 2: Component Level (conditional button/tab rendering)
 *  - Tier 3: Action / Handler Level (mutation & transaction asserts)
 */

export type ActionPermission =
  | 'course:create'
  | 'course:edit'
  | 'course:delete'
  | 'lecture:add'
  | 'lecture:delete'
  | 'assignment:grade'
  | 'assignment:submit'
  | 'receipt:verify'
  | 'payout:request'
  | 'payout:approve'
  | 'community:post'
  | 'community:moderate'
  | 'user:manage';

export class AuthorizationError extends Error {
  public readonly code = 'ERR_INSUFFICIENT_PERMISSIONS';
  public readonly statusCode = 403;

  constructor(
    public readonly permission: ActionPermission,
    public readonly role: UserRole | 'anonymous',
    message?: string
  ) {
    super(
      message ||
        `غير مصرح بتنفيذ هذا الإجراء (${permission}) للمستخدم صاحب الدور: ${role}`
    );
    this.name = 'AuthorizationError';
  }
}

const ROLE_PERMISSIONS: Record<UserRole, Set<ActionPermission>> = {
  admin: new Set<ActionPermission>([
    'course:create',
    'course:edit',
    'course:delete',
    'lecture:add',
    'lecture:delete',
    'assignment:grade',
    'assignment:submit',
    'receipt:verify',
    'payout:request',
    'payout:approve',
    'community:post',
    'community:moderate',
    'user:manage',
  ]),
  creator: new Set<ActionPermission>([
    'course:create',
    'course:edit',
    'lecture:add',
    'lecture:delete',
    'payout:request',
    'community:post',
  ]),
  teacher: new Set<ActionPermission>([
    'course:edit',
    'lecture:add',
    'lecture:delete',
    'assignment:grade',
    'community:post',
  ]),
  student: new Set<ActionPermission>([
    'assignment:submit',
    'community:post',
  ]),
};

/**
 * Tier 1: Route-Level Defense
 * Validates whether the user's role satisfies the route requirements.
 */
export function canAccessRoute(
  userRole: UserRole | undefined | null,
  allowedRoles: UserRole[]
): boolean {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
}

/**
 * Resolves the primary dashboard route for a given user role
 */
export function getDashboardRouteForRole(role: UserRole | undefined | null): string {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'creator':
      return '/creator';
    case 'teacher':
      return '/teacher';
    case 'student':
      return '/student';
    default:
      return '/';
  }
}

/**
 * Tier 2: Component-Level Defense
 * Determines whether a specific UI control (e.g. Delete Button, Payout Trigger) should render.
 */
export function hasComponentPermission(
  userRole: UserRole | undefined | null,
  permission: ActionPermission
): boolean {
  if (!userRole) return false;
  const permissions = ROLE_PERMISSIONS[userRole];
  return permissions ? permissions.has(permission) : false;
}

/**
 * Tier 3: Action / Handler Level Defense
 * Throws an AuthorizationError if the calling user lacks required privileges.
 */
export function assertActionAuthorized(
  userRole: UserRole | undefined | null,
  permission: ActionPermission,
  context?: Record<string, unknown>
): void {
  if (!userRole || !hasComponentPermission(userRole, permission)) {
    throw new AuthorizationError(
      permission,
      userRole || 'anonymous',
      `محاولة غير مصرح بها لتنفيذ العملية [${permission}] من قبل المستخدم [${userRole || 'غير مسجل'}]`
    );
  }
}
