import { DifficultyStage } from './GameConfig.ts';

export const resolveDifficultyStage = (elapsed: number, stages: DifficultyStage[]): DifficultyStage => {
  const sorted = [...stages].sort((a, b) => a.time - b.time);
  let current = sorted[0];

  for (const stage of sorted) {
    if (elapsed >= stage.time) {
      current = stage;
    } else {
      break;
    }
  }

  return current;
};
