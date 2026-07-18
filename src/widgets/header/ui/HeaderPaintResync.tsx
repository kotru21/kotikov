"use client";

import { useLayoutEffect } from "react";

import { useNavMorph } from "@/features/scrolling";
import { useTheme } from "@/features/theme/client";
import type { GridPaintOverlayRef } from "@/shared/ui";

const PAINT_INTERACTIVE_THRESHOLD = 0.02;

interface HeaderPaintResyncProps {
  paintRef: React.RefObject<GridPaintOverlayRef | null>;
  resyncAll: (paintRef: React.RefObject<GridPaintOverlayRef | null>) => void;
  enabled: boolean;
}

export function HeaderPaintResync({
  paintRef,
  resyncAll,
  enabled,
}: HeaderPaintResyncProps): null {
  const { progress } = useNavMorph();
  const { isDark } = useTheme();
  const isPaintInteractive = progress < PAINT_INTERACTIVE_THRESHOLD;

  useLayoutEffect(() => {
    if (!enabled || !isPaintInteractive) return;
    resyncAll(paintRef);
  }, [enabled, isDark, isPaintInteractive, paintRef, resyncAll]);

  return null;
}
