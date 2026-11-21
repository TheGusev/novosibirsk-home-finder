/** Position (px) of a point given in % of the natural image, rendered with object-fit: cover. */
export function coverPoint(xPct: number, yPct: number, imgW: number, imgH: number, boxW: number, boxH: number) {
  const scale = Math.max(boxW / imgW, boxH / imgH);
  const w = imgW * scale, h = imgH * scale;
  const offX = (boxW - w) / 2, offY = (boxH - h) / 2;
  const x = offX + (xPct / 100) * w, y = offY + (yPct / 100) * h;
  return { x, y, visible: x >= 0 && x <= boxW && y >= 0 && y <= boxH };
}
/** Keeps a point inside the safe zone (away from header/bottom controls). */
export function clampPoint(x: number, y: number, boxW: number, boxH: number, pad = { top: 72, bottom: 150, side: 32 }) {
  return { x: Math.min(Math.max(x, pad.side), boxW - pad.side), y: Math.min(Math.max(y, pad.top), boxH - pad.bottom) };
}
export function resolveScene(sceneIds: string[], requested: string | undefined, fallback: string) {
  return requested && sceneIds.includes(requested) ? requested : fallback;
}
