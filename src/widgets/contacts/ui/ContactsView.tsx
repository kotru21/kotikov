"use client";

import React from "react";

import { ContactCard, type ContactInfo } from "@/entities/contact";
import { Button } from "@/shared/ui/Button";

import type { ContactCanvasRef } from "./ContactCanvas";
import { CatPaw,ContactCanvas } from "./index";

interface ContactsViewProps {
  contacts: ContactInfo[];
  pawPos: { x: number; y: number };
  pawVelocity: { x: number; y: number };
  isDrawing: boolean;
  onClearCanvas: () => void;
  onCanvasInit: () => void;
  canvasRef: React.RefObject<ContactCanvasRef | null>;
}

const ContactsView: React.FC<ContactsViewProps> = ({
  contacts,
  pawPos,
  pawVelocity,
  isDrawing,
  onClearCanvas,
  onCanvasInit,
  canvasRef,
}) => {
  return (
    <section
      id="contacts-section"
      className="relative min-h-screen md:min-h-40 flex items-center justify-center py-20 overflow-hidden"
      style={{ cursor: "none" }}>
      {/* Интерактивный фон */}
      <ContactCanvas ref={canvasRef} onInitCanvas={onCanvasInit} />

      {/* Кошачья лапа следует за курсором */}
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
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white mb-4 drop-shadow-[4px_4px_0_rgba(209,44,31,1)]">
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
               let colorClasses = "bg-white dark:bg-neutral-900";
               let variant: "auto" | "light" | "dark" = "auto";

               if (index === 0) {
                 gridClasses = "md:col-span-2 md:row-span-2 min-h-[320px]";
                 colorClasses = "bg-[#f5f5f3] dark:bg-[#111111]"; // Paper/Black
                 variant = "auto";
               } else if (index === 1) {
                 gridClasses = "md:col-span-2 min-h-[150px]";
                 colorClasses = "bg-[#f4bf21] text-black"; // Bauhaus Yellow
                 variant = "light";
               } else if (index === 2) {
                 gridClasses = "md:col-span-2 min-h-[150px]";
                 colorClasses = "bg-[#1b54a7] text-white"; // Bauhaus Blue
                 variant = "dark";
               }

               return (
                <div
                  key={index}
                  className={`
                    group relative border-4 border-black dark:border-white hover:-translate-y-2 transition-transform duration-200
                    ${gridClasses}
                    ${colorClasses}
                    shadow-[8px_8px_0_0_black] dark:shadow-[8px_8px_0_0_white]
                    flex items-center justify-center p-6
                  `}
                >
                  <div className="w-full">
                     <ContactCard contact={contact} variant={variant} />
                  </div>
                </div>
               );
            })}
          </div>

          {/* Кнопка очистки */}
          <div className="mt-16 text-center">
            <Button onClick={onClearCanvas} variant="primary" size="lg">
              ОЧИСТИТЬ ХОЛСТ
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactsView;
