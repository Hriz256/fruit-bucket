/**
 * Audio components for ECS.
 * When these components are added to entities, AudioSystem will process them.
 */

export interface PlaySoundComponent {
  /**
   * Name of the sound effect to play.
   */
  soundName: string;
  /**
   * Volume (0.0 - 1.0). Optional, uses default if not specified.
   */
  volume?: number;
}

export interface PlayMusicComponent {
  /**
   * Indicates that background music should start.
   */
  play: true;
}

export interface StopMusicComponent {
  /**
   * Indicates that background music should stop.
   */
  stop: true;
}

export interface PauseMusicComponent {
  /**
   * Indicates that background music should pause.
   */
  pause: true;
}
