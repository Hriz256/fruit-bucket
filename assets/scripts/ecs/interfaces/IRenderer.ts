/**
 * Renderer interface for synchronizing entity positions to visual representation.
 * Decouples ECS systems from Cocos Creator's Node API.
 */
export interface IRenderer {
  /**
   * Updates the visual position of a node.
   * @param nodeId - The registered node identifier
   * @param x - X coordinate in world space
   * @param y - Y coordinate in world space
   */
  setPosition(nodeId: number, x: number, y: number): void;
}
