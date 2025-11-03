import type { GameStatus } from '../../interfaces/GameState.ts';

export interface GameFlowService {
  readonly status: GameStatus;
  startNewSession(): void;
  pause(): void;
  resume(): void;
  endGame(): void;
}
