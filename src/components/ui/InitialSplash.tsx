"use client";

import { useEffect, useState } from "react";
import { LoadingScreen } from "./LoadingScreen";

const SPLASH_MS = 1200;

export function InitialSplash() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setVisible(false);
      return;
    }

    const leaveTimer = window.setTimeout(() => setLeaving(true), SPLASH_MS);
    const hideTimer = window.setTimeout(
      () => setVisible(false),
      SPLASH_MS + 400,
    );

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] transition-opacity duration-400 ease-out ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <LoadingScreen fullPage />
    </div>
  );
}
