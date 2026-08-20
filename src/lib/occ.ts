/**
 * Ta3 (تعلّم) - Optimistic Concurrency Control (OCC) Engine
 * Prevents concurrent modification conflicts and silent overwrites using versioning tags.
 */

export interface VersionedEntity {
  id: string | number;
  version: number;
  updatedAt: string;
}

export class StaleDataConflictError extends Error {
  public entityId: string | number;
  public expectedVersion: number;
  public actualVersion: number;

  constructor(entityId: string | number, expectedVersion: number, actualVersion: number) {
    super(`Conflict detected for entity ${entityId}: expected version ${expectedVersion}, but found version ${actualVersion}. Please refresh and try again.`);
    this.name = 'StaleDataConflictError';
    this.entityId = entityId;
    this.expectedVersion = expectedVersion;
    this.actualVersion = actualVersion;
  }
}

class OCCManager {
  private versions: Map<string, number> = new Map();

  /**
   * Initializes or gets current version tag for an entity
   */
  getVersion(entityId: string | number): number {
    const key = String(entityId);
    if (!this.versions.has(key)) {
      this.versions.set(key, 1);
    }
    return this.versions.get(key)!;
  }

  /**
   * Validates version tag before applying mutation. Throws StaleDataConflictError if mismatched.
   */
  validateAndIncrement(entityId: string | number, expectedVersion: number): number {
    const key = String(entityId);
    const currentVersion = this.getVersion(entityId);

    if (currentVersion !== expectedVersion) {
      throw new StaleDataConflictError(entityId, expectedVersion, currentVersion);
    }

    const nextVersion = currentVersion + 1;
    this.versions.set(key, nextVersion);
    return nextVersion;
  }

  /**
   * Resets or sets explicit version tag (e.g. after sync from remote database)
   */
  setVersion(entityId: string | number, version: number): void {
    this.versions.set(String(entityId), version);
  }
}

export const occManager = new OCCManager();
