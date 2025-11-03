import { GameItemKind, TrajectoryConfig } from '../../config/GameConfig.ts';
import type { GameEffectComponent } from './GameEventComponent.ts';
import type {
  PlaySoundComponent,
  PlayMusicComponent,
  StopMusicComponent,
  PauseMusicComponent,
} from './AudioComponents.ts';

export interface PositionComponent {
  position: { x: number; y: number };
}

export interface VelocityComponent {
  velocity: { x: number; y: number };
}

export interface AccelerationComponent {
  acceleration: { x: number; y: number };
}

export interface BoundsComponent {
  bounds: { width: number; height: number; anchorX: number; anchorY: number };
}

export interface TrajectoryComponent {
  trajectory: {
    config: TrajectoryConfig;
    elapsedTime: number;
    originX: number;
    originY: number;
    fallDistance: number;
  };
}

export interface ItemIdentityComponent {
  itemId: string;
  itemKind: GameItemKind;
  scoreValue: number;
  lifeCost: number;
}

export interface LifetimeComponent {
  lifetime: number;
}

export interface DespawnComponent {
  despawn: true;
}

export interface NodeRefComponent {
  nodeId: number;
}

export interface InputTargetComponent {
  inputControlled: true;
}

export interface InputStateComponent {
  inputState: {
    targetX: number;
    active: boolean;
  };
}

export interface SceneConfigComponent {
  sceneConfig: {
    floorY: number;
    spawnBounds: {
      minX: number;
      maxX: number;
      startY: number;
    };
    inputBounds: {
      minX: number;
      maxX: number;
    };
    fallDistance: number;
  };
}

export interface CollisionEventComponent {
  collisionEvent: {
    target: 'basket' | 'ground';
    itemId: string;
    itemKind: GameItemKind;
  };
}

export type EntityComponents = Partial<
  PositionComponent &
    VelocityComponent &
    AccelerationComponent &
    BoundsComponent &
    TrajectoryComponent &
    ItemIdentityComponent &
    LifetimeComponent &
    DespawnComponent &
    NodeRefComponent &
    InputTargetComponent &
    InputStateComponent &
    SceneConfigComponent &
    CollisionEventComponent &
    GameEffectComponent &
    PlaySoundComponent &
    PlayMusicComponent &
    StopMusicComponent &
    PauseMusicComponent
>;
