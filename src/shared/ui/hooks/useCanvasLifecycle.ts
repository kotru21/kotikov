import { useEffect } from "react";

export const useCanvasLifecycle = (init: () => void): void => {
  useEffect(() => {
    init();
    let timeout: number | undefined;
    const handleResize = (): void => {
      clearTimeout(timeout);
      timeout = window.setTimeout(init, 100) as unknown as number;
    };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      if (timeout !== undefined) clearTimeout(timeout);
    };
  }, [init]);
};
