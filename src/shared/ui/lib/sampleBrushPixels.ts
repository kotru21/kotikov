export interface SampledPixel {
  col: number;
  row: number;
  x: number; // top-left x in px
  y: number; // top-left y in px
  intensity: number;
}

// Sample pixels affected by a single brush center point
export const sampleBrushAtPoint = (
  interpX: number,
  interpY: number,
  pixelSize: number,
  brushRadius: number
): Map<string, SampledPixel> => {
  const result = new Map<string, SampledPixel>();

  const brushRadPx = Math.ceil(brushRadius / pixelSize);

  for (let dy = -brushRadPx; dy <= brushRadPx; dy++) {
    for (let dx = -brushRadPx; dx <= brushRadPx; dx++) {
      const centerX =
        Math.floor(interpX / pixelSize) * pixelSize + pixelSize / 2 + dx * pixelSize;
      const centerY =
        Math.floor(interpY / pixelSize) * pixelSize + pixelSize / 2 + dy * pixelSize;

      const dist = Math.hypot(centerX - interpX, centerY - interpY);
      if (dist > brushRadius) continue;

      const intensity = 1 - dist / brushRadius;
      const col = Math.round((centerX - pixelSize / 2) / pixelSize);
      const row = Math.round((centerY - pixelSize / 2) / pixelSize);
      const key = `${String(col)},${String(row)}`;

      const x = col * pixelSize;
      const y = row * pixelSize;

      const existing = result.get(key);
      if (existing && existing.intensity >= intensity) continue;

      result.set(key, {
        col,
        row,
        x,
        y,
        intensity,
      });
    }
  }

  return result;
};

// Sample pixels along a stroke from prev -> current, merging intensities (keep max)
export const sampleBrushStroke = (
  x: number,
  y: number,
  prevX: number,
  prevY: number,
  pixelSize: number,
  brushRadius: number
): Map<string, SampledPixel> => {
  const pixels = new Map<string, SampledPixel>();

  const distance = Math.hypot(x - prevX, y - prevY);
  const steps = Math.max(1, Math.floor(distance / 3));

  for (let i = 0; i <= steps; i++) {
    const t = steps > 0 ? i / steps : 0;
    const interpX = prevX + (x - prevX) * t;
    const interpY = prevY + (y - prevY) * t;

    const sampled = sampleBrushAtPoint(interpX, interpY, pixelSize, brushRadius);
    for (const [key, val] of sampled) {
      const existing = pixels.get(key);
      if (!existing || val.intensity > existing.intensity) {
        pixels.set(key, val);
      }
    }
  }

  return pixels;
};
