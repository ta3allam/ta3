/**
 * Ta3 (تعلّم) - Command Query Responsibility Segregation (CQRS) Bus
 * Separates atomic mutation Commands from fast, read-optimized Query view models.
 */

import { idempotencyManager } from '../idempotency';

export interface CommandResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  commandId: string;
  idempotencyKey?: string;
  timestamp: string;
}

export interface QueryResult<T = any> {
  data: T;
  cached: boolean;
  timestamp: string;
}

export interface ICommand<TPayload = any> {
  type: string;
  payload: TPayload;
  commandId: string;
  idempotencyKey?: string;
  executedBy: string;
}

export interface IQuery<TParams = any> {
  type: string;
  params: TParams;
}

class CQRSBus {
  private commandHandlers: Map<string, (command: ICommand) => Promise<CommandResult>> = new Map();
  private queryHandlers: Map<string, (query: IQuery) => Promise<QueryResult>> = new Map();

  registerCommand(type: string, handler: (command: ICommand) => Promise<CommandResult>) {
    this.commandHandlers.set(type, handler);
  }

  registerQuery(type: string, handler: (query: IQuery) => Promise<QueryResult>) {
    this.queryHandlers.set(type, handler);
  }

  async dispatchCommand<T = any>(
    type: string,
    payload: any,
    executedBy: string,
    idempotencyKey?: string
  ): Promise<CommandResult<T>> {
    const handler = this.commandHandlers.get(type);
    const commandId = `cmd_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    if (!handler) {
      return {
        success: false,
        error: `No handler registered for command type: ${type}`,
        commandId,
        timestamp: new Date().toISOString()
      };
    }

    const key = idempotencyKey || idempotencyManager.generateKey(type, payload);

    try {
      return await idempotencyManager.execute(key, async () => {
        const result = await handler({ type, payload, commandId, idempotencyKey: key, executedBy });
        return {
          ...result,
          idempotencyKey: key,
        };
      });
    } catch (e: any) {
      return {
        success: false,
        error: e.message || 'Command execution failed',
        commandId,
        idempotencyKey: key,
        timestamp: new Date().toISOString()
      };
    }
  }

  async query<T = any>(type: string, params: any): Promise<QueryResult<T>> {
    const handler = this.queryHandlers.get(type);
    if (!handler) {
      throw new Error(`No handler registered for query type: ${type}`);
    }
    return await handler({ type, params });
  }
}

export const cqrsBus = new CQRSBus();
