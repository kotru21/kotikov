import { useCallback, useMemo, useRef } from "react";

import { InteractiveTextRegistry } from "../model/types";

export const useInteractiveRegistry = () => {
  const interactiveElementsRef = useRef<Set<HTMLElement>>(new Set());

  const register = useCallback((el: HTMLElement) => {
    interactiveElementsRef.current.add(el);
  }, []);

  const unregister = useCallback((el: HTMLElement) => {
    interactiveElementsRef.current.delete(el);
  }, []);

  const registry = useMemo<InteractiveTextRegistry>(
    () => ({ register, unregister }),
    [register, unregister]
  );

  return {
    registry,
    interactiveElementsRef,
  };
};
