import type { ElementType, ReactNode } from "react";

interface MockInteractiveElementProps {
  children?: ReactNode;
  as?: ElementType;
  [key: string]: unknown;
}

/**
 * Test stand-in for InteractiveElement: forwards to `as` (e.g. Button) so
 * component-only props are not dumped onto raw DOM nodes.
 */
export function MockInteractiveElement({
  children,
  as: Component = "div",
  ...props
}: MockInteractiveElementProps): React.JSX.Element {
  return <Component {...props}>{children}</Component>;
}

export function MockInteractiveText({ text }: { text: string }): string {
  return text;
}
