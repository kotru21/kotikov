"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

interface SkillsInteractionContextType {
  activeElement: HTMLElement | null;
  setActiveElement: (element: HTMLElement | null) => void;
}

const SkillsInteractionContext = createContext<SkillsInteractionContextType | undefined>(undefined);

export const SkillsInteractionProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [activeElement, setActiveElement] = useState<HTMLElement | null>(null);

  const value = useMemo(
    () => ({ activeElement, setActiveElement }),
    [activeElement, setActiveElement]
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
