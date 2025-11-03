import { _decorator, Component, UITransform, view, screen } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('BackgroundCover')
export class BackgroundCover extends Component {
  private _canvasUI!: UITransform;
  private _bgUI!: UITransform;
  private _baseScaleX = 1;
  private _baseScaleY = 1;

  @property({ tooltip: 'Pin background bottom to screen bottom' })
  public alignBottom: boolean = true;

  protected onLoad(): void {
    this._bgUI = this.getComponent(UITransform)!;
    this._canvasUI = this.node.parent!.getComponent(UITransform)!;
    this._baseScaleX = this.node.scale.x;
    this._baseScaleY = this.node.scale.y;
    this.applyCover();
  }

  protected onEnable(): void {
    // React to runtime screen changes
    screen.on('window-resize', this.applyCoverDeferred, this);
    screen.on('orientation-change', this.applyCoverDeferred, this);
  }

  protected onDisable(): void {
    screen.off('window-resize', this.applyCoverDeferred, this);
    screen.off('orientation-change', this.applyCoverDeferred, this);
    view.setResizeCallback?.(null);
  }

  private applyCoverDeferred = (): void => {
    // Defer one frame to allow Canvas/UITransform to finish layout after resize
    this.scheduleOnce(() => this.applyCover(), 0);
  };

  private applyCover = (): void => {
    if (!this._canvasUI || !this._bgUI) return;

    const canvasW = this._canvasUI.contentSize.width;
    const canvasH = this._canvasUI.contentSize.height;
    const bgW = this._bgUI.contentSize.width;
    const bgH = this._bgUI.contentSize.height;

    if (canvasW <= 0 || canvasH <= 0 || bgW <= 0 || bgH <= 0) {
      return;
    }

    const scale = Math.max(canvasW / bgW, canvasH / bgH);
    this.node.setScale(this._baseScaleX * scale, this._baseScaleY * scale, 1);

    if (this.alignBottom) {
      const yCanvasBottom = -canvasH / 2;
      const anchorY = this._bgUI.anchorPoint.y;
      const posY = yCanvasBottom + anchorY * bgH * scale;
      this.node.setPosition(0, posY, this.node.position.z);
    } else {
      this.node.setPosition(0, 0, this.node.position.z);
    }
  };
}
