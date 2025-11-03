/**
 * ISystem - Base interface for all ECS systems
 * Ensures consistent system contract across the architecture
 */
export interface ISystem {
  /**
   * Update the system with delta time
   * @param deltaTime - Time elapsed since last frame (optional for systems that don't need it)
   */
  update(deltaTime?: number): void;
}
