import React from "react";
import { colors, withOpacity } from "@/styles/colors";

interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

interface ButtonProps extends BaseComponentProps {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  href,
  target,
  rel,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: colors.primary[600],
          color: colors.text.primary,
          borderColor: "transparent",
          ":hover": {
            backgroundColor: colors.hover.primary,
          },
        } as React.CSSProperties;
      case "secondary":
        return {
          backgroundColor: colors.background.gray,
          color: colors.text.inverse,
          borderColor: "transparent",
        } as React.CSSProperties;
      case "outline":
        return {
          backgroundColor: "transparent",
          color: colors.text.accent,
          borderColor: colors.border.accent,
          border: `2px solid ${colors.border.accent}`,
        } as React.CSSProperties;
      case "ghost":
        return {
          backgroundColor: "transparent",
          color: colors.text.accent,
          borderColor: "transparent",
        } as React.CSSProperties;
      default:
        return {} as React.CSSProperties;
    }
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const variantStyles = getVariantStyles();
  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${className}`;

  const handleMouseOver = (e: React.MouseEvent<HTMLElement>) => {
    if (variant === "outline") {
      e.currentTarget.style.backgroundColor = withOpacity(
        colors.primary[600],
        0.1
      );
    } else if (variant === "ghost") {
      e.currentTarget.style.backgroundColor = withOpacity(
        colors.primary[600],
        0.05
      );
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    if (variant === "outline" || variant === "ghost") {
      e.currentTarget.style.backgroundColor = "transparent";
    }
  };

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={combinedClasses}
        style={variantStyles}
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
        {...props}>
        {children}
      </a>
    );
  }

  return (
    <button
      className={combinedClasses}
      style={variantStyles}
      disabled={disabled}
      onClick={onClick}
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      {...props}>
      {children}
    </button>
  );
};

export default Button;
