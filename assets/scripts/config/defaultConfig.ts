import { GameConfig, GameItemKind, TrajectoryType, defaultDifficultyStages } from './GameConfig.ts';

export const defaultGameConfig: GameConfig = {
  items: [
    {
      id: 'red-apple',
      kind: GameItemKind.Fruit,
      spriteFrame: 'red-apple',
      score: 10,
      trajectories: [{ type: TrajectoryType.Linear, fallDuration: 3.5 }],
    },
    {
      id: 'banana',
      kind: GameItemKind.Fruit,
      spriteFrame: 'banana',
      score: 15,
      trajectories: [{ type: TrajectoryType.ZigZag, fallDuration: 4.0, amplitude: 120, frequency: 2 }],
    },
    {
      id: 'orange',
      kind: GameItemKind.Fruit,
      spriteFrame: 'orange',
      score: 20,
      trajectories: [{ type: TrajectoryType.Accelerated, fallDuration: 3.0 }],
    },
    {
      id: 'mushroom',
      kind: GameItemKind.Hazard,
      spriteFrame: 'mushroom',
      score: -20,
      lifeCost: 1,
      trajectories: [{ type: TrajectoryType.Linear, fallDuration: 3.2 }],
    },
  ],
  tuning: {
    sessionDuration: 90,
    initialLives: 3,
    baseSpawnInterval: 1.2,
    difficultyStages: defaultDifficultyStages,
  },
  viewport: {
    idealWidth: 1920,
    idealHeight: 1080,
    minScale: 0.5,
    maxScale: 2.0,
  },
  sceneBounds: {
    margin: 48,
    basketBottomMargin: 20,
    minSpawnInterval: 0.3,
  },
  audio: {
    defaultMusicVolume: 0.5,
    defaultSoundEffectVolume: 0.7,
  },
  entity: {
    defaultAnchorX: 0.5,
    defaultAnchorY: 0.5,
  },
};
