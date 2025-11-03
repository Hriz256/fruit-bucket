import type { Node } from 'cc';
import { createWorld } from '../ecs/factories/createWorld.ts';
import { SystemPipeline } from '../ecs/systems/SystemPipeline.ts';
import { SystemFactory } from '../ecs/factories/SystemFactory.ts';
import { CleanupSystem } from '../ecs/systems/CleanupSystem.ts';
import { GameRulesSystem } from '../ecs/systems/GameRulesSystem.ts';
import { GameWorld } from '../ecs/types.ts';
import type { GameContext } from './interfaces/GameContext.ts';
import type { Query, With } from 'miniplex';
import type { GameEntity } from '../ecs/types.ts';
import type { INodeRegistry } from '../ecs/interfaces/INodeRegistry.ts';
import { NodeRegistry } from '../ecs/NodeRegistry.ts';
import type { IEntityFactory } from '../ecs/interfaces/IEntityFactory.ts';
import { EntityFactory } from '../ecs/factories/EntityFactory.ts';
import type { IRenderer } from '../ecs/interfaces/IRenderer.ts';
import { NodeRenderer } from '../ecs/NodeRenderer.ts';
import type { IGameEngine } from '../ecs/interfaces/IGameEngine.ts';
import type { EngineOptions } from './interfaces/EngineOptions.ts';
import type { SpawnBounds } from '../ecs/systems/interfaces/SpawnBounds.ts';
import type { InputBounds } from '../ecs/systems/interfaces/InputBounds.ts';

export class GameEngine implements IGameEngine {
  private readonly _world: GameWorld;
  private readonly _nodeRegistry: INodeRegistry;
  private readonly _renderer: IRenderer;
  private readonly _entityFactory: IEntityFactory;
  private readonly _pipeline: SystemPipeline;
  private readonly _rulesSystem: GameRulesSystem;
  private readonly _itemsQuery: Query<With<GameEntity, 'nodeId' | 'itemId' | 'itemKind' | 'scoreValue' | 'lifeCost'>>;

  public get entityFactory(): IEntityFactory {
    return this._entityFactory;
  }

  public constructor(context: GameContext, options: EngineOptions) {
    this._world = createWorld();
    this._nodeRegistry = new NodeRegistry();
    this._renderer = new NodeRenderer(this._nodeRegistry);
    this._entityFactory = new EntityFactory(this._world, context.config.entity);
    this._pipeline = new SystemPipeline();

    // Initialize audio service with the ECS world
    context.audio.initialize(this._world);

    this._entityFactory.createInputState();
    this._entityFactory.createSceneConfig({
      floorY: -Infinity,
      spawnBounds: { minX: 0, maxX: 0, startY: 0 },
      inputBounds: { minX: 0, maxX: 0 },
      fallDistance: 0, // Will be set by GameController.configureSceneBounds()
    });

    // Use SystemFactory to create and register all systems
    const systems = SystemFactory.createAndRegisterSystems(this._pipeline, {
      world: this._world,
      context,
      entityFactory: this._entityFactory,
      renderer: this._renderer,
      spawnFactory: options.spawnFactory,
      audioPlayer: options.audioPlayer ?? null,
      onDespawn: options.onDespawn,
      random: options.random,
    });

    this._rulesSystem = systems.rulesSystem;
    this._itemsQuery = this._world.with('nodeId', 'itemId', 'itemKind', 'scoreValue', 'lifeCost');
  }

  public setInputTarget(x: number): void {
    const inputEntity = this._world.with('inputState').first;

    if (inputEntity) {
      inputEntity.inputState.targetX = x;
      inputEntity.inputState.active = true;
    }
  }

  public update(deltaTime: number): void {
    this._pipeline.update(deltaTime);
  }

  public updateSceneConfig(
    config: Partial<{
      floorY: number;
      spawnBounds: SpawnBounds;
      inputBounds: InputBounds;
      fallDistance: number;
    }>
  ): void {
    const configEntity = this._world.with('sceneConfig').first;

    if (configEntity) {
      if (config.floorY !== undefined) {
        configEntity.sceneConfig.floorY = config.floorY;
      }

      if (config.spawnBounds) {
        configEntity.sceneConfig.spawnBounds = config.spawnBounds;
      }

      if (config.inputBounds) {
        configEntity.sceneConfig.inputBounds = config.inputBounds;
      }

      if (config.fallDistance !== undefined) {
        configEntity.sceneConfig.fallDistance = config.fallDistance;
      }
    }
  }

  public registerNode(node: Node): number {
    return this._nodeRegistry.register(node);
  }

  public unregisterNode(entityId: number): void {
    this._nodeRegistry.unregister(entityId);
  }

  public getNode(entityId: number): Node | undefined {
    return this._nodeRegistry.get(entityId);
  }

  public dispose(): void {
    // Dispose rules system (unsubscribe from events)
    this._rulesSystem.dispose();

    // Mark all items for cleanup
    for (const entity of this._itemsQuery) {
      this._world.addComponent(entity, 'despawn', true);
    }

    // Run cleanup cycle
    this._pipeline.update(0);

    // Clear node registry
    this._nodeRegistry.clear();
  }
}
