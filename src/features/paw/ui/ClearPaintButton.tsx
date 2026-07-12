interface ClearPaintButtonProps {
  onClick: () => void;
  tone?: "default" | "on-gradient";
  className?: string;
}

const toneClasses = {
  default:
    "border-black bg-white text-text-primary hover:bg-primary-500 hover:text-black focus-visible:ring-primary-500 dark:border-white dark:bg-black dark:text-text-inverse dark:hover:bg-primary-500 dark:hover:text-black",
  "on-gradient":
    "border-white bg-black text-white hover:bg-primary-500 hover:text-black focus-visible:ring-white",
} as const;

export function ClearPaintButton({
  onClick,
  tone = "default",
  className = "",
}: ClearPaintButtonProps): React.JSX.Element {
  return (
    <button
      type="button"
      data-draw-allow
      onClick={onClick}
      className={`inline-flex min-h-11 items-center justify-center border-2 px-4 text-xs font-bold tracking-[0.16em] uppercase transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none ${toneClasses[tone]} ${className}`.trim()}
    >
      Очистить рисунок
    </button>
  );
}
