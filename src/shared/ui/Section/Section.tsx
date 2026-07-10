import React from "react";

interface SectionProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "children" | "className" | "id"
> {
  id?: string;
  children: React.ReactNode;
  spacing?: "standard" | "dense" | "cta" | "footer" | "none";
  backgroundClassName?: string;
  className?: string;
  innerClassName?: string;
  as?: "section" | "footer";
}

const spacingClasses = {
  standard: "py-[var(--section-space-standard)]",
  dense: "py-[var(--section-space-dense)]",
  cta: "py-[var(--section-space-cta)]",
  footer: "pt-12 pb-16",
  none: "",
} as const;

const containerClasses = "px-6 lg:px-8 max-w-6xl mx-auto";

const Section = React.forwardRef<HTMLElement, SectionProps>(
  (
    {
      id,
      children,
      spacing = "standard",
      backgroundClassName = "",
      className = "",
      innerClassName = "",
      as: rootTag = "section",
      ...nativeProps
    },
    ref
  ) => {
    const rootClasses = [
      "relative transition-colors duration-300",
      spacing !== "none" ? spacingClasses[spacing] : "",
      backgroundClassName,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const RootTag = rootTag;

    return (
      <RootTag ref={ref} id={id} className={rootClasses} {...nativeProps}>
        <div className={`${containerClasses} ${innerClassName}`.trim()}>{children}</div>
      </RootTag>
    );
  }
);

Section.displayName = "Section";

export default Section;
