import React from "react";

interface SectionHeaderProps {
  eyebrow: React.ReactNode;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  description,
  align = "left",
  className = "",
}) => {
  const alignClasses = align === "center" ? "text-center" : "text-left";
  const descriptionAlignClasses =
    align === "center" ? "mx-auto max-w-xl" : "max-w-2xl";

  return (
    <header className={`mb-12 lg:mb-16 ${alignClasses} ${className}`.trim()}>
      <p className="text-primary-950 dark:text-primary-300 mb-3 text-sm font-bold tracking-[0.24em] uppercase">
        {eyebrow}
      </p>
      <h2 className="text-text-primary dark:text-text-inverse text-4xl font-black tracking-tight uppercase sm:text-5xl">
        {title}
      </h2>
      {description !== undefined ? (
        <p
          className={`text-text-secondary mt-4 text-lg leading-8 font-medium dark:text-neutral-400 ${descriptionAlignClasses}`}
        >
          {description}
        </p>
      ) : null}
    </header>
  );
};

export default SectionHeader;
