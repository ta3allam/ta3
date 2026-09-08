export interface ChunkUploadProgress {
  uploadedBytes: number;
  totalBytes: number;
  percentage: number;
  currentChunk: number;
  totalChunks: number;
  status: 'idle' | 'uploading' | 'paused' | 'completed' | 'error';
  errorMessage?: string;
}

export interface ResumableUploadOptions {
  chunkSize?: number; // Default 512KB = 512 * 1024
  maxRetries?: number; // Default 3 retries with exponential backoff
  onProgress?: (progress: ChunkUploadProgress) => void;
  onSuccess?: (fileUrl: string) => void;
  onError?: (error: string) => void;
}

export class ResumableUploaderEngine {
  private file: File;
  private chunkSize: number;
  private maxRetries: number;
  private currentOffset: number = 0;
  private isPaused: boolean = false;
  private isAborted: boolean = false;
  private onProgress?: (progress: ChunkUploadProgress) => void;
  private onSuccess?: (fileUrl: string) => void;
  private onError?: (error: string) => void;

  constructor(file: File, options?: ResumableUploadOptions) {
    this.file = file;
    this.chunkSize = options?.chunkSize || 512 * 1024; // 512KB chunks for unstable 3G networks
    this.maxRetries = options?.maxRetries || 3;
    this.onProgress = options?.onProgress;
    this.onSuccess = options?.onSuccess;
    this.onError = options?.onError;
  }

  public getTotalChunks(): number {
    return Math.ceil(this.file.size / this.chunkSize) || 1;
  }

  public getChunkSlice(chunkIndex: number): Blob {
    const start = chunkIndex * this.chunkSize;
    const end = Math.min(start + this.chunkSize, this.file.size);
    return this.file.slice(start, end);
  }

  public async startUpload(): Promise<void> {
    this.isPaused = false;
    this.isAborted = false;
    const totalBytes = this.file.size;
    const totalChunks = this.getTotalChunks();

    let chunkIdx = Math.floor(this.currentOffset / this.chunkSize);

    while (chunkIdx < totalChunks) {
      if (this.isPaused) {
        this.emitProgress(this.currentOffset, totalBytes, chunkIdx, totalChunks, 'paused');
        return;
      }

      if (this.isAborted) {
        this.emitProgress(this.currentOffset, totalBytes, chunkIdx, totalChunks, 'idle');
        return;
      }

      const chunk = this.getChunkSlice(chunkIdx);
      let attempts = 0;
      let chunkUploaded = false;

      while (attempts < this.maxRetries && !chunkUploaded) {
        try {
          // Simulate simulated 3G chunk transmission
          await new Promise((resolve) => setTimeout(resolve, 80));
          this.currentOffset += chunk.size;
          chunkUploaded = true;
          this.emitProgress(this.currentOffset, totalBytes, chunkIdx + 1, totalChunks, 'uploading');
        } catch (e) {
          attempts++;
          if (attempts >= this.maxRetries) {
            this.emitProgress(this.currentOffset, totalBytes, chunkIdx, totalChunks, 'error', 'فشل في رفع جزء من الملف بعد 3 محاولات');
            this.onError?.('Network error on 3G transmission');
            return;
          }
          // Exponential backoff delay
          await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempts) * 100));
        }
      }

      chunkIdx++;
    }

    this.emitProgress(totalBytes, totalBytes, totalChunks, totalChunks, 'completed');
    this.onSuccess?.(`https://storage.ta3allam.app/submissions/${this.file.name}`);
  }

  public pause(): void {
    this.isPaused = true;
  }

  public resume(): void {
    if (this.isPaused) {
      this.startUpload();
    }
  }

  public abort(): void {
    this.isAborted = true;
    this.currentOffset = 0;
  }

  private emitProgress(
    uploadedBytes: number,
    totalBytes: number,
    currentChunk: number,
    totalChunks: number,
    status: ChunkUploadProgress['status'],
    errorMessage?: string
  ) {
    const percentage = totalBytes > 0 ? Math.min(100, Math.round((uploadedBytes / totalBytes) * 100)) : 100;
    this.onProgress?.({
      uploadedBytes,
      totalBytes,
      percentage,
      currentChunk,
      totalChunks,
      status,
      errorMessage
    });
  }
}
