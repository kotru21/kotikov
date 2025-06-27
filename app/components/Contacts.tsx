"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { colors } from "../styles/colors";
import { contactsData } from "../data/contacts";
import { usePawAnimation } from "../hooks/usePawAnimation";
import {
  CatPaw,
  ContactCard,
  ContactCanvas,
  ContactCanvasRef,
} from "./Contacts/index";

const Contacts: React.FC = () => {
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
    <section
      id="contacts-section"
      className="relative min-h-screen md:min-h-40 flex items-center justify-center py-20 overflow-hidden"
      style={{ cursor: "none" }}>
      {/* Интерактивный фон */}
      <ContactCanvas ref={canvasRef} onInitCanvas={handleCanvasInit} />

      {/* Кошачья лапа следует за курсором */}
      {isDrawing && (
        <CatPaw
          x={pawPos.x}
          y={pawPos.y}
          isActive={isDrawing}
          velocity={pawVelocity}
        />
      )}

      {/* Карточка контактов */}
      <div className="relative z-10 max-w-2xl mx-auto px-6">
        <div
          className="backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/10"
          style={{
            background: `linear-gradient(135deg, ${colors.neutral[50]}15, ${colors.neutral[100]}10)`,
          }}>
          {/* Заголовок */}
          <div className="text-center mb-8">
            <h2
              className="text-4xl font-bold mb-4"
              style={{ color: colors.neutral[50] }}>
              Мои контакты
            </h2>
          </div>

          {/* Сетка контактов */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contactsData.map((contact, index) => (
              <ContactCard key={index} contact={contact} />
            ))}
          </div>

          {/* Кнопка очистки */}
          <div className="mt-6 text-center">
            <button
              onClick={handleClearCanvas}
              className="px-8 py-3 rounded-xl font-medium transition-all duration-500 hover:scale-110 hover:shadow-xl transform hover:-translate-y-1"
              style={{
                background: `linear-gradient(135deg, ${colors.accent.blue[500]}, ${colors.accent.purple[500]}, ${colors.accent.pink[500]})`,
                color: colors.neutral[50],
                boxShadow: `0 8px 32px ${colors.accent.purple[500]}20`,
              }}>
              🐾 Очистить холст
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contacts;
