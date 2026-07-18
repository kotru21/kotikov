import type { HTMLAttributes, ReactNode, Ref } from "react";

interface SectionProps extends Omit<
  HTMLAttributes<HTMLElement>,
  "children" | "className" | "id"
> {
  id?: string;
  children: ReactNode;
  spacing?: "standard" | "dense" | "cta" | "footer" | "none";
  backgroundClassName?: string;
  className?: string;
  innerClassName?: string;
  /** When false, skips default horizontal padding and max-width (full-bleed sections). */
  contained?: boolean;
  as?: "section" | "footer";
  ref?: Ref<HTMLElement>;
}

const spacingClasses = {
  standard: "py-[var(--section-space-standard)]",
  dense: "py-[var(--section-space-dense)]",
  cta: "py-[var(--section-space-cta)]",
  footer: "pt-12 pb-16",
  none: "",
} as const;

const containedClasses = "px-6 lg:px-8 max-w-6xl mx-auto";
const bleedClasses = "w-full max-w-none";

export function Section({
  id,
  children,
  spacing = "standard",
  backgroundClassName = "",
  className = "",
  innerClassName = "",
  contained = true,
  as: rootTag = "section",
  ref,
  ...nativeProps
}: SectionProps): React.JSX.Element {
  const rootClasses = [
    "relative transition-colors duration-300",
    spacing !== "none" ? spacingClasses[spacing] : "",
    backgroundClassName,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const containerClasses = contained ? containedClasses : bleedClasses;
  const RootTag = rootTag;

  return (
    <RootTag ref={ref} id={id} className={rootClasses} {...nativeProps}>
      <div className={`${containerClasses} ${innerClassName}`.trim()}>{children}</div>
    </RootTag>
  );
}

export default Section;
