"use client";

import {
  Fragment,
  type ReactNode,
  type Ref,
  type RefObject,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

// eslint-disable-next-line boundaries/dependencies -- reducedMotion hook lives in features
import { usePerformanceSettings } from "@/features/performance/client";
import { isSafeHref } from "@/shared/lib";

import { CELL_HOVER, GRID_SURFACE } from "./gridChrome";
import { KMark } from "./KMark";

interface MarqueeTickerProps {
  text: string;
  href?: string;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

type PlayState = "paused" | "running";
type TickerOrientation = "horizontal" | "vertical";

const PHRASE_DELIM = " × ";
const TICKER_MARK_INSET = "[padding-inline:16px]";
const TICKER_MARK_CLASS = `inline-flex shrink-0 items-center justify-center ${TICKER_MARK_INSET}`;
const TICKER_MARK_GLYPH_CLASS =
  "h-[13px] w-[13px] shrink-0 [writing-mode:horizontal-tb] [[data-ticker-orientation=vertical]_&]:rotate-180";

/** Units per copy so one copy covers the shell; 2 copies then loop with -50%. */
export function marqueeFillRepeat(viewportSize: number, unitSize: number): number {
  if (viewportSize <= 0 || unitSize <= 0) {
    return 1;
  }
  return Math.max(1, Math.ceil(viewportSize / unitSize));
}

function axisClientSize(element: HTMLElement, orientation: TickerOrientation): number {
  return orientation === "vertical" ? element.clientHeight : element.clientWidth;
}

function axisOffsetSize(element: HTMLElement, orientation: TickerOrientation): number {
  return orientation === "vertical" ? element.offsetHeight : element.offsetWidth;
}

function useMarqueeFillRepeat(
  viewportRef: RefObject<HTMLElement | null>,
  unitRef: RefObject<HTMLElement | null>,
  orientation: TickerOrientation,
  enabled: boolean
): number {
  const [repeat, setRepeat] = useState(1);

  useLayoutEffect(() => {
    if (!enabled) {
      return;
    }
    const viewport = viewportRef.current;
    const unit = unitRef.current;
    if (viewport === null || unit === null) {
      return;
    }

    const sync = (): void => {
      setRepeat(
        marqueeFillRepeat(axisClientSize(viewport, orientation), axisOffsetSize(unit, orientation))
      );
    };

    sync();
    if (typeof ResizeObserver === "undefined") {
      return;
    }
    const observer = new ResizeObserver(sync);
    observer.observe(viewport);
    observer.observe(unit);
    return () => observer.disconnect();
  }, [enabled, orientation, unitRef, viewportRef]);

  return enabled ? repeat : 1;
}

function splitTickerPhrases(text: string): string[] {
  const phrases = text
    .split(PHRASE_DELIM)
    .map((part) => part.trim())
    .filter((part) => part !== "");
  return phrases.length > 0 ? phrases : [text];
}

function setTrackPlayState(track: HTMLElement | null, playState: PlayState): void {
  if (track === null) {
    return;
  }
  track.style.animationPlayState = playState;
}

function tickerClassName(
  orientation: TickerOrientation,
  className: string,
  reducedMotion: boolean,
  href?: string
): string {
  return [
    "box-border flex h-full min-h-0 min-w-0 items-center overflow-hidden [padding-block:0.375rem]",
    reducedMotion ? "leading-tight whitespace-normal" : "leading-none whitespace-nowrap",
    GRID_SURFACE,
    href !== undefined ? `cursor-pointer ${CELL_HOVER}` : "",
    orientation === "vertical" ? "[writing-mode:vertical-rl] rotate-180" : "",
    className,
  ]
    .filter((part) => part !== "")
    .join(" ");
}

interface TickerShellProps {
  href?: string;
  className: string;
  orientation: TickerOrientation;
  children: ReactNode;
  onPause: () => void;
  onResume: () => void;
  shellRef: Ref<HTMLElement | null>;
}

function TickerShell({
  href,
  className,
  orientation,
  children,
  onPause,
  onResume,
  shellRef,
}: TickerShellProps): React.JSX.Element {
  const interactionProps = {
    className,
    "data-ticker-orientation": orientation,
    onMouseEnter: onPause,
    onMouseLeave: onResume,
    onFocus: onPause,
    onBlur: onResume,
  };

  if (href !== undefined) {
    return (
      <a href={href} ref={shellRef as Ref<HTMLAnchorElement>} {...interactionProps}>
        {children}
      </a>
    );
  }

  return (
    <div ref={shellRef as Ref<HTMLDivElement>} {...interactionProps}>
      {children}
    </div>
  );
}

function TickerMark(): React.JSX.Element {
  return (
    <span aria-hidden="true" className={TICKER_MARK_CLASS} data-ticker-mark="k">
      <KMark className={TICKER_MARK_GLYPH_CLASS} />
    </span>
  );
}

interface TickerPhrasesProps {
  phrases: readonly string[];
  trailingMark: boolean;
}

function TickerPhrases({ phrases, trailingMark }: TickerPhrasesProps): React.JSX.Element {
  return (
    <>
      {phrases.map((phrase, index) => (
        <Fragment key={`${phrase}-${String(index)}`}>
          {index > 0 ? <TickerMark /> : null}
          <span>{phrase}</span>
        </Fragment>
      ))}
      {trailingMark ? <TickerMark /> : null}
    </>
  );
}

interface TickerUnitProps {
  phrases: readonly string[];
  ref?: Ref<HTMLSpanElement>;
}

function TickerUnit({ phrases, ref }: TickerUnitProps): React.JSX.Element {
  return (
    <span ref={ref} className="flex shrink-0 items-center">
      <TickerPhrases phrases={phrases} trailingMark />
    </span>
  );
}

interface TickerCopyProps {
  phrases: readonly string[];
  repeat: number;
  hidden?: boolean;
  unitRef?: Ref<HTMLSpanElement>;
}

function TickerCopy({
  phrases,
  repeat,
  hidden = false,
  unitRef,
}: TickerCopyProps): React.JSX.Element {
  return (
    <span aria-hidden={hidden ? "true" : undefined} className="flex shrink-0 items-center">
      {Array.from({ length: repeat }, (_, index) => (
        <TickerUnit key={String(index)} phrases={phrases} ref={index === 0 ? unitRef : undefined} />
      ))}
    </span>
  );
}

function StaticTickerCopy({ phrases }: { phrases: readonly string[] }): React.JSX.Element {
  return (
    <span className="line-clamp-2 min-w-0 text-wrap whitespace-normal">
      <TickerPhrases phrases={phrases} trailingMark={false} />
    </span>
  );
}

interface MarqueeTrackProps {
  phrases: readonly string[];
  orientation: TickerOrientation;
  fillRepeat: number;
  unitRef: Ref<HTMLSpanElement>;
  ref: Ref<HTMLDivElement>;
}

function trackClassName(orientation: TickerOrientation): string {
  return [
    "flex w-max shrink-0 items-center",
    orientation === "vertical" ? "h-max animate-ticker-y" : "h-full animate-ticker-x",
  ].join(" ");
}

function MarqueeTrack({
  phrases,
  orientation,
  fillRepeat,
  unitRef,
  ref,
}: MarqueeTrackProps): React.JSX.Element {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={trackClassName(orientation)}
      data-marquee="on"
      data-marquee-fill={String(fillRepeat)}
    >
      <TickerCopy phrases={phrases} repeat={fillRepeat} unitRef={unitRef} />
      <TickerCopy hidden phrases={phrases} repeat={fillRepeat} />
    </div>
  );
}

export function MarqueeTicker({
  text,
  href,
  orientation = "horizontal",
  className = "",
}: MarqueeTickerProps): React.JSX.Element {
  const { reducedMotion } = usePerformanceSettings();
  const shellRef = useRef<HTMLElement | null>(null);
  const unitRef = useRef<HTMLSpanElement | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const phrases = splitTickerPhrases(text);
  const fillRepeat = useMarqueeFillRepeat(shellRef, unitRef, orientation, !reducedMotion);
  const safeHref = href !== undefined && isSafeHref(href) ? href : undefined;
  const onPause = (): void => {
    setTrackPlayState(trackRef.current, "paused");
  };
  const onResume = (): void => {
    setTrackPlayState(trackRef.current, "running");
  };

  return (
    <TickerShell
      href={safeHref}
      className={tickerClassName(orientation, className, reducedMotion, safeHref)}
      orientation={orientation}
      onPause={onPause}
      onResume={onResume}
      shellRef={shellRef}
    >
      <span className="sr-only">{text}</span>
      {reducedMotion ? (
        <span aria-hidden="true">
          <StaticTickerCopy phrases={phrases} />
        </span>
      ) : (
        <MarqueeTrack
          fillRepeat={fillRepeat}
          orientation={orientation}
          phrases={phrases}
          ref={trackRef}
          unitRef={unitRef}
        />
      )}
    </TickerShell>
  );
}
