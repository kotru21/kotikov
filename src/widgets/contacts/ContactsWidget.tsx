"use client";

import React, { useCallback, useRef } from "react";

import { usePawAnimation } from "@/features/paw";
import { contactsData } from "@/shared/config/content";

import { type ContactCanvasRef , ContactsView } from "./ui";

const ContactsWidget: React.FC = () => {
  const canvasRef = useRef<ContactCanvasRef>(null);

  const handleDraw = useCallback(
    (x: number, y: number, prevX: number, prevY: number) => {
      canvasRef.current?.drawOnCanvas(x, y, prevX, prevY);
    },
    []
  );

  const handleCanvasInit = useCallback(() => {
    // Колбэк для инициализации холста
  }, []);

  const {
    pawPos,
    pawVelocity,
    isDrawing,
    handlers: {
      handlePointerEnter,
      handlePointerMove,
      handlePointerLeave,
      handlePointerDown,
      handlePointerUp,
      handlePointerCancel,
    },
  } = usePawAnimation(handleDraw);

  const handleClearCanvas = (): void => {
    canvasRef.current?.initCanvas();
  };

  return (
    <ContactsView
      contacts={contactsData}
      pawPos={pawPos}
      pawVelocity={pawVelocity}
      isDrawing={isDrawing}
      onClearCanvas={handleClearCanvas}
      onCanvasInit={handleCanvasInit}
      canvasRef={canvasRef}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    />
  );
};

export default ContactsWidget;
