import { useCallback,useRef } from "react";

import { colors } from "@/styles/colors";

import { CAT_POSES } from "../../constants";

export const useContactCats = () => {
  const catMapRef = useRef<Map<string, string>>(new Map()); // "col,row" -> color
  const revealedPixelsRef = useRef<Set<string>>(new Set()); // Уже закрашенные пиксели

  const generateCats = useCallback((rows: number, cols: number) => {
    catMapRef.current.clear();
    revealedPixelsRef.current.clear();

    const catColors = [
      colors.accent[200],
      colors.accent[300],
      colors.accent[400],
      colors.accent[500],
      colors.accent[600],
      colors.accent[700],
      colors.accent[800],
      colors.neutral[50],
    ];

    const centerX = cols / 2;
    const centerY = rows / 2;

    interface CatPlacement {
      pose: number[][];
      startC: number;
      startR: number;
      color: string;
    }
    const placements: CatPlacement[] = [];

    const maxCatWidth = Math.max(...CAT_POSES.map((p) => p[0]?.length || 0));
    const maxCatHeight = Math.max(...CAT_POSES.map((p) => p.length));
    const cellWidth = maxCatWidth + 3;
    const cellHeight = maxCatHeight + 3;

    const gridCols = Math.floor(cols / cellWidth);
    const gridRows = Math.floor(rows / cellHeight);

    for (let gy = 0; gy < gridRows; gy++) {
      for (let gx = 0; gx < gridCols; gx++) {
        const cellCenterX = (gx + 0.5) * cellWidth;
        const cellCenterY = (gy + 0.5) * cellHeight;
        const distFromCenter = Math.hypot(
          cellCenterX - centerX,
          cellCenterY - centerY
        );
        const maxDist = Math.hypot(centerX, centerY);
        const normalizedDist = distFromCenter / maxDist;

        // Вероятность размещения кота: больше по краям
        const probability = 0.2 + normalizedDist * 0.3;

        if (Math.random() < probability) {
          const pose = CAT_POSES[Math.floor(Math.random() * CAT_POSES.length)];
          const catW = pose[0]?.length || 0;
          const catH = pose.length;

          const offsetX = Math.floor(Math.random() * (cellWidth - catW));
          const offsetY = Math.floor(Math.random() * (cellHeight - catH));

          const startC = gx * cellWidth + offsetX;
          const startR = gy * cellHeight + offsetY;
          const color = catColors[Math.floor(Math.random() * catColors.length)];

          placements.push({ pose, startC, startR, color });
        }
      }
    }

    for (const { pose, startC, startR, color } of placements) {
      pose.forEach((rowArr, rIdx) => {
        rowArr.forEach((cell, cIdx) => {
          if (cell === 1) {
            const key = `${startC + cIdx},${startR + rIdx}`;
            if (!catMapRef.current.has(key)) {
              catMapRef.current.set(key, color);
            }
          }
        });
      });
    }
  }, []);

  return { catMapRef, revealedPixelsRef, generateCats };
};
