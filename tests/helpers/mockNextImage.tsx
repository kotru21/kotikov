const NEXT_ONLY_PROPS = new Set([
  "priority",
  "fill",
  "unoptimized",
  "placeholder",
  "blurDataURL",
  "loader",
  "quality",
  "sizes",
  "onLoadingComplete",
]);

interface MockNextImageProps {
  alt?: string;
  src?: string | { src: string };
  onError?: () => void;
  onClick?: () => void;
  className?: string;
  width?: number | string;
  height?: number | string;
  "data-testid"?: string;
  [key: string]: unknown;
}

/** Strip next/image-only props before rendering a plain <img> in jsdom. */
export function MockNextImage({
  alt = "",
  src,
  onError,
  onClick,
  className,
  width,
  height,
  "data-testid": testId,
  ...rest
}: MockNextImageProps): React.JSX.Element {
  const resolvedSrc = typeof src === "string" ? src : src?.src;
  const domProps: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(rest)) {
    if (!NEXT_ONLY_PROPS.has(key)) {
      domProps[key] = value;
    }
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- test stub for next/image
    <img
      alt={alt}
      src={resolvedSrc}
      className={className}
      width={width}
      height={height}
      data-testid={testId}
      onError={onError}
      onClick={onClick}
      {...domProps}
    />
  );
}
