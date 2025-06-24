"use client";

import { useEffect } from "react";

export default function IEWarning() {
  useEffect(() => {
    function msieversion() {
      const ua = window.navigator.userAgent;
      const msie = ua.indexOf("MSIE ");

      if (msie > 0) {
        window.location.href = "/IE-warning.html";
        return true;
      }
      return false;
    }

    msieversion();
  }, []);

  return null; // Этот компонент ничего не рендерит
}
