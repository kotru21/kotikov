"use client";

import React, { memo, useLayoutEffect, useRef } from "react";

import { InteractiveTextContext } from "../model/context";
import type { InteractiveTextRegistry } from "../model/types";

interface InteractiveTextProps {
  text: string;
  className?: string;
  /** Solid paint fill so giant headings keep contrast over speckled canvas. */
  contrast?: "solid";
}

interface InteractiveUnitProps extends InteractiveTextRegistry {
  text: string;
  contrast?: "solid";
}

const InteractiveUnit = memo(
  ({ text, register, unregister, contrast }: InteractiveUnitProps): React.JSX.Element => {
    const ref = useRef<HTMLSpanElement>(null);

    useLayoutEffect(() => {
      const el = ref.current;
      if (el !== null) register(el);
      return (): void => {
        if (el !== null) unregister(el);
      };
    }, [register, unregister]);

    return (
      <span
        ref={ref}
        className="relative inline-block transition-colors duration-200"
        data-interactive-mode={contrast}
      >
        {text === " " ? "\u00A0" : text}
      </span>
    );
  }
);

InteractiveUnit.displayName = "InteractiveUnit";

function clearPaintInlineStyles(el: HTMLElement): void {
  el.style.removeProperty("color");
  el.style.removeProperty("background-color");
  el.style.removeProperty("border-color");
  el.style.removeProperty("box-shadow");
}

export const InteractiveElement = <T extends React.ElementType = "div">({
  children,
  className,
  as,
  style,
  ...rest
}: {
  as?: T;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
} & React.ComponentPropsWithoutRef<T>): React.JSX.Element => {
  const Component = as ?? "div";
  const registry = React.useContext(InteractiveTextContext);
  const ref = useRef<HTMLElement>(null);
  const drawExclude = rest["data-draw-exclude"];

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!registry) return;

    if (drawExclude !== undefined) {
      clearPaintInlineStyles(el);
      return;
    }

    registry.register(el);
    return (): void => {
      registry.unregister(el);
    };
  }, [registry, drawExclude]);

  const classNameValue = className ?? "";
  const props: Record<string, unknown> = {
    ...rest,
    ref,
    className: `${classNameValue} transition-colors duration-200`,
    ...(style !== undefined ? { style } : {}),
  };

  return <Component {...props}>{children}</Component>;
};

export const InteractiveText: React.FC<InteractiveTextProps> = ({
  text,
  className,
  contrast,
}) => {
  const registry = React.useContext(InteractiveTextContext);

  if (!registry) {
    return <span className={className}>{text}</span>;
  }

  const words = text.split(" ");
  return (
    <span className={className}>
      {/* Word-level paint targets (fewer layout reads than per-glyph). */}
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, wordIndex) => (
          <React.Fragment key={`word-${word}-${String(wordIndex)}`}>
            <InteractiveUnit
              contrast={contrast}
              text={word}
              register={registry.register}
              unregister={registry.unregister}
            />
            {wordIndex < words.length - 1 ? (
              <InteractiveUnit
                contrast={contrast}
                text=" "
                register={registry.register}
                unregister={registry.unregister}
              />
            ) : null}
          </React.Fragment>
        ))}
      </span>
    </span>
  );
};
