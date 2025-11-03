/**
 * ECS Game Events - represent game effects as components
 * These are processed by dedicated systems
 */

export interface AddScoreEffect {
  type: 'AddScore';
  amount: number;
  itemId: string;
}

export interface LoseLifeEffect {
  type: 'LoseLife';
  amount: number;
}

export interface ResetComboEffect {
  type: 'ResetCombo';
}

export interface IncrementCaughtEffect {
  type: 'IncrementCaught';
  itemId: string;
}

export interface IncrementHazardsEffect {
  type: 'IncrementHazards';
}

export type GameEffect =
  | AddScoreEffect
  | LoseLifeEffect
  | ResetComboEffect
  | IncrementCaughtEffect
  | IncrementHazardsEffect;

export interface GameEffectComponent {
  gameEffect: GameEffect;
}
