import type { GameEvent } from '../../domain/events/interfaces/GameEvents.ts';
import type { GameContext } from '../interfaces/GameContext.ts';
import { GameStatus } from '../../domain/interfaces/GameState.ts';
import type { LivesView } from '../../ui/LivesView.ts';
import type { ScoreView } from '../../ui/ScoreView.ts';
import type { TimerView } from '../../ui/TimerView.ts';
import type { Node } from 'cc';
import { AudioEventHandler } from './AudioEventHandler.ts';

type EventHandler<T extends GameEvent = GameEvent> = (event: T) => void;

/**
 * GameEventRouter connects domain events to UI updates.
 * Audio handling is delegated to AudioEventHandler (SRP).
 */
export class GameEventRouter {
  private _unsubscribe: (() => void) | null = null;
  private readonly _handlers: Partial<Record<GameEvent['type'], EventHandler>>;
  private readonly _audioHandler: AudioEventHandler;

  public constructor(
    private readonly context: GameContext,
    private readonly scoreView: ScoreView | null,
    private readonly livesView: LivesView | null,
    private readonly timerView: TimerView | null,
    private readonly gameOverLayer: Node | null
  ) {
    this._audioHandler = new AudioEventHandler(context.audio);

    this._handlers = {
      ScoreChanged: (event) => this.handleScoreChanged(event as Extract<GameEvent, { type: 'ScoreChanged' }>),
      LivesChanged: (event) => this.handleLivesChanged(event as Extract<GameEvent, { type: 'LivesChanged' }>),
      TimerChanged: (event) => this.handleTimerChanged(event as Extract<GameEvent, { type: 'TimerChanged' }>),
      GameStatusChanged: (event) =>
        this.handleGameStatusChanged(event as Extract<GameEvent, { type: 'GameStatusChanged' }>),
      GameEnded: () => this.handleGameEnded(),
    };
  }

  public bind(): void {
    this._unsubscribe = this.context.events.subscribe((event) => {
      this._handlers[event.type]?.(event);
    });
  }

  public unbind(): void {
    if (this._unsubscribe) {
      this._unsubscribe();
      this._unsubscribe = null;
    }

    this._audioHandler.reset();
  }

  private handleScoreChanged(event: Extract<GameEvent, { type: 'ScoreChanged' }>): void {
    this._audioHandler.handleScoreChanged(event.score);
    this.scoreView?.setScore(event.score);
  }

  private handleLivesChanged(event: Extract<GameEvent, { type: 'LivesChanged' }>): void {
    this._audioHandler.handleLivesChanged(event.lives);
    this.livesView?.setLives(event.lives);
  }

  private handleTimerChanged(event: Extract<GameEvent, { type: 'TimerChanged' }>): void {
    this.timerView?.setTime(event.timeLeft);
  }

  private handleGameStatusChanged(event: Extract<GameEvent, { type: 'GameStatusChanged' }>): void {
    if (event.status === GameStatus.Playing) {
      if (this.gameOverLayer) {
        this.gameOverLayer.active = false;
      }
      this._audioHandler.handleGameStarted();
    }
  }

  private handleGameEnded(): void {
    if (this.gameOverLayer) {
      this.gameOverLayer.active = true;
    }

    this._audioHandler.handleGameEnded();
  }
}
