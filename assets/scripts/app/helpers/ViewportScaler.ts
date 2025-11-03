import { view } from 'cc';

export class ViewportScaler {
  public constructor(
    private readonly idealWidth: number,
    private readonly idealHeight: number,
    private readonly minScale: number,
    private readonly maxScale: number
  ) {}

  public computeScale(): number {
    const visible = view.getVisibleSize();
    const raw = Math.max(visible.width / this.idealWidth, visible.height / this.idealHeight);

    return Math.max(this.minScale, Math.min(this.maxScale, raw));
  }
}
