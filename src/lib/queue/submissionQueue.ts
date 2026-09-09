export interface QueueJob<T> {
  id: string;
  type: string;
  data: T;
  attempts: number;
  maxAttempts: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'dlq';
  createdAt: number;
  processedAt?: number;
  error?: string;
}

export interface QueueMetrics {
  pendingCount: number;
  processingCount: number;
  completedCount: number;
  failedCount: number;
  dlqCount: number;
}

export class AsyncSubmissionQueue<T = any> {
  private queue: QueueJob<T>[] = [];
  private concurrency: number;
  private isWorkerRunning: boolean = false;
  private processor?: (job: QueueJob<T>) => Promise<void>;

  constructor(concurrency: number = 5) {
    this.concurrency = concurrency;
  }

  /**
   * Enqueue a new async background job
   */
  public async add(type: string, data: T, maxAttempts: number = 3): Promise<QueueJob<T>> {
    const job: QueueJob<T> = {
      id: `job-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type,
      data,
      attempts: 0,
      maxAttempts,
      status: 'pending',
      createdAt: Date.now()
    };

    this.queue.push(job);
    this.triggerWorker();
    return job;
  }

  /**
   * Register async worker job processor function
   */
  public process(processor: (job: QueueJob<T>) => Promise<void>): void {
    this.processor = processor;
    this.triggerWorker();
  }

  /**
   * Worker loop with concurrency limiting
   */
  private async triggerWorker(): Promise<void> {
    if (this.isWorkerRunning || !this.processor) return;
    this.isWorkerRunning = true;

    try {
      while (true) {
        const activeJobs = this.queue.filter(j => j.status === 'processing');
        if (activeJobs.length >= this.concurrency) {
          await new Promise(r => setTimeout(r, 20));
          continue;
        }

        const nextJob = this.queue.find(j => j.status === 'pending');
        if (!nextJob) {
          // No more pending jobs
          break;
        }

        nextJob.status = 'processing';
        nextJob.attempts++;

        // Process job asynchronously
        (async (job: QueueJob<T>) => {
          try {
            await this.processor!(job);
            job.status = 'completed';
            job.processedAt = Date.now();
          } catch (err: any) {
            if (job.attempts < job.maxAttempts) {
              job.status = 'pending'; // Retry
            } else {
              job.status = 'dlq'; // Move to Dead-Letter Queue
              job.error = err?.message || 'Unknown processing error';
            }
          }
        })(nextJob);
      }
    } finally {
      this.isWorkerRunning = false;
    }
  }

  /**
   * Get queue health and telemetry metrics
   */
  public getMetrics(): QueueMetrics {
    return {
      pendingCount: this.queue.filter(j => j.status === 'pending').length,
      processingCount: this.queue.filter(j => j.status === 'processing').length,
      completedCount: this.queue.filter(j => j.status === 'completed').length,
      failedCount: this.queue.filter(j => j.status === 'failed').length,
      dlqCount: this.queue.filter(j => j.status === 'dlq').length
    };
  }

  /**
   * Drain and clear queue
   */
  public clear(): void {
    this.queue = [];
  }
}

export const submissionQueue = new AsyncSubmissionQueue();
