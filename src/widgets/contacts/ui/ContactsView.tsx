"use client";

import React from "react";

import { ContactCard, type ContactInfo } from "@/entities/contact";
import { Button } from "@/shared/ui";
import { colors } from "@/styles/colors";

import type { ContactCanvasRef } from "./ContactCanvas";
import { CatPaw, ContactCanvas } from "./index";

interface ContactsViewProps {
  contacts: ContactInfo[];
  pawPos: { x: number; y: number };
  pawVelocity: { x: number; y: number };
  isDrawing: boolean;
  onClearCanvas: () => void;
  onCanvasInit: () => void;
  canvasRef: React.RefObject<ContactCanvasRef | null>;
  onPointerEnter: React.PointerEventHandler<HTMLElement>;
  onPointerMove: React.PointerEventHandler<HTMLElement>;
  onPointerLeave: React.PointerEventHandler<HTMLElement>;
  onPointerDown: React.PointerEventHandler<HTMLElement>;
  onPointerUp: React.PointerEventHandler<HTMLElement>;
  onPointerCancel: React.PointerEventHandler<HTMLElement>;
}

const ContactsView: React.FC<ContactsViewProps> = ({
  contacts,
  pawPos,
  pawVelocity,
  isDrawing,
  onClearCanvas,
  onCanvasInit,
  canvasRef,
  onPointerEnter,
  onPointerMove,
  onPointerLeave,
  onPointerDown,
  onPointerUp,
  onPointerCancel,
}) => {
  return (
    <section
      id="contacts-section"
      className="relative min-h-screen md:min-h-40 flex items-center justify-center py-20 overflow-hidden"
      style={{ cursor: isDrawing ? "none" : undefined, touchAction: "pan-y" }}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}>
      {/* Интерактивный фон */}
      <ContactCanvas ref={canvasRef} onInitCanvas={onCanvasInit} />

      {isDrawing && (
        <CatPaw
          x={pawPos.x}
          y={pawPos.y}
          isActive={isDrawing}
          velocity={pawVelocity}
        />
      )}

      {/* Контент секции */}
      <div className="relative z-10 container mx-auto px-4 pointer-events-auto">
        <div className="max-w-6xl mx-auto">
          {/* Заголовок */}
          <div className="mb-12 text-center md:text-left">
            <h2
              className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white mb-4"
              style={{ filter: `drop-shadow(4px 4px 0 ${colors.primary[500]})` }}>
              Связь
            </h2>
            <p className="text-xl font-bold bg-white dark:bg-black inline-block px-4 py-2 border-2 border-black dark:border-white shadow-[4px_4px_0_0_black] dark:shadow-[4px_4px_0_0_white]">
              Пишите, звоните, отправляйте голубей
            </p>
          </div>

          {/* Сетка контактов (Mondrian / Bauhaus Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-transparent max-w-4xl mx-auto">
            {contacts.map((contact, index) => {
               // Логика сетки для 3 элементов (Email, Github, Telegram):
               // 0: Большой квадрат слева (2x2)
               // 1: Широкая плашка сверху справа (2x1)
               // 2: Широкая плашка снизу справа (2x1)
               
               let gridClasses = "col-span-1";
               let variant: "auto" | "light" | "dark" = "auto";

               if (index === 0) {
                 gridClasses = "md:col-span-2 md:row-span-2 min-h-[320px]";
                 variant = "auto";
               } else if (index === 1) {
                 gridClasses = "md:col-span-2 min-h-[150px]";
                 variant = "light";
               } else if (index === 2) {
                 gridClasses = "md:col-span-2 min-h-[150px]";
                 variant = "dark";
               }

               return (
                 <div key={index} className={gridClasses + " h-full"}>
                   <Button
                     variant="primary"
                     fullWidth
                     fullHeight
                   >
                     <div className="w-full">
                       <ContactCard contact={contact} variant={variant} />
                     </div>
                   </Button>
                 </div>
               );
            })}
          </div>

          {/* Кнопка очистки */}
          <div className="mt-16 text-center">
            <Button
              onClick={onClearCanvas}
              variant="primary"
              size="lg"
              shadowColor={colors.primary[500]}>
              ОЧИСТИТЬ ХОЛСТ
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactsView;

