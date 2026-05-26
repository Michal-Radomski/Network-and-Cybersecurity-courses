//* nodemon pubsub.ts
type EventHandler<T = any> = (payload: T) => void;

class PubSub {
  private events: Map<string, EventHandler[]> = new Map();

  subscribe<T>(eventName: string, handler: EventHandler<T>): () => void {
    const handlers = this.events.get(eventName) || [];

    handlers.push(handler as EventHandler);

    this.events.set(eventName, handlers);

    // Return unsubscribe function
    return () => {
      const updatedHandlers = (this.events.get(eventName) || []).filter((h) => h !== handler);

      this.events.set(eventName, updatedHandlers);
    };
  }

  publish<T>(eventName: string, payload: T): void {
    const handlers = this.events.get(eventName);

    if (!handlers) return;

    handlers.forEach((handler) => handler(payload));
  }
}

export default PubSub;
