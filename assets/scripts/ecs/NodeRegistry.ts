import type { Node } from 'cc';
import type { INodeRegistry } from './interfaces/INodeRegistry.ts';

export class NodeRegistry implements INodeRegistry {
  private _nodes = new Map<number, Node>();
  private _nextId = 1;

  public register(node: Node): number {
    const id = this._nextId++;
    this._nodes.set(id, node);

    return id;
  }

  public get(entityId: number): Node | undefined {
    return this._nodes.get(entityId);
  }

  public findId(node: Node): number | undefined {
    for (const [id, registeredNode] of this._nodes.entries()) {
      if (registeredNode === node || node.isChildOf(registeredNode)) {
        return id;
      }
    }

    return undefined;
  }

  public unregister(entityId: number): void {
    this._nodes.delete(entityId);
  }

  public clear(): void {
    this._nodes.clear();
    this._nextId = 1;
  }
}
