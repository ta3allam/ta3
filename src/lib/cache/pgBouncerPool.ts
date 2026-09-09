export interface PoolConfig {
  maxConnections: number; // e.g. 20 client connections pooled down to Postgres
  acquireTimeoutMs: number; // Timeout to acquire pooled client
}

export interface PoolStats {
  activeConnections: number;
  idleConnections: number;
  waitingQueueLength: number;
}

export class PgBouncerPoolManager {
  private maxConnections: number;
  private acquireTimeoutMs: number;
  private activeConnections: number = 0;
  private waitingQueue: Array<() => void> = [];

  constructor(config?: Partial<PoolConfig>) {
    this.maxConnections = config?.maxConnections || 10;
    this.acquireTimeoutMs = config?.acquireTimeoutMs || 3000;
  }

  /**
   * Acquire a pooled database connection
   */
  public async acquireConnection(): Promise<{ release: () => void }> {
    if (this.activeConnections < this.maxConnections) {
      this.activeConnections++;
      return {
        release: () => this.releaseConnection()
      };
    }

    // Enqueue request if pool is at max capacity
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        const idx = this.waitingQueue.indexOf(grantConnection);
        if (idx >= 0) {
          this.waitingQueue.splice(idx, 1);
        }
        reject(new Error('PgBouncer connection acquisition timeout exceeded'));
      }, this.acquireTimeoutMs);

      const grantConnection = () => {
        clearTimeout(timeoutId);
        this.activeConnections++;
        resolve({
          release: () => this.releaseConnection()
        });
      };

      this.waitingQueue.push(grantConnection);
    });
  }

  /**
   * Release connection back to pool
   */
  private releaseConnection(): void {
    this.activeConnections = Math.max(0, this.activeConnections - 1);
    if (this.waitingQueue.length > 0) {
      const nextInLine = this.waitingQueue.shift();
      if (nextInLine) {
        nextInLine();
      }
    }
  }

  /**
   * Execute query with managed pooled connection
   */
  public async executeQuery<T>(queryFn: () => Promise<T>): Promise<T> {
    const conn = await this.acquireConnection();
    try {
      return await queryFn();
    } finally {
      conn.release();
    }
  }

  /**
   * Get connection pool statistics
   */
  public getStats(): PoolStats {
    return {
      activeConnections: this.activeConnections,
      idleConnections: Math.max(0, this.maxConnections - this.activeConnections),
      waitingQueueLength: this.waitingQueue.length
    };
  }
}

export const pgBouncerPool = new PgBouncerPoolManager();
