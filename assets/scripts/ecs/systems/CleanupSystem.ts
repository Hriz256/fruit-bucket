import type { Query, With } from 'miniplex';
import type { GameEntity, GameWorld } from '../types.ts';
import type { ISystem } from '../interfaces/ISystem.ts';
import type { DespawnCallback } from './interfaces/DespawnCallback.ts';

export class CleanupSystem implements ISystem {
  private readonly _targets: Query<With<GameEntity, 'despawn'>>;

  public constructor(
    private readonly world: GameWorld,
    private readonly onDespawn: DespawnCallback
  ) {
    this._targets = this.world.with('despawn');
  }

  public update(): void {
    for (const entity of this._targets) {
      if (!entity.despawn || entity.nodeId === undefined) continue;
      this.onDespawn(entity.nodeId);
      this.world.remove(entity);
    }
  }
}
