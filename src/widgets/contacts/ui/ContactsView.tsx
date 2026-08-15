"use client";

import React, { type ReactNode } from "react";

import { ClearPaintButton } from "@/features/paw/client";
import { GRID_SURFACE, Section } from "@/shared/ui";

import ContactCanvas, { type ContactCanvasRef } from "./ContactCanvas";

interface ContactsViewProps {
  children: ReactNode;
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

function ContactsPaintWell({
  enablePaint,
  onClearCanvas,
}: {
  enablePaint: boolean;
  onClearCanvas: () => void;
}): React.JSX.Element {
  return (
    <div className="relative min-h-[12rem] flex-1 md:min-h-0 md:flex-none" data-contacts-paint-well>
      <div className="absolute top-3 right-3 z-10 md:static md:flex md:flex-col md:items-center md:gap-3 md:p-4">
        <ClearPaintButton onClick={onClearCanvas} disabled={!enablePaint} />
      </div>
    </div>
  );
}

const ContactsView: React.FC<ContactsViewProps> = ({
  children,
  isDrawing,
  mountPaint,
  enablePaint,
  onClearCanvas,
  canvasRef,
  sectionRef,
  ...pointerHandlers
}) => {
  return (
    <Section
      ref={sectionRef}
      id="contacts"
      contained={false}
      spacing="none"
      className="min-h-[20rem] overflow-hidden"
      innerClassName="relative min-h-[20rem]"
      backgroundClassName={GRID_SURFACE}
      style={{ touchAction: isDrawing ? "none" : "pan-y" }}
      {...pointerHandlers}
    >
      {mountPaint ? <ContactCanvas ref={canvasRef} /> : null}
      <div className="relative z-10 flex min-h-[20rem] flex-col md:block md:min-h-0">
        {children}
        {mountPaint ? (
          <ContactsPaintWell enablePaint={enablePaint} onClearCanvas={onClearCanvas} />
        ) : null}
      </div>
    </Section>
  );
};

export default ContactsView;
