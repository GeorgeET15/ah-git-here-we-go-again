import { GameEventUnion, EventHandler, EventType } from "./types";

/**
 * Event Bus - Central event system for game actions
 */
class EventBus {
  private handlers: Map<EventType, Set<EventHandler>> = new Map();
  private eventHistory: GameEventUnion[] = [];
  private maxHistorySize = 100;

  /**
   * Subscribe to an event type
   */
  on(eventType: EventType, handler: EventHandler): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    
    this.handlers.get(eventType)!.add(handler);
    
    // Return unsubscribe function
    return () => {
      this.handlers.get(eventType)?.delete(handler);
    };
  }

  /**
   * Subscribe to all events
   */
  onAll(handler: EventHandler): () => void {
    const unsubscribers: (() => void)[] = [];
    
    // Subscribe to all known event types
    const eventTypes: EventType[] = [
      "GAME/NEXT_STEP",
      "GAME/SET_ACT",
      "TERMINAL/RUN_COMMAND",
      "TIMELINE/APPLY_COMMIT",
      "EDITOR/UPDATE_CONTENT",
      "MERGE/RESOLVE_CONFLICT",
      "REBASE/APPLY_COMMIT",
      "CHERRYPICK/APPLY",
      "MAP/UNLOCK_LEVEL",
      "CONCEPT/SHOW",
      "CONCEPT/HIDE",
    ];
    
    eventTypes.forEach(type => {
      unsubscribers.push(this.on(type, handler));
    });
    
    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }

  /**
   * Emit an event
   */
  emit(event: GameEventUnion): void {
    // Add timestamp if not present
    if (!event.timestamp) {
      event.timestamp = Date.now();
    }
    
    // Add to history
    this.eventHistory.push(event);
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }
    
    // Call handlers for this event type
    const handlers = this.handlers.get(event.type);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(event);
        } catch (error) {
          console.error(`Error in event handler for ${event.type}:`, error);
        }
      });
    }
    
    // Call "all events" handlers
    const allHandlers = this.handlers.get("*" as EventType);
    if (allHandlers) {
      allHandlers.forEach(handler => {
        try {
          handler(event);
        } catch (error) {
          console.error(`Error in global event handler:`, error);
        }
      });
    }
  }

  /**
   * Get event history
   */
  getHistory(): GameEventUnion[] {
    return [...this.eventHistory];
  }

  /**
   * Clear event history
   */
  clearHistory(): void {
    this.eventHistory = [];
  }

  /**
   * Remove all handlers
   */
  clear(): void {
    this.handlers.clear();
  }
}

// Singleton instance
export const eventBus = new EventBus();


