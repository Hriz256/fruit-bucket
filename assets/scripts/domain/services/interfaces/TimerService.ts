export interface TimerService {
  readonly duration: number;
  readonly timeLeft: number;
  readonly isRunning: boolean;
  start(duration: number): void;
  tick(deltaTime: number): void;
  pause(): void;
  resume(): void;
  stop(): void;
}
