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
  const baseClasses = "rounded-none transition-all duration-200";

  const variantClasses = {
    default:
      "bg-white dark:bg-black border-2 border-black dark:border-white text-black dark:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]",
    outlined:
      "bg-white dark:bg-black border-2 border-black dark:border-white text-black dark:text-white",
    elevated:
      "bg-white dark:bg-black border-2 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] text-black dark:text-white",
    bgNone: "bg-transparent border-none shadow-none",
  } as const;

  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  } as const;

  const hoverClasses = hover
    ? "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] cursor-pointer active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
    : "";

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClasses} ${className}`;

  return (
    <div className={combinedClasses} style={style} {...props}>
      {children}
    </div>
  );
};

export default Card;
