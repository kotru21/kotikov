"use client";

import React from "react";

import { ContactCard, type ContactInfo } from "@/entities/contact";
import { InteractiveElement, InteractiveText } from "@/features/interactive-elements";
import { Button } from "@/shared/ui";
import { colors } from "@/styles/colors";

import { CatPaw, ContactCanvas } from ".";
import type { ContactCanvasRef } from "./ContactCanvas";

interface ContactsViewProps {
  contacts: ContactInfo[];
  pawPos: { x: number; y: number };
  pawVelocity: { x: number; y: number };
  isDrawing: boolean;
  showPaw: boolean;
  enablePaint: boolean;
  onClearCanvas: () => void;
  canvasRef: React.RefObject<ContactCanvasRef | null>;
  onPointerEnter: React.PointerEventHandler<HTMLElement>;
  onPointerMove: React.PointerEventHandler<HTMLElement>;
  onPointerLeave: React.PointerEventHandler<HTMLElement>;
  onPointerDown: React.PointerEventHandler<HTMLElement>;
  onPointerUp: React.PointerEventHandler<HTMLElement>;
  onPointerCancel: React.PointerEventHandler<HTMLElement>;
}

const CONTACTS_GRADIENT = `linear-gradient(135deg, ${colors.primary[900]}, ${colors.primary[800]} 50%, ${colors.primary[700]})`;

const ContactsView: React.FC<ContactsViewProps> = ({
  contacts,
  pawPos,
  pawVelocity,
  isDrawing,
  showPaw,
  enablePaint,
  onClearCanvas,
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
      id="contacts"
      className="relative flex min-h-[70vh] items-center justify-center overflow-hidden py-20 md:min-h-[60vh]"
      style={{
        cursor: isDrawing ? "none" : undefined,
        touchAction: isDrawing ? "none" : "pan-y",
      }}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    >
      {enablePaint ? (
        <ContactCanvas ref={canvasRef} />
      ) : (
        <div
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{ background: CONTACTS_GRADIENT }}
        />
      )}

      {showPaw && isDrawing ? (
        <CatPaw x={pawPos.x} y={pawPos.y} isActive={isDrawing} velocity={pawVelocity} />
      ) : null}

      <div className="relative z-10 container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <InteractiveElement
              as="p"
              data-draw-allow
              data-interactive-mode="solid"
              data-interactive-bg={colors.primary[500]}
              data-interactive-text="black"
              data-interactive-threshold="0.12"
              className="text-text-primary dark:text-text-inverse mb-3 inline-block border-2 border-black border-l-4 border-l-primary-500 bg-background-primary px-3 py-1 text-sm font-bold tracking-[0.24em] uppercase dark:border-white dark:border-l-primary-400 dark:bg-background-tertiary"
            >
              <InteractiveText text="Контакты" />
            </InteractiveElement>
            <h2 className="text-4xl font-black tracking-tight text-white uppercase drop-shadow-sm sm:text-5xl">
              <InteractiveText text="Напишите мне" />
            </h2>
            <InteractiveElement
              as="p"
              data-draw-allow
              data-interactive-color={colors.text.primary}
              className="mx-auto mt-3 max-w-xl text-lg font-medium text-neutral-100/90 drop-shadow-sm"
            >
              <InteractiveText text="Открыт к интересным задачам и сотрудничеству. Лучший способ — почта или Telegram." />
            </InteractiveElement>
          </div>
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 bg-transparent md:grid-cols-4">
            {contacts.map((contact, index) => {
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

              const interactiveMode = variant === "light" ? "border" : "solid";

              return (
                <div key={contact.label} className={`${gridClasses} h-full`}>
                  <InteractiveElement
                    as={Button}
                    variant="primary"
                    fullWidth
                    fullHeight
                    href={contact.link ?? undefined}
                    target={contact.link !== undefined ? "_blank" : undefined}
                    rel={contact.link !== undefined ? "noopener noreferrer" : undefined}
                    shadowColor={colors.primary[500]}
                    data-draw-allow
                    data-interactive-mode={interactiveMode}
                    data-interactive-bg={colors.primary[500]}
                    data-interactive-text={variant === "dark" ? "white" : "black"}
                    {...(interactiveMode === "solid"
                      ? {
                          "data-interactive-shadow": `2px 2px 0px 0px ${colors.primary[600]}`,
                          "data-interactive-threshold": "0.1",
                        }
                      : { "data-interactive-color": colors.text.primary })}
                  >
                    <ContactCard
                      contact={contact}
                      variant={variant}
                      label={<InteractiveText text={contact.label} />}
                      value={<InteractiveText text={contact.value} />}
                    />
                  </InteractiveElement>
                </div>
              );
            })}
          </div>

          {enablePaint ? (
            <div className="mt-12 text-center">
              <button
                type="button"
                data-draw-allow
                onClick={onClearCanvas}
                className="text-xs font-bold tracking-wide text-neutral-300 uppercase underline decoration-dotted underline-offset-4 transition-colors hover:text-white"
              >
                Очистить рисунок
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default ContactsView;
