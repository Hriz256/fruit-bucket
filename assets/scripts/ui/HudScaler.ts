import { _decorator, Component, view, screen } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('HudScaler')
export class HudScaler extends Component {
  @property({ tooltip: 'Ideal (design) viewport width in points (design units)' })
  public idealWidth: number = 1920;

  @property({ tooltip: 'Ideal (design) viewport height in points (design units)' })
  public idealHeight: number = 1080;

  @property({ tooltip: 'Clamp minimum scale' })
  public minScale: number = 0.5;

  @property({ tooltip: 'Clamp maximum scale' })
  public maxScale: number = 2.0;

  protected onLoad(): void {
    // If not explicitly set, fall back to current design resolution
    if (this.idealWidth <= 0 || this.idealHeight <= 0) {
      const des = view.getDesignResolutionSize();
      this.idealWidth = des.width;
      this.idealHeight = des.height;
    }
    this.applyScale();
  }

  protected onEnable(): void {
    screen.on('window-resize', this.applyScaleDeferred, this);
    screen.on('orientation-change', this.applyScaleDeferred, this);
  }

  protected onDisable(): void {
    screen.off('window-resize', this.applyScaleDeferred, this);
    screen.off('orientation-change', this.applyScaleDeferred, this);
  }

  private applyScaleDeferred = (): void => {
    this.scheduleOnce(() => this.applyScale(), 0);
  };

  private applyScale(): void {
    const visible = view.getVisibleSize(); // in design units
    const w = visible.width;
    const h = visible.height;

    if (w <= 0 || h <= 0 || this.idealWidth <= 0 || this.idealHeight <= 0) {
      return;
    }

    const scale = Math.max(w / this.idealWidth, h / this.idealHeight);
    const clamped = Math.max(this.minScale, Math.min(this.maxScale, scale));
    this.node.setScale(clamped, clamped, 1);
  }
}
