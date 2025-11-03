/**
 * Interface for audio playback.
 * Implemented by adapters (e.g., AudioManager for Cocos Creator).
 */
export interface IAudioPlayer {
  playBackgroundMusic(): void;
  stopBackgroundMusic(): void;
  pauseBackgroundMusic(): void;
  playSoundEffect(soundName: string, volume: number): void;
}
