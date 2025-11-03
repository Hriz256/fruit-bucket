import type { Updatable } from './interfaces/Updatable.ts';

export class SystemPipeline {
  private _systems: Updatable[] = [];

  public add(system: Updatable): void {
    this._systems.push(system);
  }

  public update(deltaTime: number): void {
    for (const system of this._systems) {
      system.update(deltaTime);
    }
  }
}
