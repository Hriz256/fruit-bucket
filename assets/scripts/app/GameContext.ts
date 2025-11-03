import type { Container } from 'inversify';
import type { GameConfig } from '../config/GameConfig.ts';
import type { GameEventBus } from '../domain/events/interfaces/GameEvents.ts';
import type { GameState } from '../domain/interfaces/GameState.ts';
import type { LifeService } from '../domain/services/interfaces/LifeService.ts';
import type { ScoreService } from '../domain/services/interfaces/ScoreService.ts';
import type { GameFlowService } from '../domain/services/interfaces/GameFlowService.ts';
import type { TimerService } from '../domain/services/interfaces/TimerService.ts';
import type { AudioService } from '../domain/services/interfaces/AudioService.ts';
import type { GameContext } from './interfaces/GameContext.ts';
import { TYPES } from './di/types.ts';

export const buildGameContext = (container: Container): GameContext => {
  const config = container.get<GameConfig>(TYPES.GameConfig);
  const state = container.get<GameState>(TYPES.GameState);
  const score = container.get<ScoreService>(TYPES.ScoreService);
  const lives = container.get<LifeService>(TYPES.LifeService);
  const timer = container.get<TimerService>(TYPES.TimerService);
  const events = container.get<GameEventBus>(TYPES.GameEventBus);
  const flow = container.get<GameFlowService>(TYPES.GameFlowService);
  const audio = container.get<AudioService>(TYPES.AudioService);

  return { container, config, state, score, lives, timer, events, flow, audio };
};
