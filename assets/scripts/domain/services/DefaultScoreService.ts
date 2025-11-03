import type { GameEventBus } from '../events/interfaces/GameEvents.ts';
import { ScoreState, StatisticsState } from '../interfaces/GameState.ts';
import type { ScoreService } from './interfaces/ScoreService.ts';

export class DefaultScoreService implements ScoreService {
  private _currentScore = 0;

  public constructor(
    private readonly gameState: ScoreState & StatisticsState,
    private readonly eventBus: GameEventBus
  ) {}

  public get score(): number {
    return this._currentScore;
  }

  public add(points: number, itemId: string): void {
    this._currentScore = Math.max(0, this._currentScore + points);
    this.gameState.updateScore(this._currentScore);
    this.gameState.incrementCaught(itemId);
    this.eventBus.publish({ type: 'ScoreChanged', score: this._currentScore });
  }

  public resetCombo(): void {}

  public reset(): void {
    this._currentScore = 0;
    this.gameState.updateScore(0);
    this.eventBus.publish({ type: 'ScoreChanged', score: 0 });
  }
}
