import type { GameEvent, GameEventBus } from './interfaces/GameEvents.ts';

export class SimpleGameEventBus implements GameEventBus {
  private _listeners = new Set<(event: GameEvent) => void>();

  public publish(event: GameEvent): void {
    this._listeners.forEach((listener) => listener(event));
  }

  public subscribe(handler: (event: GameEvent) => void): () => void {
    this._listeners.add(handler);

    return () => this._listeners.delete(handler);
  }
}
