import React from "react";

type ButtonStyleProps = {
  className?: string; // Остается для возможных исключений, но мы будем избегать использования
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  fullHeight?: boolean;
  shadowColor?: string;
};

type ButtonAsButtonProps = ButtonStyleProps &
  Omit<React.ComponentPropsWithoutRef<"button">, "className" | "children" | "style"> & {
    href?: undefined;
  };

type ButtonAsAnchorProps = ButtonStyleProps &
  Omit<React.ComponentPropsWithoutRef<"a">, "className" | "children" | "href" | "style"> & {
    href: string;
  };

export type ButtonProps = ButtonAsButtonProps | ButtonAsAnchorProps;

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>((props, ref) => {
  const {
    children,
    className = "",
    variant = "primary",
    size = "md",
    fullWidth = false,
    fullHeight = false,
    shadowColor,
    ...rest
  } = props;
  
  const baseClasses =
    "inline-flex items-center justify-center gap-2 font-bold uppercase tracking-wide rounded-none border-2 border-black dark:border-white transition-all duration-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-50 dark:focus-visible:ring-offset-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary:
      "bg-white text-black shadow-[4px_4px_0px_0px_var(--accent-shadow)] dark:shadow-[4px_4px_0px_0px_var(--accent-shadow)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_var(--accent-shadow)] dark:hover:shadow-[2px_2px_0px_0px_var(--accent-shadow)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
    secondary:
      "bg-white text-black shadow-[4px_4px_0px_0px_var(--accent-shadow)] dark:shadow-[4px_4px_0px_0px_var(--accent-shadow)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_var(--accent-shadow)] dark:hover:shadow-[2px_2px_0px_0px_var(--accent-shadow)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
    outline:
      "bg-transparent text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black shadow-none hover:shadow-none",

  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs border-2",
    md: "px-6 py-3 text-sm border-2",
    lg: "px-8 py-4 text-base border-2",
  };

  const widthClass = fullWidth ? "w-full" : "";
  const heightClass = fullHeight ? "h-full" : "";

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${heightClass} ${className}`;
  
  const style = shadowColor ? ({ "--accent-shadow": shadowColor } as React.CSSProperties) : undefined;

  if ("href" in rest && typeof rest.href === "string") {
    const { href, ...anchorProps } = rest;
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={combinedClasses}
        style={style}
        {...anchorProps}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={combinedClasses}
      style={style}
      {...rest}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";


export default Button;
