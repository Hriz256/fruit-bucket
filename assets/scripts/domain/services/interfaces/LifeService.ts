export interface LifeService {
  readonly lives: number;
  lose(amount: number): void;
  reset(initialLives: number): void;
}
