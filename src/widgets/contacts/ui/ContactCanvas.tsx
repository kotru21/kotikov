import React, {
  useRef,
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { colors } from "@/styles/colors";

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

    const initCanvas = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Устанавливаем размер canvas
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 2); // Ограничиваем DPR для производительности
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      // Оптимизация производительности Canvas
      ctx.imageSmoothingEnabled = false;
      ctx.globalCompositeOperation = "source-over";

      // Оптимизированная очистка Canvas
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Создаем пикселизованный фон
      const pixelSize = 8; // Размер одного пикселя
      const cols = Math.ceil(rect.width / pixelSize);
      const rows = Math.ceil(rect.height / pixelSize);

      // Создаем массив цветов для градиента
      const baseColors = [
        colors.primary[900],
        colors.primary[800],
        colors.primary[700],
      ];

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * pixelSize;
          const y = row * pixelSize;

          // Вычисляем цвет пикселя на основе позиции для градиентного эффекта
          const progress = (row + col) / (rows + cols);
          const colorIndex = Math.floor(progress * (baseColors.length - 1));

          // Применяем базовый цвет
          const baseColor = baseColors[colorIndex];
          ctx.fillStyle = baseColor;
          ctx.fillRect(x, y, pixelSize, pixelSize);

          // Добавляем тонкие границы пикселей
          ctx.strokeStyle = colors.primary[600] + "20";
          ctx.lineWidth = 0.5;
          ctx.strokeRect(x, y, pixelSize, pixelSize);
        }
      }

      // Вызываем колбэк для уведомления родителя
      onInitCanvas();
    }, [onInitCanvas]);

    const drawOnCanvas = useCallback(
      (x: number, y: number, prevX: number, prevY: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        // Рисуем под лапой, смещая немного вниз
        const canvasX = x - rect.left;
        const canvasY = y - rect.top + 15; // Смещение под лапу
        const canvasPrevX = prevX - rect.left;
        const canvasPrevY = prevY - rect.top + 15;

        // Отключаем сглаживание для четких пикселей
        ctx.imageSmoothingEnabled = false;

        const pixelSize = 8; // Размер пикселя (должен совпадать с initCanvas)

        // Создаем линию между предыдущей и текущей позицией для непрерывного рисования
        const distance = Math.sqrt(
          Math.pow(canvasX - canvasPrevX, 2) +
            Math.pow(canvasY - canvasPrevY, 2)
        );
        const steps = Math.max(1, Math.floor(distance / (pixelSize / 2)));

        for (let i = 0; i <= steps; i++) {
          const t = steps > 0 ? i / steps : 0;
          const interpX = canvasPrevX + (canvasX - canvasPrevX) * t;
          const interpY = canvasPrevY + (canvasY - canvasPrevY) * t;

          // Определяем какие пиксели нужно закрасить в области кисти
          const brushRadius = 20; // Радиус кисти в пикселях
          const startPixelX = Math.floor((interpX - brushRadius) / pixelSize);
          const endPixelX = Math.floor((interpX + brushRadius) / pixelSize);
          const startPixelY = Math.floor((interpY - brushRadius) / pixelSize);
          const endPixelY = Math.floor((interpY + brushRadius) / pixelSize);

          for (let pixelY = startPixelY; pixelY <= endPixelY; pixelY++) {
            for (let pixelX = startPixelX; pixelX <= endPixelX; pixelX++) {
              const pixelCenterX = pixelX * pixelSize + pixelSize / 2;
              const pixelCenterY = pixelY * pixelSize + pixelSize / 2;

              // Проверяем, находится ли пиксель в радиусе кисти
              const distanceFromCenter = Math.sqrt(
                Math.pow(pixelCenterX - interpX, 2) +
                  Math.pow(pixelCenterY - interpY, 2)
              );

              if (distanceFromCenter <= brushRadius) {
                // Выбираем цвет на основе расстояния от центра кисти
                const colorIntensity = 1 - distanceFromCenter / brushRadius;
                let fillColor;

                if (colorIntensity > 0.7) {
                  fillColor = colors.accent.pink[400]; // Яркий центр
                } else if (colorIntensity > 0.4) {
                  fillColor = colors.accent.purple[400]; // Средняя зона
                } else if (colorIntensity > 0.2) {
                  fillColor = colors.accent.blue[400]; // Внешняя зона
                } else {
                  fillColor = colors.primary[300]; // Край кисти
                }

                // Закрашиваем пиксель
                ctx.fillStyle = fillColor;
                ctx.fillRect(
                  pixelX * pixelSize,
                  pixelY * pixelSize,
                  pixelSize,
                  pixelSize
                );

                // Добавляем границу пикселя для четкости
                ctx.strokeStyle = colors.accent.pink[500] + "40";
                ctx.lineWidth = 0.5;
                ctx.strokeRect(
                  pixelX * pixelSize,
                  pixelY * pixelSize,
                  pixelSize,
                  pixelSize
                );
              }
            }
          }
        }
      },
      []
    );

    useEffect(() => {
      initCanvas();

      let resizeTimeoutId: NodeJS.Timeout;

      const handleResize = () => {
        clearTimeout(resizeTimeoutId);
        // Debounce resize чтобы избежать частых перерисовок
        resizeTimeoutId = setTimeout(initCanvas, 200);
      };

      window.addEventListener("resize", handleResize, { passive: true });
      return () => {
        window.removeEventListener("resize", handleResize);
        clearTimeout(resizeTimeoutId);
      };
    }, [initCanvas]);

    // Экспонируем методы через imperative handle
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
        }}
      />
    );
  }
);

ContactCanvas.displayName = "ContactCanvas";

export default ContactCanvas;
