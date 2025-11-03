import { intersects } from '../../utils/geometry.ts';
import type { Query, With } from 'miniplex';
import { GameWorld, type GameEntity } from '../types.ts';
import type { ISystem } from '../interfaces/ISystem.ts';

export class CollisionSystem implements ISystem {
  private readonly _items: Query<With<GameEntity, 'itemId' | 'itemKind' | 'position' | 'bounds'>>;
  private readonly _baskets: Query<With<GameEntity, 'inputControlled' | 'position' | 'bounds'>>;
  private readonly _configQuery: Query<With<GameEntity, 'sceneConfig'>>;

  public constructor(private readonly world: GameWorld) {
    this._items = this.world.with('itemId', 'itemKind', 'position', 'bounds');
    this._baskets = this.world.with('inputControlled', 'position', 'bounds');
    this._configQuery = this.world.with('sceneConfig');
  }

  public update(): void {
    const config = this._configQuery.first!;
    const basket = this.findBasket()!;

    const basketRect = this.toRect(
      basket.position.x,
      basket.position.y,
      basket.bounds.width,
      basket.bounds.height,
      basket.bounds.anchorX,
      basket.bounds.anchorY
    );

    const floorY = config.sceneConfig.floorY;

    for (const entity of this._items) {
      if (entity.despawn) {
        continue;
      }

      if (entity.position.y <= floorY) {
        this.world.addComponent(entity, 'despawn', true);
        this.world.addComponent(entity, 'collisionEvent', {
          target: 'ground',
          itemId: entity.itemId,
          itemKind: entity.itemKind,
        });
        continue;
      }

      const itemRect = this.toRect(
        entity.position.x,
        entity.position.y,
        entity.bounds.width,
        entity.bounds.height,
        entity.bounds.anchorX,
        entity.bounds.anchorY
      );

      if (intersects(itemRect, basketRect)) {
        this.world.addComponent(entity, 'despawn', true);
        this.world.addComponent(entity, 'collisionEvent', {
          target: 'basket',
          itemId: entity.itemId,
          itemKind: entity.itemKind,
        });
      }
    }
  }

  private findBasket() {
    for (const entity of this._baskets) {
      return entity;
    }

    return undefined;
  }

  private toRect(x: number, y: number, width: number, height: number, anchorX: number, anchorY: number) {
    return {
      x: x - width * anchorX,
      y: y - height * anchorY,
      width,
      height,
    };
  }
}
