import React, { memo, useEffect, useRef } from "react";

import { InteractiveTextContext } from "../model/context";
import type { InteractiveTextRegistry } from "../model/types";

interface InteractiveTextProps {
  text: string;
  className?: string;
}

const InteractiveChar = memo(
  ({
    char,
    register,
    unregister,
  }: { char: string } & InteractiveTextRegistry): React.JSX.Element => {
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
      const el = ref.current;
      if (el !== null) register(el);
      return (): void => {
        if (el !== null) unregister(el);
      };
    }, [register, unregister]);

    return (
      <span ref={ref} className="relative inline-block transition-colors duration-200">
        {char === " " ? "\u00A0" : char}
      </span>
    );
  }
);

InteractiveChar.displayName = "InteractiveChar";

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

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!registry) return;
    if (el.hasAttribute("data-draw-exclude")) return;

    registry.register(el);
    return (): void => {
      registry.unregister(el);
    };
  }, [registry]);

  const classNameValue = className ?? "";
  const props: Record<string, unknown> = {
    ...rest,
    ref,
    className: `${classNameValue} transition-colors duration-200`,
    ...(style !== undefined ? { style } : {}),
  };

  return <Component {...props}>{children}</Component>;
};

export const InteractiveText: React.FC<InteractiveTextProps> = ({ text, className }) => {
  const registry = React.useContext(InteractiveTextContext);

  if (!registry) {
    return <span className={className}>{text}</span>;
  }

  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, wordIndex) => (
        <React.Fragment key={`word-${word}-${String(wordIndex)}`}>
          <span className="inline-block whitespace-nowrap">
            {word.split("").map((char, charIndex) => (
              <InteractiveChar
                key={`char-${word}-${String(charIndex)}`}
                char={char}
                register={registry.register}
                unregister={registry.unregister}
              />
            ))}
          </span>
          {wordIndex < words.length - 1 && (
            <InteractiveChar
              char=" "
              register={registry.register}
              unregister={registry.unregister}
            />
          )}
        </React.Fragment>
      ))}
    </span>
  );
};
