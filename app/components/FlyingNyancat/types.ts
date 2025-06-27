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
}
