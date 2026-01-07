import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

import { colors } from "@/styles/colors";

import { CONTACT_CANVAS_PIXEL_SIZE, CAT_POSES } from "./constants";

interface ContactCanvasProps {
  onInitCanvas: () => void;
}

export interface ContactCanvasRef {
  drawOnCanvas: (x: number, y: number, prevX: number, prevY: number) => void;
  initCanvas: () => void;
}

const ContactCanvas = forwardRef<ContactCanvasRef, ContactCanvasProps>(
  ({ onInitCanvas }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const catMapRef = useRef<Map<string, string>>(new Map()); // "col,row" -> color
    const revealedPixelsRef = useRef<Set<string>>(new Set()); // Уже закрашенные пиксели

    const brushRadius = 20;
    const pixelSize = CONTACT_CANVAS_PIXEL_SIZE;

    const generateCats = useCallback(
      (rows: number, cols: number) => {
        catMapRef.current.clear();
        revealedPixelsRef.current.clear();

        // Расширенная палитра цветов
        const catColors = [
          "#f4bf21", // Yellow (Bauhaus)
          "#d12c1f", // Red (Bauhaus)
          "#1b54a7", // Blue (Bauhaus)
          "#ffffff", // White
          "#f687b3", // Pink
          "#9f7aea", // Purple
          "#68d391", // Green
          "#fc8181", // Light red
        ];

        // Определяем зоны для более интересного распределения
        // Центральная зона - меньше котов, края - больше
        const centerX = cols / 2;
        const centerY = rows / 2;

        // Собираем все позиции для котов
        interface CatPlacement {
          pose: number[][];
          startC: number;
          startR: number;
          color: string;
        }
        const placements: CatPlacement[] = [];

        // Проходим по сетке с учётом максимального размера кота
        const maxCatWidth = Math.max(...CAT_POSES.map(p => p[0]?.length || 0));
        const maxCatHeight = Math.max(...CAT_POSES.map(p => p.length));
        const cellWidth = maxCatWidth + 3;
        const cellHeight = maxCatHeight + 3;

        const gridCols = Math.floor(cols / cellWidth);
        const gridRows = Math.floor(rows / cellHeight);

        for (let gy = 0; gy < gridRows; gy++) {
          for (let gx = 0; gx < gridCols; gx++) {
            // Вычисляем расстояние от центра для варьирования плотности
            const cellCenterX = (gx + 0.5) * cellWidth;
            const cellCenterY = (gy + 0.5) * cellHeight;
            const distFromCenter = Math.hypot(
              cellCenterX - centerX,
              cellCenterY - centerY
            );
            const maxDist = Math.hypot(centerX, centerY);
            const normalizedDist = distFromCenter / maxDist;

            // Вероятность размещения кота: больше по краям (20-50%)
            const probability = 0.2 + normalizedDist * 0.3;

            if (Math.random() < probability) {
              // Случайная поза
              const pose = CAT_POSES[Math.floor(Math.random() * CAT_POSES.length)];
              const catW = pose[0]?.length || 0;
              const catH = pose.length;

              // Случайное смещение внутри ячейки
              const offsetX = Math.floor(Math.random() * (cellWidth - catW));
              const offsetY = Math.floor(Math.random() * (cellHeight - catH));

              const startC = gx * cellWidth + offsetX;
              const startR = gy * cellHeight + offsetY;

              // Случайный цвет
              const color = catColors[Math.floor(Math.random() * catColors.length)];

              placements.push({ pose, startC, startR, color });
            }
          }
        }

        // Записываем котов в карту
        for (const { pose, startC, startR, color } of placements) {
          pose.forEach((rowArr, rIdx) => {
            rowArr.forEach((cell, cIdx) => {
              if (cell === 1) {
                const key = `${startC + cIdx},${startR + rIdx}`;
                // Не перезаписываем если уже есть кот (защита от наложения)
                if (!catMapRef.current.has(key)) {
                  catMapRef.current.set(key, color);
                }
              }
            });
          });
        }
      },
      []
    );

    const drawBackground = useCallback(() => {
      const ctx = ctxRef.current;
      const canvas = canvasRef.current;
      if (!ctx || !canvas) return;

      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const cols = Math.ceil(rect.width / pixelSize);
      const rows = Math.ceil(rect.height / pixelSize);
      const baseColors = [
        colors.primary[900],
        colors.primary[800],
        colors.primary[700],
      ];

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * pixelSize;
          const y = row * pixelSize;
          const key = `${col},${row}`;
          const isCat = catMapRef.current.has(key);

          // Standard background logic (slightly modified if cat)
          const progress = (row + col) / (rows + cols);
          const colorIndex = Math.floor(progress * (baseColors.length - 1));
          
          ctx.fillStyle = isCat ? "#333333" : baseColors[colorIndex]; // Dark placeholder for cats
          
          // Optional: Make cats slightly visible as "ghosts"
           if (isCat) {
            ctx.fillStyle = colors.primary[950]; // Very dark outline
           }

          ctx.fillRect(x, y, pixelSize, pixelSize);

          // Border
          ctx.strokeStyle = colors.primary[600] + "20";
          ctx.lineWidth = 0.5;
          ctx.strokeRect(x, y, pixelSize, pixelSize);
        }
      }
    }, [pixelSize]);

    const initCanvas = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Настройка размера canvas
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      ctxRef.current = ctx;

      // Настройки производительности
      ctx.imageSmoothingEnabled = false;
      ctx.globalCompositeOperation = "source-over";

      const cols = Math.ceil(rect.width / pixelSize);
      const rows = Math.ceil(rect.height / pixelSize);
      
      generateCats(rows, cols);
      drawBackground();
      onInitCanvas();
    }, [onInitCanvas, drawBackground, generateCats, pixelSize]); // Including deps

    const drawOnCanvas = useCallback(
      (x: number, y: number, prevX: number, prevY: number) => {
        const ctx = ctxRef.current;
        const canvas = canvasRef.current;
        if (!ctx || !canvas) return;

        const rect = canvas.getBoundingClientRect();
        const canvasX = x - rect.left;
        const canvasY = y - rect.top;
        const canvasPrevX = prevX - rect.left;
        const canvasPrevY = prevY - rect.top;

        // Интерполяция между точками для плавности
        const distance = Math.hypot(
          canvasX - canvasPrevX,
          canvasY - canvasPrevY
        );
        const steps = Math.max(1, Math.floor(distance / 3));

        // Собираем пиксели для отрисовки в этом кадре (батчинг)
        const pixelsToDrawThisFrame = new Map<string, { x: number; y: number; color: string; intensity: number }>();

        for (let i = 0; i <= steps; i++) {
          const t = steps > 0 ? i / steps : 0;
          const interpX = canvasPrevX + (canvasX - canvasPrevX) * t;
          const interpY = canvasPrevY + (canvasY - canvasPrevY) * t;

          // пиксели в радиусе кисти
          const brushRadiusInPixels = Math.ceil(brushRadius / pixelSize);

          for (let dy = -brushRadiusInPixels; dy <= brushRadiusInPixels; dy++) {
            for (
              let dx = -brushRadiusInPixels;
              dx <= brushRadiusInPixels;
              dx++
            ) {
              // Координаты центра текущего пикселя
              const pixelCenterX =
                Math.floor(interpX / pixelSize) * pixelSize +
                pixelSize / 2 +
                dx * pixelSize;
              const pixelCenterY =
                Math.floor(interpY / pixelSize) * pixelSize +
                pixelSize / 2 +
                dy * pixelSize;

              const distanceFromBrush = Math.hypot(
                pixelCenterX - interpX,
                pixelCenterY - interpY
              );

              if (distanceFromBrush <= brushRadius) {
                const pixelX = pixelCenterX - pixelSize / 2;
                const pixelY = pixelCenterY - pixelSize / 2;
                const col = Math.round(pixelX / pixelSize);
                const row = Math.round(pixelY / pixelSize);
                const key = `${col},${row}`;

                // Пропускаем уже раскрытые пиксели — не перерисовываем
                if (revealedPixelsRef.current.has(key)) continue;

                const intensity = 1 - distanceFromBrush / brushRadius;
                const catColor = catMapRef.current.get(key);

                let fillColor: string;

                if (catColor) {
                  fillColor = catColor;
                } else {
                  // Основной цвет кисти — мягкий розово-фиолетовый
                  // С редкими небольшими вариациями для текстуры
                  const variation = Math.random();
                  if (variation > 0.92) {
                    // Редко — чуть светлее
                    fillColor = colors.accent.pink[300];
                  } else if (variation > 0.85) {
                    // Иногда — чуть темнее/насыщеннее
                    fillColor = colors.accent.purple[400];
                  } else {
                    // Основной цвет
                    fillColor = colors.accent.pink[400];
                  }
                }

                // Сохраняем с максимальной интенсивностью для этого пикселя
                const existing = pixelsToDrawThisFrame.get(key);
                if (!existing || intensity > existing.intensity) {
                  pixelsToDrawThisFrame.set(key, { x: pixelX, y: pixelY, color: fillColor, intensity });
                }
              }
            }
          }
        }

        // Отрисовываем все собранные пиксели одним проходом
        for (const [key, { x, y, color }] of pixelsToDrawThisFrame) {
          // Заливка
          ctx.fillStyle = color;
          ctx.fillRect(x, y, pixelSize, pixelSize);

          // Отмечаем как раскрытый
          revealedPixelsRef.current.add(key);
        }

        // Рисуем бордеры отдельным проходом (один раз на пиксель)
        ctx.strokeStyle = colors.primary[600] + "15";
        ctx.lineWidth = 0.5;
        for (const [, { x, y }] of pixelsToDrawThisFrame) {
          ctx.strokeRect(x, y, pixelSize, pixelSize);
        }
      },
      [brushRadius, pixelSize]
    );

    useEffect(() => {
      initCanvas();

      const handleResize = () => {
        setTimeout(initCanvas, 100);
      };

      window.addEventListener("resize", handleResize, { passive: true });
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, [initCanvas]);

    useImperativeHandle(
      ref,
      () => ({
        drawOnCanvas,
        initCanvas,
      }),
      [drawOnCanvas, initCanvas]
    );

    return (
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          background: `linear-gradient(135deg, ${colors.primary[900]}, ${colors.primary[800]} 50%, ${colors.primary[700]})`,
          pointerEvents: "none",
        }}
      />
    );
  }
);

ContactCanvas.displayName = "ContactCanvas";

export default ContactCanvas;
