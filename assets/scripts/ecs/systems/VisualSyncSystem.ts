import type { Query, With } from 'miniplex';
import { GameWorld, type GameEntity } from '../types.ts';
import type { IRenderer } from '../interfaces/IRenderer.ts';
import type { ISystem } from '../interfaces/ISystem.ts';

/**
 * VisualSyncSystem synchronizes entity positions to visual representation.
 * Now properly decoupled from Cocos Creator through IRenderer interface.
 */
export class VisualSyncSystem implements ISystem {
  private readonly _targets: Query<With<GameEntity, 'position' | 'nodeId'>>;

  public constructor(
    private readonly world: GameWorld,
    private readonly renderer: IRenderer
  ) {
    this._targets = this.world.with('position', 'nodeId');
  }

  public update(): void {
    for (const entity of this._targets) {
      this.renderer.setPosition(entity.nodeId, entity.position.x, entity.position.y);
    }
  }
}
