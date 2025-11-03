import type { GameEventBus, GameEvent } from '../../domain/events/interfaces/GameEvents.ts';
import type { GameFlowService } from '../../domain/services/interfaces/GameFlowService.ts';
import { GameStatus } from '../../domain/interfaces/GameState.ts';
import type { ISystem } from '../interfaces/ISystem.ts';

type RuleHandler = (event: GameEvent) => void;

/**
 * GameRulesSystem enforces game rules and win/lose conditions.
 * Listens to domain events and triggers game state transitions.
 */
export class GameRulesSystem implements ISystem {
  private readonly _handlers: Partial<Record<GameEvent['type'], RuleHandler>>;
  private _unsubscribe: (() => void) | null = null;

  public constructor(
    private readonly eventBus: GameEventBus,
    private readonly flowService: GameFlowService
  ) {
    this._handlers = {
      LivesChanged: (event) => this.checkGameOver(event as Extract<GameEvent, { type: 'LivesChanged' }>),
    };
  }

  public init(): void {
    this._unsubscribe = this.eventBus.subscribe((event) => {
      this._handlers[event.type]?.(event);
    });
  }

  public update(): void {
    // This system is event-driven, no per-frame updates needed
  }

  public dispose(): void {
    this._unsubscribe?.();
    this._unsubscribe = null;
  }

  private checkGameOver(event: Extract<GameEvent, { type: 'LivesChanged' }>): void {
    if (event.lives <= 0 && this.flowService.status === GameStatus.Playing) {
      this.flowService.endGame();
    }
  }
}
