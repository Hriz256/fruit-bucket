import type { GameEntity } from '../../types.ts';
import type { TrajectoryStrategy } from './interfaces/TrajectoryStrategy.ts';

export class LinearTrajectory implements TrajectoryStrategy {
  public update(
    entity: GameEntity & Required<Pick<GameEntity, 'trajectory' | 'velocity' | 'position'>>,
    deltaTime: number
  ): void {
    const { trajectory } = entity;
    const { config, elapsedTime, originY, fallDistance } = trajectory;
    const fallDuration = config.fallDuration;

    // Time-based interpolation: position = originY - (elapsedTime / fallDuration) * fallDistance
    const progress = Math.min(elapsedTime / fallDuration, 1.0);
    const targetY = originY - progress * fallDistance;

    // Calculate velocity based on position difference
    entity.position.y = targetY;
    entity.velocity.x = 0;
    entity.velocity.y = -fallDistance / fallDuration;
  }
}
