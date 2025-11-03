import { SpriteFrame } from 'cc';

export class SpriteCache {
  private _cache = new Map<string, SpriteFrame>();

  public cacheFrames(frames: SpriteFrame[]): void {
    this._cache.clear();

    for (const frame of frames) {
      this._cache.set(frame.name, frame);
    }
  }

  public get(name: string): SpriteFrame | undefined {
    return this._cache.get(name);
  }
}
