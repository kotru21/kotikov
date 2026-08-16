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
