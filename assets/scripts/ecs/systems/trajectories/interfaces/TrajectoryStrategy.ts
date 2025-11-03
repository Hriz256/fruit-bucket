import type { GameEntity } from '../../../types.ts';

export interface TrajectoryStrategy {
  update(
    entity: GameEntity & Required<Pick<GameEntity, 'trajectory' | 'velocity' | 'position'>>,
    deltaTime: number
  ): void;
}
