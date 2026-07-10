export interface Position {
  x: number;
  y: number;
}

export interface Pixel {
  id: number;
  x: number;
  y: number;
  color: string;
  velocityX: number;
  velocityY: number;
  size: number;
  shape: "square" | "circle" | "triangle";
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}

export interface FlyingNyancatProps {
  size: "small" | "medium" | "large" | "xlarge";
  position: {
    top: string;
    left: string;
  };
  animationName: string;
  animationDuration: string;
  animationDelay?: string;
  zIndex?: number;
  /** Defaults to true for finite / one-shot consumers. */
  isMotionActive?: boolean;
  /**
   * Optional secondary keyframe applied to the cat only (not the trail) for
   * banking/tilt. Shares duration + delay with the flight path to stay in sync.
   */
  bankAnimationName?: string;
  testId?: string;
}
