import type { ISpawnFactory } from '../../ecs/interfaces/ISpawnFactory.ts';
import type { DespawnCallback } from '../../ecs/systems/interfaces/DespawnCallback.ts';
import type { IAudioPlayer } from '../../ecs/interfaces/IAudioPlayer.ts';

export interface EngineOptions {
  spawnFactory: ISpawnFactory;
  onDespawn: DespawnCallback;
  audioPlayer?: IAudioPlayer;
  random?: () => number;
}
