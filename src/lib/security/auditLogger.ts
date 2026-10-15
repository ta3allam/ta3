/**
 * Security Audit Event Logger (Zero-Trust Observability)
 *
 * Captures, formats, and persists security-sensitive events including authentication
 * attempts, authorization denials, privilege escalation probes, and rate limit violations.
 */

export type SecurityAuditEventType =
  | 'AUTH_LOGIN_SUCCESS'
  | 'AUTH_LOGIN_FAILURE'
  | 'AUTH_LOGOUT'
  | 'UNAUTHORIZED_ROUTE_ATTEMPT'
  | 'UNAUTHORIZED_ACTION_ATTEMPT'
  | 'RATE_LIMIT_TRIGGERED'
  | 'RECEIPT_SUBMITTED'
  | 'RECEIPT_VERIFIED'
  | 'RECEIPT_TAMPER_DETECTED'
  | 'SESSION_TERMINATED'
  | 'SECURITY_LOCKOUT_ENFORCED';

export type AuditSeverity = 'info' | 'warn' | 'error' | 'critical';

export interface SecurityAuditEvent {
  id: string;
  timestamp: string;
  type: SecurityAuditEventType;
  severity: AuditSeverity;
  userId?: string;
  role?: string;
  path?: string;
  details: Record<string, unknown>;
}

const AUDIT_STORAGE_KEY = 'ta3_security_audit_ledger';
const MAX_AUDIT_EVENTS = 200;

class AuditLogger {
  private events: SecurityAuditEvent[] = [];
  private listeners = new Set<(event: SecurityAuditEvent) => void>();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      const data = window.localStorage.getItem(AUDIT_STORAGE_KEY);
      if (data) {
        this.events = JSON.parse(data);
      }
    } catch {
      this.events = [];
    }
  }

  private persist(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      window.localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(this.events));
    } catch {
      // Storage quota or disabled
    }
  }

  /**
   * Records a security audit event
   */
  log(
    type: SecurityAuditEventType,
    severity: AuditSeverity,
    details: Record<string, unknown> = {},
    metadata?: { userId?: string; role?: string; path?: string }
  ): SecurityAuditEvent {
    const event: SecurityAuditEvent = {
      id: `sec_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      timestamp: new Date().toISOString(),
      type,
      severity,
      userId: metadata?.userId,
      role: metadata?.role,
      path: metadata?.path,
      details,
    };

    this.events.unshift(event);
    if (this.events.length > MAX_AUDIT_EVENTS) {
      this.events.pop();
    }

    this.persist();

    // Notify telemetry subscribers
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch {
        // Safe dispatch
      }
    });

    // Console notification in development
    if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'test' && severity !== 'info') {
      console.warn(`[SecurityAudit][${severity.toUpperCase()}] ${type}:`, details);
    }

    return event;
  }

  /**
   * Retrieves recorded audit events with optional filtering
   */
  getEvents(filters?: {
    type?: SecurityAuditEventType;
    severity?: AuditSeverity;
    userId?: string;
  }): SecurityAuditEvent[] {
    return this.events.filter((e) => {
      if (filters?.type && e.type !== filters.type) return false;
      if (filters?.severity && e.severity !== filters.severity) return false;
      if (filters?.userId && e.userId !== filters.userId) return false;
      return true;
    });
  }

  /**
   * Returns recent security anomalies (warn, error, critical)
   */
  getAnomalies(limit = 20): SecurityAuditEvent[] {
    return this.events
      .filter((e) => e.severity === 'warn' || e.severity === 'error' || e.severity === 'critical')
      .slice(0, limit);
  }

  /**
   * Subscribes to new audit events in real-time
   */
  subscribe(listener: (event: SecurityAuditEvent) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Resets audit ledger (for test isolation)
   */
  clear(): void {
    this.events = [];
    this.persist();
  }
}

export const auditLogger = new AuditLogger();
export { AuditLogger };
