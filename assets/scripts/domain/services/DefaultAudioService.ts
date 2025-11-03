import type { AudioService } from './interfaces/AudioService.ts';
import type { GameWorld } from '../../ecs/types.ts';
import type { GameConfig } from '../../config/GameConfig.ts';

/**
 * Default implementation of AudioService.
 * This is a domain layer service that creates audio command entities in the ECS world.
 * NO direct dependencies on adapters - pure command pattern through ECS.
 */
export class DefaultAudioService implements AudioService {
  private _musicVolume: number;
  private _soundEffectVolume: number;
  private _world: GameWorld | null = null;

  public constructor(config: GameConfig) {
    this._musicVolume = config.audio.defaultMusicVolume;
    this._soundEffectVolume = config.audio.defaultSoundEffectVolume;
  }

  public initialize(world: GameWorld): void {
    this._world = world;
  }

  public playBackgroundMusic(): void {
    this._world!.add({
      play: true,
    });
  }

  public stopBackgroundMusic(): void {
    this._world!.add({
      stop: true,
    });
  }

  public pauseBackgroundMusic(): void {
    this._world!.add({
      pause: true,
    });
  }

  public resumeBackgroundMusic(): void {
    this.playBackgroundMusic();
  }

  public playSoundEffect(soundName: string): void {
    this._world!.add({
      soundName,
      volume: this._soundEffectVolume,
    });
  }

  public setMusicVolume(volume: number): void {
    this._musicVolume = Math.max(0, Math.min(1, volume));
  }

  public setSoundEffectVolume(volume: number): void {
    this._soundEffectVolume = Math.max(0, Math.min(1, volume));
  }

  public getMusicVolume(): number {
    return this._musicVolume;
  }

  public getSoundEffectVolume(): number {
    return this._soundEffectVolume;
  }
}
