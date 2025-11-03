import type { Query, With } from 'miniplex';
import { GameWorld, type GameEntity } from '../types.ts';
import type { ISystem } from '../interfaces/ISystem.ts';
import type { IAudioPlayer } from '../interfaces/IAudioPlayer.ts';

/**
 * AudioSystem processes audio components and delegates playback to an audio player.
 * This system is pure ECS - it reacts to components added to the world.
 * Audio player is injected via constructor to maintain proper encapsulation.
 */
export class AudioSystem implements ISystem {
  private readonly _playSoundQuery: Query<With<GameEntity, 'soundName'>>;
  private readonly _playMusicQuery: Query<With<GameEntity, 'play'>>;
  private readonly _stopMusicQuery: Query<With<GameEntity, 'stop'>>;
  private readonly _pauseMusicQuery: Query<With<GameEntity, 'pause'>>;

  public constructor(
    private readonly world: GameWorld,
    private readonly audioPlayer: IAudioPlayer | null = null
  ) {
    this._playSoundQuery = this.world.with('soundName');
    this._playMusicQuery = this.world.with('play');
    this._stopMusicQuery = this.world.with('stop');
    this._pauseMusicQuery = this.world.with('pause');
  }

  public update(): void {
    if (!this.audioPlayer) {
      // Clean up entities even if no player is available
      for (const entity of this._playSoundQuery) {
        this.world.remove(entity);
      }

      for (const entity of this._playMusicQuery) {
        this.world.remove(entity);
      }

      for (const entity of this._stopMusicQuery) {
        this.world.remove(entity);
      }

      for (const entity of this._pauseMusicQuery) {
        this.world.remove(entity);
      }

      return;
    }

    for (const entity of this._playSoundQuery) {
      if (entity.soundName) {
        const volume = entity.volume ?? 0.7;
        this.audioPlayer.playSoundEffect(entity.soundName, volume);
      }

      this.world.remove(entity);
    }

    for (const entity of this._playMusicQuery) {
      this.audioPlayer.playBackgroundMusic();
      this.world.remove(entity);
    }

    for (const entity of this._stopMusicQuery) {
      this.audioPlayer.stopBackgroundMusic();
      this.world.remove(entity);
    }

    for (const entity of this._pauseMusicQuery) {
      this.audioPlayer.pauseBackgroundMusic();
      this.world.remove(entity);
    }
  }
}
