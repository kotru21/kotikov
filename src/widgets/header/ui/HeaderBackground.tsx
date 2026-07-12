import { BauhausGridPattern, GridPaintOverlay, type GridPaintOverlayRef } from "@/shared/ui";

interface HeaderBackgroundProps {
  paintRef?: React.Ref<GridPaintOverlayRef>;
}

export function HeaderBackground({ paintRef }: HeaderBackgroundProps): React.JSX.Element {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* 1. Сетка (Grid Paper) */}
      <BauhausGridPattern className="text-black dark:text-white" opacity={0.05} size={40} />

      {paintRef ? (
        <GridPaintOverlay
          ref={paintRef}
          pixelSize={40}
          brushRadius={52}
          alpha={0.85}
          className="pointer-events-none absolute inset-0 h-full w-full mix-blend-multiply dark:mix-blend-screen"
        />
      ) : null}
    </div>
  );
}
