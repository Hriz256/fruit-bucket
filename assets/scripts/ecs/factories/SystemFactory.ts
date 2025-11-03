import type { GameWorld } from '../types.ts';
import type { GameContext } from '../../app/interfaces/GameContext.ts';
import type { IEntityFactory } from '../interfaces/IEntityFactory.ts';
import type { ISpawnFactory } from '../interfaces/ISpawnFactory.ts';
import type { IRenderer } from '../interfaces/IRenderer.ts';
import type { IAudioPlayer } from '../interfaces/IAudioPlayer.ts';
import type { DespawnCallback } from '../systems/interfaces/DespawnCallback.ts';
import { InputSystem } from '../systems/InputSystem.ts';
import { SpawnSystem } from '../systems/SpawnSystem.ts';
import { TrajectorySystem } from '../systems/TrajectorySystem.ts';
import { MovementSystem } from '../systems/MovementSystem.ts';
import { VisualSyncSystem } from '../systems/VisualSyncSystem.ts';
import { CollisionSystem } from '../systems/CollisionSystem.ts';
import { OutcomeSystem } from '../systems/OutcomeSystem.ts';
import { EffectApplicationSystem } from '../systems/EffectApplicationSystem.ts';
import { TimerSystem } from '../systems/TimerSystem.ts';
import { AudioSystem } from '../systems/AudioSystem.ts';
import { GameRulesSystem } from '../systems/GameRulesSystem.ts';
import { CleanupSystem } from '../systems/CleanupSystem.ts';
import type { SystemPipeline } from '../systems/SystemPipeline.ts';

export interface SystemFactoryOptions {
  world: GameWorld;
  context: GameContext;
  entityFactory: IEntityFactory;
  renderer: IRenderer;
  spawnFactory: ISpawnFactory;
  audioPlayer: IAudioPlayer | null;
  onDespawn: DespawnCallback;
  random?: () => number;
}

export interface CreatedSystems {
  rulesSystem: GameRulesSystem;
}

/**
 * SystemFactory creates and configures all ECS systems.
 * Follows Factory pattern to decouple system creation from GameEngine.
 */
export class SystemFactory {
  public static createAndRegisterSystems(pipeline: SystemPipeline, options: SystemFactoryOptions): CreatedSystems {
    const {
      world,
      context,
      entityFactory,
      renderer,
      spawnFactory,
      audioPlayer,
      onDespawn,
      random = Math.random,
    } = options;

    // Create systems
    const inputSystem = new InputSystem(world);
    const spawnSystem = new SpawnSystem(world, context.config, spawnFactory, random, entityFactory);
    const trajectorySystem = new TrajectorySystem(world);
    const movementSystem = new MovementSystem(world);
    const visualSyncSystem = new VisualSyncSystem(world, renderer);
    const collisionSystem = new CollisionSystem(world);
    const outcomeSystem = new OutcomeSystem(world);
    const effectApplicationSystem = new EffectApplicationSystem(world, context.score, context.lives, context.state);
    const timerSystem = new TimerSystem(context.state, context.timer, context.flow);
    const audioSystem = new AudioSystem(world, audioPlayer);
    const rulesSystem = new GameRulesSystem(context.events, context.flow);
    const cleanupSystem = new CleanupSystem(world, onDespawn);

    // Initialize systems that need it
    rulesSystem.init();

    // Register systems in pipeline (order matters!)
    pipeline.add(timerSystem);
    pipeline.add(inputSystem);
    pipeline.add(spawnSystem);
    pipeline.add(trajectorySystem);
    pipeline.add(movementSystem);
    pipeline.add(visualSyncSystem);
    pipeline.add(collisionSystem);
    pipeline.add(outcomeSystem);
    pipeline.add(effectApplicationSystem);
    pipeline.add(audioSystem);
    pipeline.add(rulesSystem);
    pipeline.add(cleanupSystem);

    // Return systems that need external access (for disposal, etc.)
    return {
      rulesSystem,
    };
  }
}
