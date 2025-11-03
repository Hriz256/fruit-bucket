import { GameState, GameStateSnapshot, GameStatus } from '../interfaces/GameState.ts';

export class InMemoryGameState implements GameState {
  private _internalState: GameStateSnapshot = {
    score: 0,
    lives: 0,
    timeLeft: 0,
    status: GameStatus.Ready,
    caught: {},
    hazardsCaught: 0,
  };

  public get snapshot(): GameStateSnapshot {
    return this._internalState;
  }

  public updateScore(score: number): void {
    this._internalState = { ...this._internalState, score };
  }

  public updateLives(lives: number): void {
    this._internalState = { ...this._internalState, lives };
  }

  public updateTime(timeLeft: number): void {
    this._internalState = { ...this._internalState, timeLeft };
  }

  public updateStatus(status: GameStatus): void {
    this._internalState = { ...this._internalState, status };
  }

  public incrementCaught(itemId: string): void {
    const currentCount = this._internalState.caught[itemId] ?? 0;
    this._internalState = {
      ...this._internalState,
      caught: { ...this._internalState.caught, [itemId]: currentCount + 1 },
    };
  }

  public incrementHazards(): void {
    this._internalState = {
      ...this._internalState,
      hazardsCaught: this._internalState.hazardsCaught + 1,
    };
  }

  public reset(initialLives: number, sessionDuration: number): void {
    this._internalState = {
      score: 0,
      lives: initialLives,
      timeLeft: sessionDuration,
      status: GameStatus.Ready,
      caught: {},
      hazardsCaught: 0,
    };
  }
}
