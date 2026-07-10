import React from "react";

interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

interface CardProps extends BaseComponentProps {
  variant?: "default" | "outlined" | "elevated" | "bgNone";
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({
  children,
  className = "",
  variant = "default",
  padding = "md",
  hover = false,
  style,
  ...props
}) => {
  const baseClasses = "rounded-none transition-all duration-[var(--motion-component)]";

  const variantClasses = {
    default:
      "bg-white dark:bg-black border-2 border-black dark:border-white text-black dark:text-white shadow-[var(--shadow-hard-sm)]",
    outlined:
      "bg-white dark:bg-black border-2 border-black dark:border-white text-black dark:text-white",
    elevated:
      "bg-white dark:bg-black border-2 border-black dark:border-white shadow-[var(--shadow-hard-lg)] text-black dark:text-white",
    bgNone: "bg-transparent border-none shadow-none",
  } as const;

  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  } as const;

  const hoverClasses = hover
    ? "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[var(--shadow-hard-pressed)] cursor-pointer active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
    : "";

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClasses} ${className}`;

  return (
    <div className={combinedClasses} style={style} {...props}>
      {children}
    </div>
  );
};

export default Card;
