import type { Query, With } from 'miniplex';
import { GameWorld, type GameEntity } from '../types.ts';
import { TrajectoryRegistry } from './trajectories/TrajectoryRegistry.ts';
import type { ISystem } from '../interfaces/ISystem.ts';

export class TrajectorySystem implements ISystem {
  private readonly _targets: Query<With<GameEntity, 'trajectory' | 'velocity' | 'position'>>;
  private readonly _configQuery: Query<With<GameEntity, 'sceneConfig'>>;
  private readonly _registry: TrajectoryRegistry;
  private _lastFallDistance = 0;

  public constructor(
    private readonly world: GameWorld,
    registry?: TrajectoryRegistry
  ) {
    this._targets = this.world.with('trajectory', 'velocity', 'position');
    this._configQuery = this.world.with('sceneConfig');
    this._registry = registry ?? new TrajectoryRegistry();
  }

  public update(deltaTime: number): void {
    // Check if fallDistance changed (reactive approach)
    this.checkAndUpdateFallDistance();

    // Update trajectories
    for (const entity of this._targets) {
      entity.trajectory.elapsedTime += deltaTime;
      const config = entity.trajectory.config;
      const strategy = this._registry.get(config.type)!;

      strategy.update(entity, deltaTime);
    }
  }

  /**
   * Reactively checks if fallDistance changed and updates all trajectories.
   */
  private checkAndUpdateFallDistance(): void {
    const configEntity = this._configQuery.first;

    if (!configEntity) return;

    const currentFallDistance = configEntity.sceneConfig.fallDistance;

    // Detect change in fallDistance (screen resize happened)
    if (this._lastFallDistance > 0 && currentFallDistance !== this._lastFallDistance) {
      this.updateAllTrajectories(this._lastFallDistance, currentFallDistance);
    }

    this._lastFallDistance = currentFallDistance;
  }

  /**
   * Updates fall distance for all falling items when screen size changes.
   * Preserves progress as a percentage of screen height - works for any resolution
   */
  private updateAllTrajectories(oldFallDistance: number, newFallDistance: number): void {
    const configEntity = this._configQuery.first;

    if (!configEntity) return;

    const spawnY = configEntity.sceneConfig.spawnBounds.startY;

    for (const entity of this._targets) {
      const { trajectory, position } = entity;

      // Calculate progress as percentage: how far fallen from spawn to floor
      // progress = 0.0 (at spawn) to 1.0 (at floor)
      const distanceFallen = trajectory.originY - position.y;
      const progress = oldFallDistance > 0 ? distanceFallen / oldFallDistance : 0;

      // Apply same progress to new screen dimensions
      trajectory.originY = spawnY;
      trajectory.fallDistance = newFallDistance;

      // Position item at the same percentage of the new height
      const newDistanceFallen = progress * newFallDistance;
      position.y = spawnY - newDistanceFallen;

      // Adjust elapsed time to match progress (assuming linear time)
      trajectory.elapsedTime = progress * trajectory.config.fallDuration;
    }
  }
}
