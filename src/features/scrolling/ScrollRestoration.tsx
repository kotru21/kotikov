"use client";

import { useEffect } from "react";

export function ScrollRestoration(): null {
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    if (window.location.hash.length > 0) return;

    window.scrollTo(0, 0);
  }, []);

  return null;
}
