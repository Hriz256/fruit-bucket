export enum GameItemKind {
  Fruit = 'fruit',
  Hazard = 'hazard',
}

export const TrajectoryType = {
  Linear: 'linear',
  ZigZag: 'zigzag',
  Accelerated: 'accelerated',
} as const;

export type TrajectoryType = (typeof TrajectoryType)[keyof typeof TrajectoryType];

export interface TrajectoryConfig {
  type: TrajectoryType;
  fallDuration: number; // Time in seconds for item to fall from spawn to floor
  amplitude?: number;
  frequency?: number;
}

export interface ItemConfig {
  id: string;
  kind: GameItemKind;
  spriteFrame: string;
  score: number;
  lifeCost?: number;
  trajectories: TrajectoryConfig[];
}

export interface DifficultyStage {
  time: number;
  spawnInterval: number;
  hazardChance: number;
  speedMultiplier: number;
}

export interface ViewportConfig {
  idealWidth: number;
  idealHeight: number;
  minScale: number;
  maxScale: number;
}

export interface SceneBoundsConfig {
  margin: number;
  basketBottomMargin: number;
  minSpawnInterval: number;
}

export interface AudioConfig {
  defaultMusicVolume: number;
  defaultSoundEffectVolume: number;
}

export interface EntityConfig {
  defaultAnchorX: number;
  defaultAnchorY: number;
}

export interface GameTuningConfig {
  sessionDuration: number;
  initialLives: number;
  baseSpawnInterval: number;
  difficultyStages: DifficultyStage[];
}

export interface GameConfig {
  items: ItemConfig[];
  tuning: GameTuningConfig;
  viewport: ViewportConfig;
  sceneBounds: SceneBoundsConfig;
  audio: AudioConfig;
  entity: EntityConfig;
}

export const defaultDifficultyStages: DifficultyStage[] = [
  { time: 0, spawnInterval: 1.2, hazardChance: 0.1, speedMultiplier: 1 },
  { time: 30, spawnInterval: 1.0, hazardChance: 0.15, speedMultiplier: 1.1 },
  { time: 60, spawnInterval: 0.8, hazardChance: 0.2, speedMultiplier: 1.2 },
  { time: 90, spawnInterval: 0.6, hazardChance: 0.25, speedMultiplier: 1.35 },
];
