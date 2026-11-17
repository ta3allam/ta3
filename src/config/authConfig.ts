/**
 * Authentication & Registration Governance Policy Configuration
 */
export const AUTH_CONFIG = {
  /**
   * Global toggle concealing and disabling self-registration.
   * Kept false to protect platform governance until public admissions open.
   */
  ENABLE_REGISTRATION: false,

  /**
   * Minimum password security length
   */
  MIN_PASSWORD_LENGTH: 6,

  /**
   * Roles permitted for self-registration if enabled.
   * 'admin' and 'teacher' are strictly excluded from self-service registration.
   */
  ALLOWED_SELF_REGISTER_ROLES: ['student'] as const,
} as const;
