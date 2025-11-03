import { GameItemKind } from '../../config/GameConfig.ts';
import type { Query, With } from 'miniplex';
import { GameWorld, type GameEntity } from '../types.ts';
import type { ISystem } from '../interfaces/ISystem.ts';

export class OutcomeSystem implements ISystem {
  private readonly _collisions: Query<
    With<GameEntity, 'collisionEvent' | 'itemId' | 'itemKind' | 'scoreValue' | 'lifeCost'>
  >;

  public constructor(private readonly world: GameWorld) {
    this._collisions = this.world.with('collisionEvent', 'itemId', 'itemKind', 'scoreValue', 'lifeCost');
  }

  public update(): void {
    for (const entity of this._collisions) {
      const event = entity.collisionEvent;

      if (event.target === 'basket') {
        this.handleBasketCatch(entity.itemKind, entity.itemId, entity.scoreValue, entity.lifeCost);
      } else if (event.target === 'ground') {
        this.handleMissedItem(entity.itemKind);
      }

      this.world.removeComponent(entity, 'collisionEvent');
    }
  }

  private handleBasketCatch(kind: GameItemKind, itemId: string, scoreValue: number, lifeCost: number): void {
    if (kind === GameItemKind.Fruit) {
      this.world.add({
        gameEffect: {
          type: 'AddScore',
          amount: scoreValue,
          itemId,
        },
      });
    } else if (kind === GameItemKind.Hazard) {
      if (lifeCost > 0) {
        this.world.add({
          gameEffect: {
            type: 'LoseLife',
            amount: lifeCost,
          },
        });
      }

      if (scoreValue !== 0) {
        this.world.add({
          gameEffect: {
            type: 'AddScore',
            amount: scoreValue,
            itemId,
          },
        });
      }

      this.world.add({
        gameEffect: {
          type: 'IncrementHazards',
        },
      });
    }

    this.world.add({
      gameEffect: {
        type: 'IncrementCaught',
        itemId,
      },
    });
  }

  private handleMissedItem(kind: GameItemKind): void {
    if (kind === GameItemKind.Fruit) {
      this.world.add({
        gameEffect: {
          type: 'ResetCombo',
        },
      });
    }
  }
}
