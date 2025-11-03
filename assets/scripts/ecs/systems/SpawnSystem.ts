import { GameConfig, GameItemKind, ItemConfig } from '../../config/GameConfig.ts';
import { resolveDifficultyStage } from '../../config/difficulty.ts';
import { GameWorld, type GameEntity } from '../types.ts';
import type { ISpawnFactory } from '../interfaces/ISpawnFactory.ts';
import type { IEntityFactory } from '../interfaces/IEntityFactory.ts';
import { EntityFactory } from '../factories/EntityFactory.ts';
import type { Query, With } from 'miniplex';
import type { ISystem } from '../interfaces/ISystem.ts';
import type { SpawnBounds } from './interfaces/SpawnBounds.ts';

export class SpawnSystem implements ISystem {
  private _elapsed = 0;
  private _timeUntilNext = 0;
  private readonly _spawnFactory: ISpawnFactory;
  private readonly _entityFactory: IEntityFactory;
  private readonly _configQuery: Query<With<GameEntity, 'sceneConfig'>>;

  public constructor(
    private readonly world: GameWorld,
    private readonly config: GameConfig,
    spawnFactory: ISpawnFactory,
    private readonly random: () => number = Math.random,
    entityFactory?: IEntityFactory
  ) {
    this._spawnFactory = spawnFactory;
    this._entityFactory = entityFactory ?? new EntityFactory(world);
    this._timeUntilNext = config.tuning.baseSpawnInterval;
    this._configQuery = this.world.with('sceneConfig');
  }

  public update(deltaTime: number): void {
    const configEntity = this._configQuery.first!;

    this._elapsed += deltaTime;
    this._timeUntilNext -= deltaTime;

    if (this._timeUntilNext > 0) {
      return;
    }

    this.spawnItem(configEntity.sceneConfig.spawnBounds);
    this.scheduleNext();
  }

  private spawnItem(bounds: SpawnBounds): void {
    const configEntity = this._configQuery.first!;
    const stage = resolveDifficultyStage(this._elapsed, this.config.tuning.difficultyStages);
    const itemConfig = this.pickItem(stage.hazardChance);
    const x = this.randomInRange(bounds.minX, bounds.maxX);
    const y = bounds.startY;
    const spawnResult = this._spawnFactory(this.world, { x, y, config: itemConfig });

    const trajectoryConfig = this.applyDifficulty(this.pickTrajectory(itemConfig), stage.speedMultiplier);
    const fallDistance = configEntity.sceneConfig.fallDistance;

    this._entityFactory.createFallingItem({
      nodeId: spawnResult.nodeId,
      x,
      y,
      width: spawnResult.width,
      height: spawnResult.height,
      itemConfig,
      trajectoryConfig,
      fallDistance,
    });
  }

  private scheduleNext(): void {
    const stage = resolveDifficultyStage(this._elapsed, this.config.tuning.difficultyStages);
    const interval = Math.max(this.config.sceneBounds.minSpawnInterval, stage.spawnInterval);

    this._timeUntilNext = interval;
  }

  private pickItem(hazardChance: number): ItemConfig {
    const hazardRoll = this.random();
    const hazards = this.config.items.filter((item) => item.kind === GameItemKind.Hazard);
    const fruits = this.config.items.filter((item) => item.kind === GameItemKind.Fruit);

    if (hazards.length > 0 && hazardRoll < hazardChance) {
      return hazards[Math.floor(this.random() * hazards.length)];
    }

    return fruits[Math.floor(this.random() * fruits.length)];
  }

  private pickTrajectory(item: ItemConfig) {
    if (item.trajectories.length === 0) {
      throw new Error(`Item ${item.id} does not contain trajectories`);
    }

    const index = Math.floor(this.random() * item.trajectories.length);

    return item.trajectories[index];
  }

  private applyDifficulty(trajectory: ItemConfig['trajectories'][number], multiplier: number) {
    return {
      ...trajectory,
      // Apply difficulty by reducing fall duration (faster falling)
      fallDuration: trajectory.fallDuration / multiplier,
    };
  }

  private randomInRange(min: number, max: number): number {
    return min + (max - min) * this.random();
  }
}
