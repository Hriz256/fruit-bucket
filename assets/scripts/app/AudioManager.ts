import { _decorator, Component, AudioClip, AudioSource } from 'cc';
import type { IAudioPlayer } from '../ecs/interfaces/IAudioPlayer.ts';

const { ccclass, property } = _decorator;

/**
 * AudioManager component that bridges Cocos Creator's audio system
 * with the ECS AudioSystem.
 *
 * This is a pure adapter - it implements AudioPlayer interface
 * and delegates to Cocos Creator's AudioSource.
 *
 * Usage:
 * 1. Add this component to a persistent node in your scene
 * 2. Assign background music AudioClip
 * 3. Assign sound effect AudioClips (drag and drop audio files)
 * 4. Reference this in GameController to connect with AudioSystem
 */
@ccclass('AudioManager')
export class AudioManager extends Component implements IAudioPlayer {
  @property(AudioClip)
  public backgroundMusic: AudioClip | null = null;

  @property([AudioClip])
  public soundEffects: AudioClip[] = [];

  @property({ tooltip: 'Default music volume (0.0 - 1.0), can be overridden by GameConfig' })
  public musicVolume = 0.5;

  private _musicSource: AudioSource | null = null;
  private _effectsSource: AudioSource | null = null;
  private _soundEffectMap: Map<string, AudioClip> = new Map();

  protected onLoad(): void {
    this._musicSource = this.addComponent(AudioSource);
    this._effectsSource = this.addComponent(AudioSource);

    if (this._musicSource && this.backgroundMusic) {
      this._musicSource.clip = this.backgroundMusic;
      this._musicSource.loop = true;
      this._musicSource.playOnAwake = false;
      this._musicSource.volume = this.musicVolume;
    }

    this.cacheSoundEffects();
  }

  public playBackgroundMusic(): void {
    if (!this._musicSource || !this.backgroundMusic) {
      console.warn('AudioManager: no background music configured');

      return;
    }

    this._musicSource.play();
  }

  public stopBackgroundMusic(): void {
    this._musicSource?.stop();
  }

  public pauseBackgroundMusic(): void {
    this._musicSource?.pause();
  }

  public playSoundEffect(soundName: string, volume: number): void {
    const clip = this._soundEffectMap.get(soundName);

    if (!clip) {
      console.warn(
        `AudioManager: sound effect "${soundName}" not found. Available: ${Array.from(this._soundEffectMap.keys()).join(', ')}`
      );

      return;
    }

    if (!this._effectsSource) {
      console.warn('AudioManager: effects source not initialized');

      return;
    }

    this._effectsSource.playOneShot(clip, volume);
  }

  private cacheSoundEffects(): void {
    this._soundEffectMap.clear();

    for (const clip of this.soundEffects) {
      if (clip && clip.name) {
        this._soundEffectMap.set(clip.name, clip);
      }
    }
  }
}
