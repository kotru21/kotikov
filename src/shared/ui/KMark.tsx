import type { CSSProperties } from "react";

interface KMarkProps {
  className?: string;
  style?: CSSProperties;
}

export function KMark({ className = "", style }: KMarkProps): React.JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="120"
      height="120"
      fill="none"
      viewBox="0 0 120 120"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <rect width="40" height="120" fill="currentColor" />
      <rect width="40" height="120" x="120" y="80" fill="currentColor" transform="rotate(90 120 80)" />
      <rect width="80" height="80" x="80" y="40" fill="currentColor" transform="rotate(90 80 40)" />
      <rect width="40" height="40" x="120" fill="currentColor" transform="rotate(90 120 0)" />
    </svg>
  );
}
