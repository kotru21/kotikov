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

    const brushRadius = 20;
    const pixelSize = CONTACT_CANVAS_PIXEL_SIZE;

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

      drawBackground();
      onInitCanvas();
    }, [onInitCanvas, drawBackground]);

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
                const intensity = 1 - distanceFromBrush / brushRadius;

                let fillColor: string;
                if (intensity > 0.7) fillColor = colors.accent.pink[400];
                else if (intensity > 0.4) fillColor = colors.accent.purple[400];
                else if (intensity > 0.2) fillColor = colors.accent.blue[400];
                else fillColor = colors.accent.blue[500];

                const pixelX = pixelCenterX - pixelSize / 2;
                const pixelY = pixelCenterY - pixelSize / 2;

                ctx.fillStyle = fillColor;
                ctx.fillRect(pixelX, pixelY, pixelSize, pixelSize);

                ctx.strokeStyle = colors.primary[600] + "20";
                ctx.lineWidth = 0.5;
                ctx.strokeRect(pixelX, pixelY, pixelSize, pixelSize);
              }
            }
          }
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
