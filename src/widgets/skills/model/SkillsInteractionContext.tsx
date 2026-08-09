"use client";

import React, { createContext, useCallback, useContext, useMemo, useRef } from "react";

interface SkillsInteractionContextType {
  getActiveElement: () => HTMLElement | null;
  setActiveElement: (element: HTMLElement | null) => void;
}

const SkillsInteractionContext = createContext<SkillsInteractionContextType | undefined>(undefined);

export const SkillsInteractionProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const activeElementRef = useRef<HTMLElement | null>(null);

  const getActiveElement = useCallback((): HTMLElement | null => activeElementRef.current, []);

  const setActiveElement = useCallback((element: HTMLElement | null): void => {
    activeElementRef.current = element;
  }, []);

  const value = useMemo(
    () => ({ getActiveElement, setActiveElement }),
    [getActiveElement, setActiveElement]
  );

  return <SkillsInteractionContext value={value}>{children}</SkillsInteractionContext>;
};

export const useSkillsInteraction = (): SkillsInteractionContextType => {
  const context = useContext(SkillsInteractionContext);
  if (!context) {
    throw new Error("useSkillsInteraction must be used within a SkillsInteractionProvider");
  }
  return context;
};

/** Optional for marquee cards on mobile where no cursor consumer exists. */
export function useSkillsInteractionOptional(): SkillsInteractionContextType | undefined {
  return useContext(SkillsInteractionContext);
}
