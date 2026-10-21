"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export function BackToTop() {
  const t = useTranslations("common");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() =>
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
      className="fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-bordeaux text-cream shadow-lg transition hover:bg-bordeaux-light"
      aria-label={t("backToTop")}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 19V5M5 12l7-7 7 7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
