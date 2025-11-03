import type { GameWorld } from '../../../ecs/types.ts';

export interface AudioService {
  /**
   * Initializes the audio service with the ECS world.
   * Must be called before any audio operations.
   */
  initialize(world: GameWorld): void;

  /**
   * Plays background music. Loops automatically.
   */
  playBackgroundMusic(): void;

  /**
   * Stops background music.
   */
  stopBackgroundMusic(): void;

  /**
   * Pauses background music.
   */
  pauseBackgroundMusic(): void;

  /**
   * Resumes background music.
   */
  resumeBackgroundMusic(): void;

  /**
   * Plays a sound effect.
   * @param soundName - The name of the sound effect to play
   */
  playSoundEffect(soundName: string): void;

  /**
   * Sets the volume for background music (0.0 - 1.0).
   */
  setMusicVolume(volume: number): void;

  /**
   * Sets the volume for sound effects (0.0 - 1.0).
   */
  setSoundEffectVolume(volume: number): void;

  /**
   * Gets the current music volume.
   */
  getMusicVolume(): number;

  /**
   * Gets the current sound effect volume.
   */
  getSoundEffectVolume(): number;
}
