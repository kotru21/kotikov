"use client";

import React from "react";

import { ContactCard, type ContactInfo } from "@/entities/contact";
import { InteractiveElement, InteractiveText } from "@/features/interactive-elements";
import { ClearPaintButton, PaintDrawHint } from "@/features/paw";
import { formatExternalLinkLabel, isHttpUrl } from "@/shared/lib";
import { Button, Section, SectionHeader } from "@/shared/ui";
import { colors } from "@/styles/colors";

import { ContactCanvas } from ".";
import type { ContactCanvasRef } from "./ContactCanvas";

interface ContactsViewProps {
  contacts: ContactInfo[];
  isDrawing: boolean;
  /** Keep canvas mounted (preserves paint state). Independent of in-view gating. */
  mountPaint: boolean;
  /** Active paint interaction (in view + visible + not reduced motion). */
  enablePaint: boolean;
  onClearCanvas: () => void;
  canvasRef: React.RefObject<ContactCanvasRef | null>;
  sectionRef?: React.RefObject<HTMLElement | null>;
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
  isDrawing,
  mountPaint,
  enablePaint,
  onClearCanvas,
  canvasRef,
  sectionRef,
  onPointerEnter,
  onPointerMove,
  onPointerLeave,
  onPointerDown,
  onPointerUp,
  onPointerCancel,
}) => {
  return (
    <Section
      ref={sectionRef}
      id="contacts"
      spacing="cta"
      className="relative overflow-hidden"
      style={{
        touchAction: isDrawing ? "none" : "pan-y",
      }}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    >
      {mountPaint ? (
        <ContactCanvas ref={canvasRef} />
      ) : (
        <div
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{ background: CONTACTS_GRADIENT }}
        />
      )}

      <div className="relative z-[calc(var(--z-content)+10)]">
        <SectionHeader
          align="center"
          tone="on-gradient"
          eyebrow={
            <InteractiveElement
              as="p"
              data-draw-allow
              data-interactive-mode="solid"
              data-interactive-bg={colors.primary[500]}
              data-interactive-text="black"
              data-interactive-threshold="0.12"
              className="text-text-primary dark:text-text-inverse border-l-primary-500 bg-background-primary dark:border-l-primary-400 dark:bg-background-tertiary mb-3 inline-block border-2 border-l-4 border-black px-3 py-1 text-sm font-bold tracking-[0.24em] uppercase dark:border-white"
            >
              <InteractiveText text="Контакты" />
            </InteractiveElement>
          }
          title={<InteractiveText text="Напишите мне" />}
          description={
            <div className="flex flex-col items-center gap-3">
              <InteractiveElement
                as="p"
                data-draw-allow
                data-interactive-color={colors.text.primary}
                className="text-lg font-medium text-neutral-100 drop-shadow-sm"
              >
                <InteractiveText text="Открыт к интересным задачам и сотрудничеству. Лучший способ — почта или Telegram." />
              </InteractiveElement>
              {enablePaint ? <PaintDrawHint tone="on-gradient" /> : null}
            </div>
          }
        />

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 bg-transparent md:grid-cols-4">
          {contacts.map((contact, index) => {
            let gridClasses = "col-span-1";
            let variant: "auto" | "light" | "dark" = "auto";

            if (index === 0) {
              gridClasses = "md:col-span-2 md:row-span-2 min-h-[220px] md:min-h-[320px]";
              variant = "auto";
            } else if (index === 1) {
              gridClasses = "md:col-span-2 min-h-[112px] md:min-h-[150px]";
              variant = "light";
            } else if (index === 2) {
              gridClasses = "md:col-span-2 min-h-[112px] md:min-h-[150px]";
              variant = "dark";
            }

            const interactiveMode = variant === "light" ? "border" : "solid";
            const opensNewTab = contact.link !== undefined && isHttpUrl(contact.link);

            return (
              <div key={contact.label} className={`${gridClasses} h-full`}>
                <InteractiveElement
                  as={Button}
                  variant="primary"
                  fullWidth
                  fullHeight
                  href={contact.link ?? undefined}
                  target={opensNewTab ? "_blank" : undefined}
                  rel={opensNewTab ? "noopener noreferrer" : undefined}
                  aria-label={
                    opensNewTab
                      ? formatExternalLinkLabel(contact.label)
                      : `Написать: ${contact.value}`
                  }
                  shadowColor={colors.primary[500]}
                  data-draw-allow
                  data-interactive-mode={interactiveMode}
                  data-interactive-bg={colors.primary[500]}
                  data-interactive-text={variant === "dark" ? "white" : "black"}
                  {...(interactiveMode === "solid"
                    ? {
                        "data-interactive-shadow": `var(--shadow-hard-pressed)`,
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
          <div className="mt-8 flex justify-center md:mt-10">
            <ClearPaintButton onClick={onClearCanvas} tone="on-gradient" />
          </div>
        ) : null}
      </div>
    </Section>
  );
};

export default ContactsView;
