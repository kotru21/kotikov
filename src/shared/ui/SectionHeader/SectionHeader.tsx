import type { ReactNode } from "react";

interface SectionHeaderProps {
  eyebrow: ReactNode;
  title: ReactNode;
  titleId?: string;
  description?: ReactNode;
  align?: "left" | "center";
  tone?: "default" | "on-gradient";
  className?: string;
}

const eyebrowClasses =
  "text-sm font-bold tracking-[0.24em] uppercase text-primary-950 dark:text-primary-300 mb-3";

export function SectionHeader({
  eyebrow,
  title,
  titleId,
  description,
  align = "left",
  tone = "default",
  className = "",
}: SectionHeaderProps): React.JSX.Element {
  const alignClasses = align === "center" ? "text-center" : "text-left";
  const descriptionAlignClasses = align === "center" ? "mx-auto max-w-xl" : "max-w-2xl";
  const titleClasses =
    tone === "on-gradient"
      ? "text-[clamp(2.25rem,5vw,3rem)] text-balance font-black tracking-tight uppercase text-white drop-shadow-sm"
      : "text-[clamp(2.25rem,5vw,3rem)] text-balance font-black tracking-tight uppercase text-text-primary dark:text-text-inverse";
  const descriptionToneClasses =
    tone === "on-gradient" ? "text-neutral-100" : "text-text-secondary dark:text-neutral-400";

  return (
    <header className={`mb-8 lg:mb-12 ${alignClasses} ${className}`.trim()}>
      {typeof eyebrow === "string" ? <p className={eyebrowClasses}>{eyebrow}</p> : eyebrow}
      <h2 id={titleId} className={titleClasses}>
        {title}
      </h2>
      {description !== undefined && description !== null ? (
        <div
          className={`mt-4 max-w-2xl text-base leading-8 font-medium sm:text-lg ${descriptionToneClasses} ${descriptionAlignClasses}`}
        >
          {description}
        </div>
      ) : null}
    </header>
  );
}

export default SectionHeader;
