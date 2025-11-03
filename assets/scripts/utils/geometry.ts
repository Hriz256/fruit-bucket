export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const intersects = (a: Rect, b: Rect): boolean =>
  a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
