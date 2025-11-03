import type { GameWorld, GameEntity } from '../types.ts';
import type { IEntityFactory, FallingItemArchetype, BasketArchetype } from '../interfaces/IEntityFactory.ts';
import type { EntityConfig } from '../../config/GameConfig.ts';

export class EntityFactory implements IEntityFactory {
  private readonly _config: EntityConfig;

  public constructor(
    private readonly world: GameWorld,
    config?: EntityConfig
  ) {
    this._config = config ?? {
      defaultAnchorX: 0.5,
      defaultAnchorY: 0.5,
    };
  }

  public createFallingItem(archetype: FallingItemArchetype): GameEntity {
    return this.world.add({
      position: { x: archetype.x, y: archetype.y },
      velocity: { x: 0, y: 0 },
      acceleration: { x: 0, y: 0 },
      bounds: {
        width: archetype.width,
        height: archetype.height,
        anchorX: this._config.defaultAnchorX,
        anchorY: this._config.defaultAnchorY,
      },
      trajectory: {
        config: archetype.trajectoryConfig,
        elapsedTime: 0,
        originX: archetype.x,
        originY: archetype.y,
        fallDistance: archetype.fallDistance,
      },
      itemId: archetype.itemConfig.id,
      itemKind: archetype.itemConfig.kind,
      scoreValue: archetype.itemConfig.score,
      lifeCost: archetype.itemConfig.lifeCost ?? 0,
      nodeId: archetype.nodeId,
    });
  }

  public createBasket(archetype: BasketArchetype): GameEntity {
    return this.world.add({
      nodeId: archetype.nodeId,
      position: { x: archetype.x, y: archetype.y },
      velocity: { x: 0, y: 0 },
      bounds: {
        width: archetype.width,
        height: archetype.height,
        anchorX: archetype.anchorX,
        anchorY: archetype.anchorY,
      },
      inputControlled: true,
    });
  }

  public updateBasket(updates: Partial<Omit<BasketArchetype, 'nodeId'>>): void {
    const basket = this.world.with('inputControlled', 'position', 'bounds').first;

    if (!basket) return;

    if (updates.x !== undefined) {
      basket.position.x = updates.x;
    }

    if (updates.y !== undefined) {
      basket.position.y = updates.y;
    }

    if (updates.width !== undefined) {
      basket.bounds.width = updates.width;
    }

    if (updates.height !== undefined) {
      basket.bounds.height = updates.height;
    }

    if (updates.anchorX !== undefined) {
      basket.bounds.anchorX = updates.anchorX;
    }

    if (updates.anchorY !== undefined) {
      basket.bounds.anchorY = updates.anchorY;
    }
  }

  public createInputState(): GameEntity {
    return this.world.add({
      inputState: {
        targetX: 0,
        active: false,
      },
    });
  }

  public createSceneConfig(config: {
    floorY: number;
    spawnBounds: { minX: number; maxX: number; startY: number };
    inputBounds: { minX: number; maxX: number };
    fallDistance: number;
  }): GameEntity {
    return this.world.add({
      sceneConfig: {
        floorY: config.floorY,
        spawnBounds: config.spawnBounds,
        inputBounds: config.inputBounds,
        fallDistance: config.fallDistance,
      },
    });
  }
}
