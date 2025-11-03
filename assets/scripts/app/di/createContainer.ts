import 'reflect-metadata';
import { Container } from 'inversify';
import { GameConfig } from '../../config/GameConfig.ts';
import type { GameEventBus } from '../../domain/events/interfaces/GameEvents.ts';
import { SimpleGameEventBus } from '../../domain/events/SimpleGameEventBus.ts';
import { GameState } from '../../domain/interfaces/GameState.ts';
import { InMemoryGameState } from '../../domain/state/InMemoryGameState.ts';
import { DefaultLifeService } from '../../domain/services/DefaultLifeService.ts';
import { DefaultGameFlowService } from '../../domain/services/DefaultGameFlowService.ts';
import { DefaultScoreService } from '../../domain/services/DefaultScoreService.ts';
import { DefaultTimerService } from '../../domain/services/DefaultTimerService.ts';
import { DefaultAudioService } from '../../domain/services/DefaultAudioService.ts';
import type { LifeService } from '../../domain/services/interfaces/LifeService.ts';
import type { ScoreService } from '../../domain/services/interfaces/ScoreService.ts';
import type { GameFlowService } from '../../domain/services/interfaces/GameFlowService.ts';
import type { TimerService } from '../../domain/services/interfaces/TimerService.ts';
import type { AudioService } from '../../domain/services/interfaces/AudioService.ts';
import { TYPES } from './types.ts';

/**
 * Creates a new DI container for a game session.
 * Services are NOT registered as singletons to allow multiple independent game sessions
 * and proper cleanup/testing. Each call creates fresh instances.
 */
export const createGameContainer = (config: GameConfig): Container => {
  const container = new Container();

  // Config is immutable and can be shared
  container.bind<GameConfig>(TYPES.GameConfig).toConstantValue(config);

  // Create instances explicitly (no singleton scope)
  const eventBus = new SimpleGameEventBus();
  const gameState = new InMemoryGameState();

  container.bind<GameEventBus>(TYPES.GameEventBus).toConstantValue(eventBus);
  container.bind<GameState>(TYPES.GameState).toConstantValue(gameState);

  // Create service instances explicitly (no singleton lifecycle)
  const scoreService = new DefaultScoreService(gameState, eventBus);
  const lifeService = new DefaultLifeService(gameState, eventBus);
  const timerService = new DefaultTimerService(gameState, eventBus);
  const audioService = new DefaultAudioService(config);
  const gameFlowService = new DefaultGameFlowService(
    config,
    gameState,
    scoreService,
    lifeService,
    timerService,
    eventBus
  );

  container.bind<ScoreService>(TYPES.ScoreService).toConstantValue(scoreService);
  container.bind<LifeService>(TYPES.LifeService).toConstantValue(lifeService);
  container.bind<TimerService>(TYPES.TimerService).toConstantValue(timerService);
  container.bind<GameFlowService>(TYPES.GameFlowService).toConstantValue(gameFlowService);
  container.bind<AudioService>(TYPES.AudioService).toConstantValue(audioService);

  return container;
};
