export interface OfflineDraft {
  id: string;
  type: 'post' | 'assignment_submission' | 'comment';
  targetId?: string | number;
  payload: any;
  createdAt: number;
  synced: boolean;
}

const STORAGE_KEY = 'ta3_offline_drafts_v1';
let memoryStore: OfflineDraft[] = [];

export class OfflineDraftStore {
  static saveDraft(draft: Omit<OfflineDraft, 'createdAt' | 'synced'>): OfflineDraft {
    const fullDraft: OfflineDraft = {
      ...draft,
      createdAt: Date.now(),
      synced: false
    };

    const drafts = this.getAllDrafts();
    const existingIdx = drafts.findIndex(d => d.id === draft.id);

    if (existingIdx >= 0) {
      drafts[existingIdx] = fullDraft;
    } else {
      drafts.push(fullDraft);
    }

    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
      } catch (e) {
        console.warn('[OfflineDraftStore] Failed to write to storage:', e);
      }
    } else {
      memoryStore = drafts;
    }

    return fullDraft;
  }

  static getAllDrafts(): OfflineDraft[] {
    if (typeof localStorage !== 'undefined') {
      try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
      } catch (e) {
        return [];
      }
    }
    return memoryStore;
  }

  static getUnsyncedDrafts(): OfflineDraft[] {
    return this.getAllDrafts().filter(d => !d.synced);
  }

  static markSynced(draftId: string): void {
    const drafts = this.getAllDrafts().map(d => 
      d.id === draftId ? { ...d, synced: true } : d
    );
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
      } catch (e) {}
    } else {
      memoryStore = drafts;
    }
  }

  static removeDraft(draftId: string): void {
    const drafts = this.getAllDrafts().filter(d => d.id !== draftId);
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
      } catch (e) {}
    } else {
      memoryStore = drafts;
    }
  }

  static clearAll(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
    }
    memoryStore = [];
  }
}
