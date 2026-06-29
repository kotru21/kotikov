import React from "react";

interface SectionProps {
  id?: string;
  children: React.ReactNode;
  spacing?: "default" | "compact";
  backgroundClassName?: string;
  className?: string;
  innerClassName?: string;
  as?: "section" | "footer";
  ref?: React.Ref<HTMLElement>;
}

const spacingClasses = {
  default: "py-24",
  compact: "py-16",
} as const;

const containerClasses = "px-6 lg:px-8 max-w-6xl mx-auto";

const Section: React.FC<SectionProps> = ({
  id,
  children,
  spacing = "default",
  backgroundClassName = "",
  className = "",
  innerClassName = "",
  as: Tag = "section",
  ref,
}) => {
  const rootClasses = [
    "relative transition-colors duration-300",
    spacing !== undefined ? spacingClasses[spacing] : "",
    backgroundClassName,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag ref={ref} id={id} className={rootClasses}>
      <div className={`${containerClasses} ${innerClassName}`.trim()}>{children}</div>
    </Tag>
  );
};

export default Section;
