/**
 * Asynchronous IndexedDB Storage Adapter for Ta3 LMS
 *
 * Provides high-throughput, non-blocking offline storage for large lecture materials,
 * PDF documents, and cached media assets with in-memory fallback for headless test runners.
 */

export interface OfflineMaterialRecord {
  id: string;
  courseId: number;
  lectureId: number;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  blob?: Blob | ArrayBuffer | string;
  updatedAt: number;
}

export interface CachedMediaMetadata {
  url: string;
  sizeBytes: number;
  mimeType: string;
  cachedAt: number;
  etag?: string;
}

const DB_NAME = 'ta3_lms_offline_vault';
const DB_VERSION = 1;
const STORE_MATERIALS = 'materials';
const STORE_MEDIA_META = 'media_metadata';

// In-memory fallback stores for test/SSR environments
const memoryMaterials = new Map<string, OfflineMaterialRecord>();
const memoryMedia = new Map<string, CachedMediaMetadata>();

export function isIndexedDBSupported(): boolean {
  return typeof window !== 'undefined' && typeof window.indexedDB !== 'undefined';
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!isIndexedDBSupported()) {
      reject(new Error('IndexedDB is not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORE_MATERIALS)) {
        const materialStore = db.createObjectStore(STORE_MATERIALS, { keyPath: 'id' });
        materialStore.createIndex('courseId', 'courseId', { unique: false });
        materialStore.createIndex('lectureId', 'lectureId', { unique: false });
        materialStore.createIndex('updatedAt', 'updatedAt', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORE_MEDIA_META)) {
        const mediaStore = db.createObjectStore(STORE_MEDIA_META, { keyPath: 'url' });
        mediaStore.createIndex('cachedAt', 'cachedAt', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export const IndexedDbAdapter = {
  /**
   * Persists an offline material record
   */
  async saveMaterial(material: OfflineMaterialRecord): Promise<void> {
    if (!isIndexedDBSupported()) {
      memoryMaterials.set(material.id, { ...material });
      return;
    }

    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_MATERIALS, 'readwrite');
      const store = tx.objectStore(STORE_MATERIALS);
      const req = store.put(material);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  },

  /**
   * Retrieves a material by its unique ID
   */
  async getMaterial(id: string): Promise<OfflineMaterialRecord | undefined> {
    if (!isIndexedDBSupported()) {
      return memoryMaterials.get(id);
    }

    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_MATERIALS, 'readonly');
      const store = tx.objectStore(STORE_MATERIALS);
      const req = store.get(id);

      req.onsuccess = () => resolve(req.result || undefined);
      req.onerror = () => reject(req.error);
    });
  },

  /**
   * Retrieves all materials associated with a given course and lecture
   */
  async getMaterialsByLecture(courseId: number, lectureId: number): Promise<OfflineMaterialRecord[]> {
    if (!isIndexedDBSupported()) {
      return Array.from(memoryMaterials.values()).filter(
        (m) => m.courseId === courseId && m.lectureId === lectureId
      );
    }

    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_MATERIALS, 'readonly');
      const store = tx.objectStore(STORE_MATERIALS);
      const index = store.index('courseId');
      const req = index.getAll(courseId);

      req.onsuccess = () => {
        const results = (req.result as OfflineMaterialRecord[]) || [];
        resolve(results.filter((m) => m.lectureId === lectureId));
      };
      req.onerror = () => reject(req.error);
    });
  },

  /**
   * Deletes a material from offline storage
   */
  async deleteMaterial(id: string): Promise<void> {
    if (!isIndexedDBSupported()) {
      memoryMaterials.delete(id);
      return;
    }

    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_MATERIALS, 'readwrite');
      const store = tx.objectStore(STORE_MATERIALS);
      const req = store.delete(id);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  },

  /**
   * Clears all stored materials (e.g. on logout or cache purge)
   */
  async clearMaterials(): Promise<void> {
    if (!isIndexedDBSupported()) {
      memoryMaterials.clear();
      return;
    }

    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_MATERIALS, 'readwrite');
      const store = tx.objectStore(STORE_MATERIALS);
      const req = store.clear();

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  },

  /**
   * Caches media metadata for responsive cache-aside retrieval
   */
  async saveMediaMetadata(meta: CachedMediaMetadata): Promise<void> {
    if (!isIndexedDBSupported()) {
      memoryMedia.set(meta.url, { ...meta });
      return;
    }

    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_MEDIA_META, 'readwrite');
      const store = tx.objectStore(STORE_MEDIA_META);
      const req = store.put(meta);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  },

  /**
   * Retrieves media metadata by URL
   */
  async getMediaMetadata(url: string): Promise<CachedMediaMetadata | undefined> {
    if (!isIndexedDBSupported()) {
      return memoryMedia.get(url);
    }

    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_MEDIA_META, 'readonly');
      const store = tx.objectStore(STORE_MEDIA_META);
      const req = store.get(url);

      req.onsuccess = () => resolve(req.result || undefined);
      req.onerror = () => reject(req.error);
    });
  },

  /**
   * Resets in-memory stores (primarily for testing harnesses)
   */
  _resetMemoryStore(): void {
    memoryMaterials.clear();
    memoryMedia.clear();
  },
};
