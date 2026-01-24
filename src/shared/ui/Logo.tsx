import React from "react";

interface LogoProps {
  variant?: "pc" | "mobile";
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ variant = "pc", className = "" }) => {
  if (variant === "mobile") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="120"
        height="120"
        fill="none"
        viewBox="0 0 120 120"
        className={className}
        role="img"
        aria-hidden="true"
      >
        {/* Mobile logo (uses currentColor so it responds to painting) */}
        <rect width="40" height="120" fill="currentColor" />
        <rect
          width="40"
          height="120"
          x="120"
          y="80"
          fill="currentColor"
          transform="rotate(90 120 80)"
        />
        <rect width="80" height="80" x="80" y="40" fill="currentColor" transform="rotate(90 80 40)" />
        <rect width="40" height="40" x="120" fill="currentColor" transform="rotate(90 120 0)" />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1057"
      height="223"
      viewBox="0 0 1057 223"
      className={className}
      role="img"
      aria-hidden="true"
    >
      {/* Основной текст логотипа — перекрашивается через currentColor */}
      <path fill="currentColor" d="M16.38 179V44H33.3V163.88L27.36 161.18L124.92 44H143.64L31.14 179H16.38ZM80.46 109.34L91.8 96.2L145.8 179H126.18L80.46 109.34ZM346.656 52.1H363.576V179H346.656V52.1ZM288.696 44H421.536V58.94H288.696V44ZM582.923 179V44H599.843V163.88L593.903 161.18L691.463 44H710.183L597.683 179H582.923ZM647.003 109.34L658.343 96.2L712.343 179H692.723L647.003 109.34ZM983.842 172.34H975.022L1036.4 44H1054.76L988.342 179H969.982L903.562 44H921.922L983.842 172.34Z" />

      {/* Акцентные элементы — сохраняем оригинальные цвета */}
      <rect width="44" height="134" x="484" y="45" fill="#63ffd5" />
      <path fill="#00b583" d="M231.5 45C202.655 87.876 185 108.847 185 134.071C185 159.294 205.925 179 232.275 179C258.625 179 278 156.929 278 134.071C278 111.212 257.576 84.4935 231.5 45Z" />
      <circle cx="809" cy="112" r="67" fill="#2cffc7" />
    </svg>
  );
};

export default Logo;
