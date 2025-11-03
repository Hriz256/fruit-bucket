import type { Container } from 'inversify';
import type { GameConfig } from '../../config/GameConfig.ts';
import type { GameEventBus } from '../../domain/events/interfaces/GameEvents.ts';
import type { GameState } from '../../domain/interfaces/GameState.ts';
import type { LifeService } from '../../domain/services/interfaces/LifeService.ts';
import type { ScoreService } from '../../domain/services/interfaces/ScoreService.ts';
import type { GameFlowService } from '../../domain/services/interfaces/GameFlowService.ts';
import type { TimerService } from '../../domain/services/interfaces/TimerService.ts';
import type { AudioService } from '../../domain/services/interfaces/AudioService.ts';
import type { GameWorld } from '../../ecs/types.ts';

export interface GameContext {
  container: Container;
  config: GameConfig;
  state: GameState;
  score: ScoreService;
  lives: LifeService;
  timer: TimerService;
  events: GameEventBus;
  flow: GameFlowService;
  audio: AudioService;
  world?: GameWorld;
}
