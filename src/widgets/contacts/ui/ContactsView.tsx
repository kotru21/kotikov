"use client";

import React from "react";

import { ContactCard, type ContactInfo, type ContactLayout } from "@/entities/contact";
import { InteractiveElement, InteractiveText } from "@/features/interactive-elements";
import { ClearPaintButton, PaintDrawHint } from "@/features/paw";
import { formatExternalLinkLabel, isHttpUrl } from "@/shared/lib";
import { Button, Section, SectionHeader } from "@/shared/ui";
import { colors } from "@/styles/colors";

import { CONTACTS_GRADIENT } from "./constants";
import ContactCanvas, { type ContactCanvasRef } from "./ContactCanvas";

interface ContactsViewProps {
  contacts: readonly ContactInfo[];
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

interface ContactLayoutStyles {
  gridClasses: string;
  variant: "auto" | "light" | "dark";
  buttonVariant: "primary" | "secondary";
  buttonClassName: string;
}

const LAYOUT_STYLES: Record<ContactLayout, ContactLayoutStyles> = {
  hero: {
    gridClasses: "md:col-span-2 md:row-span-2 min-h-[220px] md:min-h-[320px]",
    variant: "auto",
    buttonVariant: "primary",
    buttonClassName: "",
  },
  "secondary-light": {
    gridClasses: "md:col-span-2 min-h-[112px] md:min-h-[150px]",
    variant: "light",
    buttonVariant: "secondary",
    buttonClassName: "",
  },
  "secondary-dark": {
    gridClasses: "md:col-span-2 min-h-[112px] md:min-h-[150px]",
    variant: "dark",
    buttonVariant: "secondary",
    // Ink surface (secondary is paper by default). ! beats variant utilities.
    buttonClassName:
      "!bg-neutral-950 !text-neutral-50 hover:!bg-neutral-950 dark:!bg-neutral-50 dark:!text-neutral-950 dark:hover:!bg-neutral-50",
  },
};

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
            </div>
          }
        />

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 bg-transparent md:grid-cols-4">
          {contacts.map((contact) => {
            const layout = LAYOUT_STYLES[contact.layout];
            const opensNewTab = contact.link !== undefined && isHttpUrl(contact.link);

            return (
              <div key={contact.label} className={`${layout.gridClasses} h-full`}>
                <InteractiveElement
                  as={Button}
                  variant={layout.buttonVariant}
                  className={layout.buttonClassName}
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
                  data-interactive-mode="solid"
                  data-interactive-bg={colors.primary[500]}
                  data-interactive-text="black"
                  data-interactive-shadow="var(--shadow-hard-pressed)"
                  data-interactive-threshold="0.1"
                >
                  <ContactCard
                    contact={contact}
                    variant={layout.variant}
                    label={<InteractiveText text={contact.label} />}
                    value={<InteractiveText text={contact.value} />}
                  />
                </InteractiveElement>
              </div>
            );
          })}
        </div>

        {enablePaint ? (
          <>
            <p className="sr-only">
              На фоне можно оставить след лапы, проводя мышью или удерживая палец.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 md:mt-10">
              <PaintDrawHint tone="on-gradient" />
              <ClearPaintButton onClick={onClearCanvas} tone="on-gradient" />
            </div>
          </>
        ) : null}
      </div>
    </Section>
  );
};

export default ContactsView;
