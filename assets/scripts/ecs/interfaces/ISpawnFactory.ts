import type { GameWorld } from '../types.ts';
import type { ItemConfig } from '../../config/GameConfig.ts';

export interface SpawnContext {
  x: number;
  y: number;
  config: ItemConfig;
}

export interface SpawnResult {
  nodeId: number;
  width: number;
  height: number;
}

export interface ISpawnFactory {
  (world: GameWorld, context: SpawnContext): SpawnResult;
}
