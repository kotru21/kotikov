import React, { memo, useEffect, useRef } from "react";

import { InteractiveTextContext } from "../model/context";
import { InteractiveTextRegistry } from "../model/types";

interface InteractiveTextProps {
  text: string;
  className?: string;
}

const InteractiveChar = memo(
  ({
    char,
    register,
    unregister,
  }: { char: string } & InteractiveTextRegistry) => {
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
      const el = ref.current;
      if (el) register(el);
      return () => {
        if (el) unregister(el);
      };
    }, [register, unregister]);

    return (
      <span
        ref={ref}
        className="relative inline-block transition-colors duration-200">
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
} & React.ComponentPropsWithoutRef<T>) => {
  const Component = as || "div";
  const registry = React.useContext(InteractiveTextContext);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (el && registry) registry.register(el);
    return () => {
      if (el && registry) registry.unregister(el);
    };
  }, [registry]);

  const props = {
    ...rest,
    ref,
    className: `${className || ""} transition-colors duration-200`,
    ...(style ? { style } : {}),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;

  return <Component {...props}>{children}</Component>;
};

export const InteractiveText: React.FC<InteractiveTextProps> = ({
  text,
  className,
}) => {
  const registry = React.useContext(InteractiveTextContext);

  if (!registry) {
    return <span className={className}>{text}</span>;
  }

  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, index) => (
        <React.Fragment key={index}>
          <span className="inline-block whitespace-nowrap">
            {word.split("").map((char, charIndex) => (
              <InteractiveChar
                key={charIndex}
                char={char}
                register={registry.register}
                unregister={registry.unregister}
              />
            ))}
          </span>
          {index < words.length - 1 && (
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
