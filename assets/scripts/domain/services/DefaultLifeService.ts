import type { GameEventBus } from '../events/interfaces/GameEvents.ts';
import { LifeState } from '../interfaces/GameState.ts';
import type { LifeService } from './interfaces/LifeService.ts';

export class DefaultLifeService implements LifeService {
  private _currentLives = 0;

  public constructor(
    private readonly gameState: LifeState,
    private readonly eventBus: GameEventBus
  ) {}

  public get lives(): number {
    return this._currentLives;
  }

  public lose(amount: number): void {
    this._currentLives = Math.max(0, this._currentLives - amount);
    this.gameState.updateLives(this._currentLives);
    this.eventBus.publish({ type: 'LivesChanged', lives: this._currentLives });
  }

  public reset(initialLives: number): void {
    this._currentLives = initialLives;
    this.gameState.updateLives(initialLives);
    this.eventBus.publish({ type: 'LivesChanged', lives: initialLives });
  }
}
