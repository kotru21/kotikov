import React from "react";

type ButtonStyleProps = {
  className?: string;
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
};

type ButtonAsButtonProps = ButtonStyleProps &
  Omit<React.ComponentPropsWithoutRef<"button">, "className" | "children"> & {
    href?: undefined;
  };

type ButtonAsAnchorProps = ButtonStyleProps &
  Omit<React.ComponentPropsWithoutRef<"a">, "className" | "children" | "href"> & {
    href: string;
  };

export type ButtonProps = ButtonAsButtonProps | ButtonAsAnchorProps;

const Button: React.FC<ButtonProps> = (props) => {
  const {
    children,
    className = "",
    variant = "primary",
    size = "md",
    ...rest
  } = props;
  const baseClasses =
    "inline-flex items-center justify-center font-bold uppercase tracking-wide rounded-none border-2 border-black dark:border-white transition-all duration-100 focus:outline-none focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary:
      "bg-[#d12c1f] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
    secondary:
      "bg-[#f4bf21] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
    outline:
      "bg-transparent text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black shadow-none hover:shadow-none",
    ghost:
      "bg-transparent border-transparent text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 shadow-none hover:shadow-none",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs border-2",
    md: "px-6 py-3 text-sm border-2",
    lg: "px-8 py-4 text-base border-2",
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if ("href" in rest && typeof rest.href === "string") {
    const { href, ...anchorProps } = rest;
    return (
      <a
        href={href}
        className={combinedClasses}
        {...anchorProps}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      className={combinedClasses}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
