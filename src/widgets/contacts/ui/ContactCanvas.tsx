import React, {
  useRef,
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { colors } from "@/styles/colors";
import { CONTACT_CANVAS_PIXEL_SIZE } from "./constants";

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
    const rectRef = useRef<DOMRect | null>(null);
    const dprRef = useRef<number>(1);
    // Предварительно отрисованный штамп кисти (сетка-выравнивание)
    const brushCanvasRef = useRef<HTMLCanvasElement | null>(null);
    // Радиус кисти в "ячейках" сетки, чтобы края совпадали с фоном
    const brushRadiusCellsRef = useRef<number>(3); // 3 * 8px = 24px радиус

    // Константы (фиксированные на компонент)
    const pixelSize = CONTACT_CANVAS_PIXEL_SIZE; // единый размер сетки
    // Визуальный оффсет сетки: смещает фон и кисть одинаково для "пиксельной" эстетики
    const gridOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const gridLockedRef = useRef<boolean>(false);

    const drawBackground = useCallback(() => {
      const ctx = ctxRef.current;
      const rect = rectRef.current;
      if (!ctx || !rect) return;
      // Очистка
      ctx.clearRect(0, 0, rect.width, rect.height);

      const cols = Math.ceil(rect.width / pixelSize);
      const rows = Math.ceil(rect.height / pixelSize);
      const baseColors = [
        colors.primary[900],
        colors.primary[800],
        colors.primary[700],
      ];
      const offset = gridOffsetRef.current;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * pixelSize + offset.x;
          const y = row * pixelSize + offset.y;
          const progress = (row + col) / (rows + cols);
          const colorIndex = Math.floor(progress * (baseColors.length - 1));
          const baseColor = baseColors[colorIndex];
          ctx.fillStyle = baseColor;
          ctx.fillRect(x, y, pixelSize, pixelSize);
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

      // размер canvas
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // ограничиваем DPR для производительности
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      // кэшируем ссылки
      ctxRef.current = ctx;
      rectRef.current = rect;
      dprRef.current = dpr;

      // Оптимизация производительности Canvas
      ctx.imageSmoothingEnabled = false;
      ctx.globalCompositeOperation = "source-over";

      // Рисуем фон
      drawBackground();

      // штамп кисти  (круглая кисть из ячеек pixelSize)
      const brushRadiusPx = brushRadiusCellsRef.current * pixelSize;
      const size = brushRadiusPx * 2; // диаметр кратен pixelSize
      const brushCanvas = document.createElement("canvas");
      brushCanvas.width = size;
      brushCanvas.height = size;
      const bctx = brushCanvas.getContext("2d");
      if (bctx) {
        bctx.imageSmoothingEnabled = false;

        const cells = size / pixelSize;
        for (let py = 0; py < cells; py++) {
          for (let px = 0; px < cells; px++) {
            const cx = px * pixelSize + pixelSize / 2;
            const cy = py * pixelSize + pixelSize / 2;
            const dx = cx - brushRadiusPx;
            const dy = cy - brushRadiusPx;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist <= brushRadiusPx) {
              const intensity = 1 - dist / brushRadiusPx;
              let fillColor: string;
              if (intensity > 0.7) fillColor = colors.accent.pink[400];
              else if (intensity > 0.4) fillColor = colors.accent.purple[400];
              else if (intensity > 0.2) fillColor = colors.accent.blue[400];
              else fillColor = colors.primary[300];
              bctx.fillStyle = fillColor;
              bctx.fillRect(
                px * pixelSize,
                py * pixelSize,
                pixelSize,
                pixelSize
              );
            }
          }
        }
      }
      brushCanvasRef.current = brushCanvas;

      // колбэк для уведомления родителя
      onInitCanvas();
    }, [onInitCanvas, drawBackground, pixelSize]);

    const drawOnCanvas = useCallback(
      (x: number, y: number, prevX: number, prevY: number) => {
        const ctx = ctxRef.current;
        const canvas = canvasRef.current;
        const brush = brushCanvasRef.current;
        if (!ctx || !canvas || !brush) return;

        // актуальные координаты canvas для точного позиционирования
        const rect = canvas.getBoundingClientRect();

        // Локальные координаты относительно canvas
        const canvasX = x - rect.left;
        const canvasY = y - rect.top;
        const canvasPrevX = prevX - rect.left;
        const canvasPrevY = prevY - rect.top;

        // Линейная интерполяция между точками, шаг по половине пикселя для плавности
        const distance = Math.hypot(
          canvasX - canvasPrevX,
          canvasY - canvasPrevY
        );
        const step = Math.max(1, Math.floor(pixelSize / 2));
        const steps = Math.max(1, Math.floor(distance / step));
        if (!gridLockedRef.current) {
          const rPx = brushRadiusCellsRef.current * pixelSize;
          const offX = (((canvasX - rPx) % pixelSize) + pixelSize) % pixelSize;
          const offY = (((canvasY - rPx) % pixelSize) + pixelSize) % pixelSize;
          gridOffsetRef.current = { x: offX, y: offY };
          // фон с новым оффсетом один раз
          drawBackground();
          gridLockedRef.current = true;
        }

        for (let i = 0; i <= steps; i++) {
          const t = steps > 0 ? i / steps : 0;
          const interpX = canvasPrevX + (canvasX - canvasPrevX) * t;
          const interpY = canvasPrevY + (canvasY - canvasPrevY) * t;
          // Визуальный snap: рисуем штамп кратно сетке, используя зафиксированный оффсет
          const rPx = brushRadiusCellsRef.current * pixelSize;
          const off = gridOffsetRef.current;
          const snappedX =
            Math.round((interpX - rPx - off.x) / pixelSize) * pixelSize + off.x;
          const snappedY =
            Math.round((interpY - rPx - off.y) / pixelSize) * pixelSize + off.y;
          ctx.drawImage(brush, snappedX, snappedY);
        }
      },
      [pixelSize, drawBackground]
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
          pointerEvents: "none",
        }}
      />
    );
  }
);

ContactCanvas.displayName = "ContactCanvas";

export default ContactCanvas;
