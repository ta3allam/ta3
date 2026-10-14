/**
 * 🏛️ Ta3 (تعلّم) — CQRS Command & Event Bus Architecture
 * Typed command dispatching, domain event pub/sub, and audit history ledger.
 */

export interface Command<TType extends string = string, TPayload = any> {
  type: TType;
  payload: TPayload;
  timestamp: string;
  commandId: string;
}

export type CommandHandler<TCommand extends Command = Command, TResult = any> = (
  command: TCommand
) => Promise<TResult> | TResult;

export interface DomainEvent<TType extends string = string, TPayload = any> {
  type: TType;
  payload: TPayload;
  timestamp: string;
  eventId: string;
  correlationId?: string;
}

export type EventHandler<TEvent extends DomainEvent = DomainEvent> = (
  event: TEvent
) => Promise<void> | void;

/**
 * CommandBus routes typed commands to their registered domain handlers.
 */
export class CommandBus {
  private static handlers = new Map<string, CommandHandler>();

  public static register<TCommand extends Command, TResult = any>(
    type: TCommand['type'],
    handler: CommandHandler<TCommand, TResult>
  ): () => void {
    if (this.handlers.has(type)) {
      console.warn(`[CommandBus] Overwriting handler for command: ${type}`);
    }
    this.handlers.set(type, handler as CommandHandler);
    return () => {
      this.handlers.delete(type);
    };
  }

  public static async execute<TCommand extends Command, TResult = any>(
    command: TCommand
  ): Promise<TResult> {
    const handler = this.handlers.get(command.type);
    if (!handler) {
      throw new Error(`[CommandBus] No registered handler found for command type: "${command.type}"`);
    }
    return Promise.resolve(handler(command));
  }

  public static clear(): void {
    this.handlers.clear();
  }
}

/**
 * EventBus handles reactive asynchronous domain event broadcasting and replay.
 */
export class EventBus {
  private static listeners = new Map<string, Set<EventHandler>>();
  private static history: DomainEvent[] = [];
  private static maxHistory = 150;

  public static subscribe<TEvent extends DomainEvent>(
    type: TEvent['type'] | '*',
    handler: EventHandler<TEvent>
  ): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    const set = this.listeners.get(type)!;
    set.add(handler as EventHandler);

    return () => {
      set.delete(handler as EventHandler);
      if (set.size === 0) {
        this.listeners.delete(type);
      }
    };
  }

  public static async publish<TEvent extends DomainEvent>(event: TEvent): Promise<void> {
    this.history.push(event);
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    const specificSet = this.listeners.get(event.type) || new Set();
    const wildCardSet = this.listeners.get('*') || new Set();
    const allHandlers = [...specificSet, ...wildCardSet];

    await Promise.all(
      allHandlers.map((handler) => {
        try {
          return Promise.resolve(handler(event));
        } catch (err) {
          console.error(`[EventBus] Error in event listener for ${event.type}:`, err);
          return Promise.resolve();
        }
      })
    );
  }

  public static getHistory(): readonly DomainEvent[] {
    return [...this.history];
  }

  public static clear(): void {
    this.listeners.clear();
    this.history = [];
  }
}

/**
 * Creates a normalized command object.
 */
export function createCommand<TType extends string, TPayload>(
  type: TType,
  payload: TPayload
): Command<TType, TPayload> {
  return {
    type,
    payload,
    timestamp: new Date().toISOString(),
    commandId: `cmd_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
  };
}

/**
 * Creates a normalized domain event object.
 */
export function createDomainEvent<TType extends string, TPayload>(
  type: TType,
  payload: TPayload,
  correlationId?: string
): DomainEvent<TType, TPayload> {
  return {
    type,
    payload,
    timestamp: new Date().toISOString(),
    eventId: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    correlationId,
  };
}
