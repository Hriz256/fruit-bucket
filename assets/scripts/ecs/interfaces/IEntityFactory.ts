import type { GameEntity } from '../types.ts';
import type { ItemConfig, TrajectoryConfig } from '../../config/GameConfig.ts';

export interface FallingItemArchetype {
  nodeId: number;
  x: number;
  y: number;
  width: number;
  height: number;
  itemConfig: ItemConfig;
  trajectoryConfig: TrajectoryConfig;
  fallDistance: number;
}

export interface BasketArchetype {
  nodeId: number;
  x: number;
  y: number;
  width: number;
  height: number;
  anchorX: number;
  anchorY: number;
}

export interface IEntityFactory {
  createFallingItem(archetype: FallingItemArchetype): GameEntity;
  createBasket(archetype: BasketArchetype): GameEntity;
  updateBasket(updates: Partial<Omit<BasketArchetype, 'nodeId'>>): void;
  createInputState(): GameEntity;
  createSceneConfig(config: {
    floorY: number;
    spawnBounds: { minX: number; maxX: number; startY: number };
    inputBounds: { minX: number; maxX: number };
    fallDistance: number;
  }): GameEntity;
}
