export interface ScoreService {
  readonly score: number;
  add(points: number, itemId: string): void;
  resetCombo(): void;
  reset(): void;
}
