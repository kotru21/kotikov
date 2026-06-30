import React from "react";

interface SectionHeaderProps {
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  titleId?: string;
  description?: React.ReactNode;
  align?: "left" | "center";
  tone?: "default" | "on-gradient";
  className?: string;
}

const eyebrowClasses =
  "text-sm font-bold tracking-[0.24em] uppercase text-primary-950 dark:text-primary-300 mb-3";

const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  titleId,
  description,
  align = "left",
  tone = "default",
  className = "",
}) => {
  const alignClasses = align === "center" ? "text-center" : "text-left";
  const descriptionAlignClasses = align === "center" ? "mx-auto max-w-xl" : "max-w-2xl";
  const titleClasses =
    tone === "on-gradient"
      ? "text-4xl sm:text-5xl font-black tracking-tight uppercase text-white drop-shadow-sm"
      : "text-4xl sm:text-5xl font-black tracking-tight uppercase text-text-primary dark:text-text-inverse";
  const descriptionToneClasses =
    tone === "on-gradient" ? "text-neutral-100/90" : "text-text-secondary dark:text-neutral-400";

  return (
    <header className={`mb-8 lg:mb-12 ${alignClasses} ${className}`.trim()}>
      {typeof eyebrow === "string" ? <p className={eyebrowClasses}>{eyebrow}</p> : eyebrow}
      <h2 id={titleId} className={titleClasses}>
        {title}
      </h2>
      {description !== undefined && description !== null ? (
        <div
          className={`mt-4 max-w-2xl text-lg leading-8 font-medium ${descriptionToneClasses} ${descriptionAlignClasses}`}
        >
          {description}
        </div>
      ) : null}
    </header>
  );
};

export default SectionHeader;
