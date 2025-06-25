export interface WindowPosition {
  x: number;
  y: number;
}

export interface WindowPositions {
  [key: string]: WindowPosition;
}

export interface WindowProps {
  windowId: string;
  position: WindowPosition;
  isDragging: boolean;
  onMouseDown: (e: React.MouseEvent, windowId: string) => void;
  onClose: () => void;
}

export interface DeviceInfo {
  processor: string;
  memory: string;
  platform: string;
  userAgent: string;
  screen: string;
  language: string;
  online: boolean;
  hardwareConcurrency: string;
}
