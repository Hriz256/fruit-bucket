import type { GameEntity } from '../../types.ts';
import type { TrajectoryStrategy } from './interfaces/TrajectoryStrategy.ts';

export class AcceleratedTrajectory implements TrajectoryStrategy {
  public update(
    entity: GameEntity & Required<Pick<GameEntity, 'trajectory' | 'velocity' | 'position'>>,
    deltaTime: number
  ): void {
    const { trajectory } = entity;
    const { config, elapsedTime, originY, fallDistance } = trajectory;
    const fallDuration = config.fallDuration;

    // Accelerated motion: using quadratic easing for natural acceleration
    const progress = Math.min(elapsedTime / fallDuration, 1.0);
    const easedProgress = progress * progress; // Quadratic easing
    const targetY = originY - easedProgress * fallDistance;

    // Calculate instantaneous velocity (derivative of position)
    entity.position.y = targetY;
    entity.velocity.x = 0;
    entity.velocity.y = -(2 * progress * fallDistance) / fallDuration;
  }
}
