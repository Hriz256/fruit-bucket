import type { World } from 'miniplex';
import type { EntityComponents } from './components/Components.ts';

export type GameEntity = EntityComponents;
export type GameWorld = World<GameEntity>;
