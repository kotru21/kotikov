import { type RefObject, useCallback, useRef } from "react";

import { colors } from "@/styles/colors";

import { CAT_POSES } from "../../constants";

interface UseContactCatsOptions {
  /** Injectable RNG for tests; production defaults to Math.random. */
  random?: () => number;
}

interface UseContactCatsReturn {
  catMapRef: RefObject<Map<string, string>>;
  generateCats: (rows: number, cols: number) => void;
}

export const useContactCats = (options: UseContactCatsOptions = {}): UseContactCatsReturn => {
  const random = options.random ?? Math.random;
  const catMapRef = useRef(new Map<string, string>()); // "col,row" -> color

  const generateCats = useCallback((rows: number, cols: number): void => {
    // Only regenerate silhouettes — never clear revealed paint (S7-02).
    catMapRef.current.clear();


    // Тело кота — тёмный силуэт (несколько оттенков для лёгкого разнообразия),
    // глаза — яркие, чтобы силуэт читался на ярком закрашенном фоне.
    const catBodyColors = [
      colors.neutral[950],
      colors.neutral[900],
      colors.primary[950],
      colors.accent[950],
    ];
    const catEyeColors = [colors.neutral[50], colors.accent[300], colors.accent[200]];

    const centerX = cols / 2;
    const centerY = rows / 2;

    interface CatPlacement {
      pose: number[][];
      startC: number;
      startR: number;
      bodyColor: string;
      eyeColor: string;
    }
    const placements: CatPlacement[] = [];

    const maxCatWidth = Math.max(...CAT_POSES.map((p) => p[0]?.length ?? 0));
    const maxCatHeight = Math.max(...CAT_POSES.map((p) => p.length));
    const cellWidth = maxCatWidth + 3;
    const cellHeight = maxCatHeight + 3;

    const gridCols = Math.floor(cols / cellWidth);
    const gridRows = Math.floor(rows / cellHeight);

    for (let gy = 0; gy < gridRows; gy++) {
      for (let gx = 0; gx < gridCols; gx++) {
        const cellCenterX = (gx + 0.5) * cellWidth;
        const cellCenterY = (gy + 0.5) * cellHeight;
        const distFromCenter = Math.hypot(cellCenterX - centerX, cellCenterY - centerY);
        const maxDist = Math.hypot(centerX, centerY);
        const normalizedDist = maxDist !== 0 ? distFromCenter / maxDist : 0;

        // Вероятность размещения кота: больше по краям
        const probability = 0.2 + normalizedDist * 0.3;

        if (random() < probability) {
          const pose = CAT_POSES[Math.floor(random() * CAT_POSES.length)];
          const catW = pose[0]?.length ?? 0;
          const catH = pose.length;

          const offsetX = Math.floor(random() * (cellWidth - catW));
          const offsetY = Math.floor(random() * (cellHeight - catH));

          const startC = gx * cellWidth + offsetX;
          const startR = gy * cellHeight + offsetY;
          const bodyColor = catBodyColors[Math.floor(random() * catBodyColors.length)];
          const eyeColor = catEyeColors[Math.floor(random() * catEyeColors.length)];

          placements.push({ pose, startC, startR, bodyColor, eyeColor });
        }
      }
    }

    for (const { pose, startC, startR, bodyColor, eyeColor } of placements) {
      pose.forEach((rowArr, rIdx) => {
        rowArr.forEach((cell, cIdx) => {
          if (cell === 0) return;
          const key = `${String(startC + cIdx)},${String(startR + rIdx)}`;
          if (catMapRef.current.has(key)) return;
          // 2 — глаз/деталь, всё остальное ненулевое — тело.
          catMapRef.current.set(key, cell === 2 ? eyeColor : bodyColor);
        });
      });
    }
  }, [random]);

  return { catMapRef, generateCats };
};
