import type { GameEntity } from '../../types.ts';
import type { TrajectoryStrategy } from './interfaces/TrajectoryStrategy.ts';
import { MathConstants } from '../../../config/MathConstants.ts';

export class ZigZagTrajectory implements TrajectoryStrategy {
  public update(
    entity: GameEntity & Required<Pick<GameEntity, 'trajectory' | 'velocity' | 'position'>>,
    deltaTime: number
  ): void {
    const { trajectory } = entity;
    const { config, elapsedTime, originX, originY, fallDistance } = trajectory;
    const fallDuration = config.fallDuration;
    const amplitude = config.amplitude ?? 0;
    const frequency = config.frequency ?? 1;

    // Time-based interpolation for Y position
    const progress = Math.min(elapsedTime / fallDuration, 1.0);
    const targetY = originY - progress * fallDistance;

    // Calculate zigzag X position based on sine wave
    const phase = elapsedTime * frequency * MathConstants.TWO_PI;
    const targetX = originX + Math.sin(phase) * amplitude;

    // Calculate velocities
    entity.position.x = targetX;
    entity.position.y = targetY;
    entity.velocity.y = -fallDistance / fallDuration;
    entity.velocity.x = Math.cos(phase) * amplitude * frequency * MathConstants.TWO_PI;
  }
}
