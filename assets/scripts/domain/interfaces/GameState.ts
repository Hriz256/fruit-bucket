export enum GameStatus {
  Ready = 'ready',
  Playing = 'playing',
  Paused = 'paused',
  GameOver = 'game-over',
}

export interface CaughtStatistics {
  [itemId: string]: number;
}

export interface GameStateSnapshot {
  score: number;
  lives: number;
  timeLeft: number;
  status: GameStatus;
  caught: CaughtStatistics;
  hazardsCaught: number;
}

export interface ScoreState {
  updateScore(score: number): void;
}

export interface LifeState {
  updateLives(lives: number): void;
}

export interface TimerState {
  updateTime(timeLeft: number): void;
}

export interface StatusState {
  updateStatus(status: GameStatus): void;
}

export interface StatisticsState {
  incrementCaught(itemId: string): void;
  incrementHazards(): void;
}

export interface ReadableGameState {
  readonly snapshot: GameStateSnapshot;
}

export interface ResettableState {
  reset(initialLives: number, sessionDuration: number): void;
}

export interface GameState
  extends ReadableGameState,
    ScoreState,
    LifeState,
    TimerState,
    StatusState,
    StatisticsState,
    ResettableState {}
