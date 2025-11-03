import type { GameEventBus } from '../events/interfaces/GameEvents.ts';
import { TimerState } from '../interfaces/GameState.ts';
import type { TimerService } from './interfaces/TimerService.ts';

export class DefaultTimerService implements TimerService {
  private _totalDuration = 0;
  private _remainingTime = 0;
  private _running = false;

  public constructor(
    private readonly gameState: TimerState,
    private readonly eventBus: GameEventBus
  ) {}

  public get duration(): number {
    return this._totalDuration;
  }

  public get timeLeft(): number {
    return this._remainingTime;
  }

  public get isRunning(): boolean {
    return this._running;
  }

  public start(duration: number): void {
    this._totalDuration = duration;
    this._remainingTime = duration;
    this._running = true;
    this.gameState.updateTime(duration);
    this.eventBus.publish({ type: 'TimerChanged', timeLeft: duration });
  }

  public tick(deltaTime: number): void {
    if (!this._running) {
      return;
    }

    this._remainingTime = Math.max(0, this._remainingTime - deltaTime);
    this.gameState.updateTime(this._remainingTime);
    this.eventBus.publish({ type: 'TimerChanged', timeLeft: this._remainingTime });

    if (this._remainingTime <= 0) {
      this._running = false;
    }
  }

  public pause(): void {
    this._running = false;
  }

  public resume(): void {
    if (this._remainingTime > 0) {
      this._running = true;
    }
  }

  public stop(): void {
    this._running = false;
    this._remainingTime = 0;
    this.gameState.updateTime(0);
    this.eventBus.publish({ type: 'TimerChanged', timeLeft: 0 });
  }
}
