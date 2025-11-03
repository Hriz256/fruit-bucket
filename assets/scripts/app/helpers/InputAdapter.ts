import { input, Input, EventMouse, EventTouch, Vec3, UITransform } from 'cc';
import type { IGameEngine } from '../../ecs/interfaces/IGameEngine.ts';

export class InputAdapter {
  private readonly _tempVec: Vec3 = new Vec3();

  public constructor(
    private readonly engine: IGameEngine,
    private readonly canvasTransform: UITransform
  ) {}

  public bind(): void {
    input.on(Input.EventType.MOUSE_MOVE, this.handleMouseMove, this);
    input.on(Input.EventType.TOUCH_MOVE, this.handleTouchMove, this);
  }

  public unbind(): void {
    input.off(Input.EventType.MOUSE_MOVE, this.handleMouseMove, this);
    input.off(Input.EventType.TOUCH_MOVE, this.handleTouchMove, this);
  }

  private handleMouseMove(event: EventMouse): void {
    const location = event.getUILocation();
    this.updateInputTarget(location.x, location.y);
  }

  private handleTouchMove(event: EventTouch): void {
    const location = event.getUILocation();
    this.updateInputTarget(location.x, location.y);
  }

  private updateInputTarget(screenX: number, screenY: number): void {
    this._tempVec.set(screenX, screenY, 0);
    const local = this.canvasTransform.convertToNodeSpaceAR(this._tempVec);
    this.engine.setInputTarget(local.x);
  }
}
