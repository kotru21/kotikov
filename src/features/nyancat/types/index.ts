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
