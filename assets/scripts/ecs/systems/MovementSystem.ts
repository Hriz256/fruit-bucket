import type { Query, With } from 'miniplex';
import { GameWorld, type GameEntity } from '../types.ts';
import type { ISystem } from '../interfaces/ISystem.ts';

export class MovementSystem implements ISystem {
  private readonly _moving: Query<With<GameEntity, 'position' | 'velocity'>>;
  private readonly _accelerating: Query<With<GameEntity, 'velocity' | 'acceleration'>>;
  private readonly _lifetimes: Query<With<GameEntity, 'lifetime'>>;

  public constructor(private readonly world: GameWorld) {
    this._moving = this.world.with('position', 'velocity');
    this._accelerating = this.world.with('velocity', 'acceleration');
    this._lifetimes = this.world.with('lifetime');
  }

  public update(deltaTime: number): void {
    for (const entity of this._accelerating) {
      const { acceleration, velocity } = entity;
      velocity.x += acceleration.x * deltaTime;
      velocity.y += acceleration.y * deltaTime;
    }

    for (const entity of this._moving) {
      const { position, velocity } = entity;
      position.x += velocity.x * deltaTime;
      position.y += velocity.y * deltaTime;
    }

    for (const entity of this._lifetimes) {
      entity.lifetime -= deltaTime;

      if (entity.lifetime <= 0) {
        entity.despawn = true;
      }
    }
  }
}
