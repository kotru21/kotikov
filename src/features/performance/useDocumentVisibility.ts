"use client";

import { useEffect, useState } from "react";

export function useDocumentVisibility(): boolean {
  const readVisibility = (): boolean =>
    typeof document === "undefined" || document.visibilityState !== "hidden";
  const [isVisible, setIsVisible] = useState(readVisibility);

  useEffect(() => {
    const handleVisibilityChange = (): void => setIsVisible(readVisibility());
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  return isVisible;
}
