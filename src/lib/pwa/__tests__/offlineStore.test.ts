import { describe, it, expect, beforeEach } from 'vitest';
import { OfflineDraftStore, OfflineDraft } from '../offlineDraftStore';

describe('Offline Draft Store & PWA Resiliency Unit Tests', () => {
  beforeEach(() => {
    OfflineDraftStore.clearAll();
  });

  it('should save and retrieve offline draft submissions', () => {
    const draft = OfflineDraftStore.saveDraft({
      id: 'draft-101',
      type: 'post',
      payload: { title: 'منشور غير متصل', content: 'محتوى تجريبي' }
    });

    expect(draft.id).toBe('draft-101');
    expect(draft.synced).toBe(false);

    const unsynced = OfflineDraftStore.getUnsyncedDrafts();
    expect(unsynced.length).toBe(1);
    expect(unsynced[0].payload.title).toBe('منشور غير متصل');
  });

  it('should mark draft as synced upon network reconnection', () => {
    OfflineDraftStore.saveDraft({
      id: 'draft-102',
      type: 'assignment_submission',
      payload: { assignmentId: 5, studentName: 'أحمد' }
    });

    OfflineDraftStore.markSynced('draft-102');
    const unsynced = OfflineDraftStore.getUnsyncedDrafts();
    expect(unsynced.length).toBe(0);

    const all = OfflineDraftStore.getAllDrafts();
    expect(all.length).toBe(1);
    expect(all[0].synced).toBe(true);
  });
});
