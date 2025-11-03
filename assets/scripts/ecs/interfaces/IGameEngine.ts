import type { Node } from 'cc';
import type { SpawnBounds } from '../systems/interfaces/SpawnBounds.ts';
import type { InputBounds } from '../systems/interfaces/InputBounds.ts';
import type { IEntityFactory } from './IEntityFactory.ts';

/**
 * IGameEngine - Interface for the main game engine
 * Encapsulates ECS world and provides public API
 */
export interface IGameEngine {
  /**
   * Get entity factory for creating game entities
   */
  get entityFactory(): IEntityFactory;

  /**
   * Update the engine with delta time
   */
  update(deltaTime: number): void;

  /**
   * Set input target from external sources (UI events)
   */
  setInputTarget(x: number): void;

  /**
   * Update scene configuration
   */
  updateSceneConfig(
    config: Partial<{
      floorY: number;
      spawnBounds: SpawnBounds;
      inputBounds: InputBounds;
      fallDistance: number;
    }>
  ): void;

  /**
   * Register a node and return its entity ID
   */
  registerNode(node: Node): number;

  /**
   * Unregister a node by entity ID
   */
  unregisterNode(entityId: number): void;

  /**
   * Get node by entity ID
   */
  getNode(entityId: number): Node | undefined;

  /**
   * Dispose of the engine and clean up resources
   */
  dispose(): void;
}
