"use client";

import { useEffect } from "react";

import { shouldResetScrollOnLoad } from "./scrollUtils";

export function ScrollRestoration(): null {
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    if (!shouldResetScrollOnLoad(window.location.hash)) return;

    window.scrollTo(0, 0);
  }, []);

  return null;
}
