"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

interface SkillsInteractionContextType {
  activeElement: HTMLElement | null;
  setActiveElement: (video: HTMLElement | null) => void;
  mousePos: { x: number; y: number };
  setMousePos: (pos: { x: number; y: number }) => void;
}

const SkillsInteractionContext = createContext<SkillsInteractionContextType | undefined>(
  undefined
);

export const SkillsInteractionProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [activeElement, setActiveElement] = useState<HTMLElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const value = useMemo(() => ({ activeElement, setActiveElement, mousePos, setMousePos }), [activeElement, mousePos, setActiveElement, setMousePos]);

  return (
    <SkillsInteractionContext value={value}>
      {children}
    </SkillsInteractionContext>
  );
};

export const useSkillsInteraction = (): SkillsInteractionContextType => {
  const context = useContext(SkillsInteractionContext);
  if (!context) {
    throw new Error(
      "useSkillsInteraction must be used within a SkillsInteractionProvider"
    );
  }
  return context;
};
