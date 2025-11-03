import type { Query, With } from 'miniplex';
import { GameWorld, type GameEntity } from '../types.ts';
import type { ISystem } from '../interfaces/ISystem.ts';

export class InputSystem implements ISystem {
  private readonly _targets: Query<With<GameEntity, 'inputControlled' | 'position' | 'bounds'>>;
  private readonly _inputQuery: Query<With<GameEntity, 'inputState'>>;
  private readonly _configQuery: Query<With<GameEntity, 'sceneConfig'>>;

  public constructor(private readonly world: GameWorld) {
    this._targets = this.world.with('inputControlled', 'position', 'bounds');
    this._inputQuery = this.world.with('inputState');
    this._configQuery = this.world.with('sceneConfig');
  }

  public update(): void {
    const configEntity = this._configQuery.first!;
    const inputEntity = this._inputQuery.first!;

    if (!inputEntity.inputState.active) return;

    const bounds = configEntity.sceneConfig.inputBounds;
    const targetX = this.clamp(inputEntity.inputState.targetX, bounds.minX, bounds.maxX);

    for (const entity of this._targets) {
      entity.position.x = targetX;
    }

    inputEntity.inputState.active = false;
  }

  private clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
  }
}
