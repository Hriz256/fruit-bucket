import type { Query, With } from 'miniplex';
import { GameWorld, type GameEntity } from '../types.ts';
import type { ScoreService } from '../../domain/services/interfaces/ScoreService.ts';
import type { LifeService } from '../../domain/services/interfaces/LifeService.ts';
import { StatisticsState } from '../../domain/interfaces/GameState.ts';
import type { ISystem } from '../interfaces/ISystem.ts';
import type { GameEffect } from '../components/GameEventComponent.ts';

type EffectHandler = (effect: GameEffect) => void;

export class EffectApplicationSystem implements ISystem {
  private readonly _effects: Query<With<GameEntity, 'gameEffect'>>;
  private readonly _handlers: Record<GameEffect['type'], EffectHandler>;

  public constructor(
    private readonly world: GameWorld,
    private readonly scoreService: ScoreService,
    private readonly lifeService: LifeService,
    private readonly gameState: StatisticsState
  ) {
    this._effects = this.world.with('gameEffect');
    this._handlers = {
      AddScore: (effect) => {
        if (effect.type === 'AddScore') {
          this.scoreService.add(effect.amount, effect.itemId);
        }
      },
      LoseLife: (effect) => {
        if (effect.type === 'LoseLife') {
          this.lifeService.lose(effect.amount);
        }
      },
      ResetCombo: () => {
        this.scoreService.resetCombo();
      },
      IncrementCaught: (effect) => {
        if (effect.type === 'IncrementCaught') {
          this.gameState.incrementCaught(effect.itemId);
        }
      },
      IncrementHazards: () => {
        this.gameState.incrementHazards();
      },
    };
  }

  public update(): void {
    for (const entity of this._effects) {
      const effect = entity.gameEffect;
      this._handlers[effect.type]?.(effect);
      this.world.remove(entity);
    }
  }
}
