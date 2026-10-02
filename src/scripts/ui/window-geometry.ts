export function fitBounds(x: number, y: number, width: number, height: number, vw: number, vh: number) {
  const w = Math.min(width, Math.max(1, vw - 16));
  const h = Math.min(height, Math.max(1, vh - 16));
  return { width: w, height: h, x: Math.max(8, Math.min(x, vw - w - 8)), y: Math.max(8, Math.min(y, vh - h - 8)) };
}
