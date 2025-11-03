import type { Node } from 'cc';

export interface INodeRegistry {
  register(node: Node): number;
  get(entityId: number): Node | undefined;
  findId(node: Node): number | undefined;
  unregister(entityId: number): void;
  clear(): void;
}
