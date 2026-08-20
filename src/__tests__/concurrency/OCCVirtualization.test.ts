import { describe, it, expect } from 'vitest';
import { occManager, StaleDataConflictError } from '../../lib/occ';
import { computeVirtualWindow } from '../../lib/virtualization';

describe('Optimistic Concurrency Control (OCC) Engine', () => {
  it('should initialize entity version to 1', () => {
    const version = occManager.getVersion('submission_101');
    expect(version).toBe(1);
  });

  it('should successfully increment version on matching expected version', () => {
    const entityId = 'submission_102';
    const currentVersion = occManager.getVersion(entityId);
    const newVersion = occManager.validateAndIncrement(entityId, currentVersion);

    expect(newVersion).toBe(currentVersion + 1);
    expect(occManager.getVersion(entityId)).toBe(2);
  });

  it('should throw StaleDataConflictError when expected version is mismatched', () => {
    const entityId = 'submission_103';
    occManager.setVersion(entityId, 5); // Simulated background edit by Teacher B

    expect(() => {
      occManager.validateAndIncrement(entityId, 4); // Teacher A sends stale version 4
    }).toThrow(StaleDataConflictError);
  });
});

describe('High-Concurrency List Virtualization Helper', () => {
  it('should compute zero bounds for empty list', () => {
    const window = computeVirtualWindow({
      totalItems: 0,
      itemHeight: 50,
      containerHeight: 500,
      scrollTop: 0
    });

    expect(window.startIndex).toBe(0);
    expect(window.endIndex).toBe(0);
    expect(window.totalHeight).toBe(0);
  });

  it('should calculate window slice and overscan padding for 1000 items', () => {
    const window = computeVirtualWindow({
      totalItems: 1000,
      itemHeight: 50,
      containerHeight: 500,
      scrollTop: 1000, // Scrolled down 20 items (20 * 50px)
      overscan: 3
    });

    expect(window.startIndex).toBe(17); // 20 - 3 overscan
    expect(window.endIndex).toBe(33);   // 20 + 10 visible + 3 overscan
    expect(window.topPadding).toBe(17 * 50); // 850px
    expect(window.totalHeight).toBe(50000);
  });
});
