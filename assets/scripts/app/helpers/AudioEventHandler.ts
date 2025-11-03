import type { AudioService } from '../../domain/services/interfaces/AudioService.ts';

/**
 * AudioEventHandler manages audio feedback for game events.
 * Separated from GameEventRouter to follow Single Responsibility Principle.
 */
export class AudioEventHandler {
  private _previousLives: number | null = null;
  private _previousScore: number | null = null;

  public constructor(private readonly audioService: AudioService) {}

  public handleScoreChanged(score: number): void {
    // Play sound only if score actually increased (not on initialization)
    if (this._previousScore !== null && score > this._previousScore) {
      this.audioService.playSoundEffect('catch-fruit');
    }

    this._previousScore = score;
  }

  public handleLivesChanged(lives: number): void {
    if (this._previousLives !== null && lives < this._previousLives) {
      this.audioService.playSoundEffect('catch-hazard');
    }

    this._previousLives = lives;
  }

  public handleGameStarted(): void {
    this.audioService.playBackgroundMusic();
  }

  public handleGameEnded(): void {
    this.audioService.stopBackgroundMusic();
    this.audioService.playSoundEffect('game-over');
  }

  public reset(): void {
    this._previousLives = null;
    this._previousScore = null;
  }
}
