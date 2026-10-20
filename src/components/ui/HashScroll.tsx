"use client";

import { useEffect } from "react";

/** Scroll vers l’ancre après chargement (ex. /fr#menu ou redirection) */
export function HashScroll() {
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;

    const scroll = () => {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    const t = window.setTimeout(scroll, 100);
    return () => window.clearTimeout(t);
  }, []);

  return null;
}
