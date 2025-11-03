import { Vec3 } from 'cc';
import type { IRenderer } from './interfaces/IRenderer.ts';
import type { INodeRegistry } from './interfaces/INodeRegistry.ts';

/**
 * NodeRenderer is an adapter that bridges ECS systems to Cocos Creator's Node API.
 * It implements IRenderer interface and delegates to INodeRegistry.
 */
export class NodeRenderer implements IRenderer {
  private readonly _temp: Vec3 = new Vec3();

  public constructor(private readonly nodeRegistry: INodeRegistry) {}

  public setPosition(nodeId: number, x: number, y: number): void {
    const node = this.nodeRegistry.get(nodeId);

    if (!node) {
      return;
    }

    this._temp.set(x, y, node.position.z);
    node.setPosition(this._temp);
  }
}
