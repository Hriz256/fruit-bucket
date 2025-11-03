import type { TrajectoryStrategy } from './interfaces/TrajectoryStrategy.ts';
import { LinearTrajectory } from './LinearTrajectory.ts';
import { AcceleratedTrajectory } from './AcceleratedTrajectory.ts';
import { ZigZagTrajectory } from './ZigZagTrajectory.ts';
import { TrajectoryType } from '../../../config/GameConfig.ts';

export class TrajectoryRegistry {
  private _strategies = new Map<string, TrajectoryStrategy>();

  public constructor() {
    this.register(TrajectoryType.Linear, new LinearTrajectory());
    this.register(TrajectoryType.Accelerated, new AcceleratedTrajectory());
    this.register(TrajectoryType.ZigZag, new ZigZagTrajectory());
  }

  public register(type: string, strategy: TrajectoryStrategy): void {
    this._strategies.set(type, strategy);
  }

  public get(type: string): TrajectoryStrategy | undefined {
    return this._strategies.get(type);
  }
}
