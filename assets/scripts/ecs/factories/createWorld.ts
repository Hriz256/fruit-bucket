import type { GameWorld } from '../types.ts';
import * as miniplex from 'miniplex';

export const createWorld = (): GameWorld => {
  const WorldCtor = miniplex.World ?? (miniplex as any).default?.World;

  return new WorldCtor() as GameWorld;
};
