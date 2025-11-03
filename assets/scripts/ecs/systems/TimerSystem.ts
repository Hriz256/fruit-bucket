import { ReadableGameState, GameStatus } from '../../domain/interfaces/GameState.ts';
import type { GameFlowService } from '../../domain/services/interfaces/GameFlowService.ts';
import type { TimerService } from '../../domain/services/interfaces/TimerService.ts';
import type { ISystem } from '../interfaces/ISystem.ts';

export class TimerSystem implements ISystem {
  public constructor(
    private readonly gameState: ReadableGameState,
    private readonly timerService: TimerService,
    private readonly flow: GameFlowService
  ) {}

  public update(deltaTime: number): void {
    if (this.gameState.snapshot.status !== GameStatus.Playing) {
      return;
    }

    this.timerService.tick(deltaTime);

    if (this.timerService.timeLeft <= 0) {
      this.flow.endGame();
    }
  }
}
