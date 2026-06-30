import React, { memo, useEffect, useRef, useState } from "react";

import { PawCursorIcon } from "@/features/paw";

interface CatPawProps {
  x: number;
  y: number;
  isActive: boolean;
  velocity: { x: number; y: number };
}

const CatPaw: React.FC<CatPawProps> = memo(({ x, y, isActive, velocity }) => {
  const [isVisible, setIsVisible] = useState(true);
  const coordsRef = useRef({ x, y });

  useEffect(() => {
    coordsRef.current = { x, y };
  }, [x, y]);

  useEffect(() => {
    const checkBounds = (): void => {
      const contactsSection = document.getElementById("contacts");
      if (contactsSection === null) {
        setIsVisible(false);
        return;
      }

      const rect = contactsSection.getBoundingClientRect();
      const pawSize = 50;
      const { x: cx, y: cy } = coordsRef.current;
      const isInBounds =
        cx >= rect.left - pawSize &&
        cx <= rect.right + pawSize &&
        cy >= rect.top - pawSize &&
        cy <= rect.bottom + pawSize;

      setIsVisible(isInBounds);
    };

    checkBounds();

    let scrollTimeoutId: ReturnType<typeof setTimeout>;
    let resizeTimeoutId: ReturnType<typeof setTimeout>;

    const debouncedCheckBounds = (): void => {
      clearTimeout(scrollTimeoutId);
      scrollTimeoutId = setTimeout(checkBounds, 50);
    };

    const debouncedResizeCheck = (): void => {
      clearTimeout(resizeTimeoutId);
      resizeTimeoutId = setTimeout(checkBounds, 150);
    };

    window.addEventListener("scroll", debouncedCheckBounds, { passive: true });
    window.addEventListener("resize", debouncedResizeCheck, { passive: true });

    return () => {
      window.removeEventListener("scroll", debouncedCheckBounds);
      window.removeEventListener("resize", debouncedResizeCheck);
      clearTimeout(scrollTimeoutId);
      clearTimeout(resizeTimeoutId);
    };
  }, [x, y]);

  const rotationAngle = Math.atan2(velocity.y, velocity.x) * (180 / Math.PI) * 0.1;
  const tiltAngle = isActive ? Math.max(-15, Math.min(15, rotationAngle)) : 0;
  const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
  const scaleBoost = 1 + Math.min(speed * 0.01, 0.2);

  if (!isVisible || !isActive) return null;

  return (
    <div
      aria-hidden="true"
      className="text-primary-500 pointer-events-none fixed z-50 drop-shadow-[0_8px_16px_rgba(0,255,185,0.35)]"
      style={{
        left: x - 25,
        top: y - 25,
        transform: `translate3d(0, 0, 0) scale(${String(scaleBoost)}) rotate(${String(tiltAngle)}deg)`,
        transition: "transform 0.6s cubic-bezier(0.23, 1, 0.320, 1)",
        willChange: "transform",
        backfaceVisibility: "hidden",
      }}
    >
      <PawCursorIcon className="size-10" />
    </div>
  );
});

CatPaw.displayName = "CatPaw";

export default CatPaw;
