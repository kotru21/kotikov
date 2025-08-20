"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { contactsData } from "@/entities/contact/data";
import { usePawAnimation } from "@/features/paw/usePawAnimation";
import type { ContactCanvasRef } from "./ui";
import { ContactsView } from "./ui";

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
    handlers: { handleMouseEnter, handleMouseMove, handleMouseLeave },
  } = usePawAnimation(handleDraw);

  const handleClearCanvas = () => {
    canvasRef.current?.initCanvas();
  };

  useEffect(() => {
    const section = document.getElementById("contacts-section");
    if (!section) return;

    section.addEventListener("mouseenter", handleMouseEnter);
    section.addEventListener("mouseleave", handleMouseLeave);
    section.addEventListener("mousemove", handleMouseMove);

    return () => {
      section.removeEventListener("mouseenter", handleMouseEnter);
      section.removeEventListener("mouseleave", handleMouseLeave);
      section.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseEnter, handleMouseLeave, handleMouseMove]);

  return (
    <ContactsView
      contacts={contactsData}
      pawPos={pawPos}
      pawVelocity={pawVelocity}
      isDrawing={isDrawing}
      onClearCanvas={handleClearCanvas}
      onCanvasInit={handleCanvasInit}
      canvasRef={canvasRef}
    />
  );
};

export default ContactsWidget;
