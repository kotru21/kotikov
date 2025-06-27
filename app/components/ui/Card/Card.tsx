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
  const baseClasses = "rounded-xl transition-all duration-300";

  const variantClasses = {
    default: "bg-white dark:bg-gray-800",
    outlined:
      "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
    elevated: "bg-white dark:bg-gray-800 shadow-lg",
    bgNone: "bg-transparent border-none",
  };

  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const hoverClasses = hover
    ? "hover:shadow-xl hover:scale-105 cursor-pointer"
    : "";

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClasses} ${className}`;

  return (
    <div className={combinedClasses} style={style} {...props}>
      {children}
    </div>
  );
};

export default Card;
