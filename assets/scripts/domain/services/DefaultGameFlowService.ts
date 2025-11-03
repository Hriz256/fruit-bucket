import { GameConfig } from '../../config/GameConfig.ts';
import type { GameEventBus } from '../events/interfaces/GameEvents.ts';
import { ReadableGameState, StatusState, ResettableState, GameStatus } from '../interfaces/GameState.ts';
import type { LifeService } from './interfaces/LifeService.ts';
import type { ScoreService } from './interfaces/ScoreService.ts';
import type { TimerService } from './interfaces/TimerService.ts';
import type { GameFlowService } from './interfaces/GameFlowService.ts';

export class DefaultGameFlowService implements GameFlowService {
  public constructor(
    private readonly config: GameConfig,
    private readonly gameState: ReadableGameState & StatusState & ResettableState,
    private readonly scoreService: ScoreService,
    private readonly lifeService: LifeService,
    private readonly timerService: TimerService,
    private readonly events: GameEventBus
  ) {}

  public get status(): GameStatus {
    return this.gameState.snapshot.status;
  }

  public startNewSession(): void {
    this.scoreService.reset();
    this.lifeService.reset(this.config.tuning.initialLives);
    this.timerService.start(this.config.tuning.sessionDuration);
    this.gameState.reset(this.config.tuning.initialLives, this.config.tuning.sessionDuration);
    this.gameState.updateStatus(GameStatus.Playing);
    this.events.publish({ type: 'GameStatusChanged', status: GameStatus.Playing });
  }

  public pause(): void {
    if (this.status !== GameStatus.Playing) return;

    this.timerService.pause();
    this.gameState.updateStatus(GameStatus.Paused);
    this.events.publish({ type: 'GameStatusChanged', status: GameStatus.Paused });
  }

  public resume(): void {
    if (this.status !== GameStatus.Paused) return;

    this.timerService.resume();
    this.gameState.updateStatus(GameStatus.Playing);
    this.events.publish({ type: 'GameStatusChanged', status: GameStatus.Playing });
  }

  public endGame(): void {
    if (this.status === GameStatus.GameOver) return;

    this.timerService.stop();
    this.gameState.updateStatus(GameStatus.GameOver);
    this.events.publish({ type: 'GameStatusChanged', status: GameStatus.GameOver });
    this.events.publish({ type: 'GameEnded', finalState: this.gameState.snapshot });
  }
}
