import { GameStateSnapshot, GameStatus } from '../../interfaces/GameState.ts';

export interface ScoreChangedEvent {
  type: 'ScoreChanged';
  score: number;
}

export interface LivesChangedEvent {
  type: 'LivesChanged';
  lives: number;
}

export interface TimerChangedEvent {
  type: 'TimerChanged';
  timeLeft: number;
}

export interface GameStatusChangedEvent {
  type: 'GameStatusChanged';
  status: GameStatus;
}

export interface GameEndedEvent {
  type: 'GameEnded';
  finalState: GameStateSnapshot;
}

export type GameEvent =
  | ScoreChangedEvent
  | LivesChangedEvent
  | TimerChangedEvent
  | GameStatusChangedEvent
  | GameEndedEvent;

export interface GameEventBus {
  publish(event: GameEvent): void;
  subscribe(handler: (event: GameEvent) => void): () => void;
}
