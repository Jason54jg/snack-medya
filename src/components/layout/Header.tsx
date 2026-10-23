"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { restaurant } from "@/data/restaurant";
import { OpenNowBadge } from "@/components/ui/OpenNowBadge";
import { LogoMark } from "@/components/ui/LogoMark";

const SECTIONS = [
  { id: "accueil", key: "home" },
  { id: "menu", key: "menu" },
  { id: "avis", key: "reviews" },
  { id: "contact", key: "contact" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("accueil");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.25, 0.5] },
    );

    for (const s of SECTIONS) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", `#${id}`);
      setActive(id);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-bordeaux/10 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex flex-col items-start gap-1">
          <button
            type="button"
            onClick={() => scrollTo("accueil")}
            className="group flex items-center gap-2 text-left"
          >
            <LogoMark className="h-8 w-8 shrink-0 sm:h-9 sm:w-9" />
            <span className="font-display text-xl font-semibold tracking-tight text-bordeaux sm:text-2xl">
              Snack Medya
            </span>
          </button>
          <OpenNowBadge />
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => scrollTo(s.id)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                active === s.id
                  ? "bg-bordeaux text-cream"
                  : "text-ink-muted hover:bg-cream-dark hover:text-ink"
              }`}
            >
              {t(s.key)}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${restaurant.phone.tel}`}
            className="hidden rounded-full bg-bordeaux px-3 py-1.5 text-sm font-medium text-cream transition hover:bg-bordeaux-light sm:inline-flex"
          >
            {t("order")}
          </a>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-bordeaux/20 text-bordeaux md:hidden"
            aria-expanded={open}
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              {open ? (
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-bordeaux/10 bg-cream px-4 py-3 md:hidden">
          <ul className="flex flex-col gap-1">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => scrollTo(s.id)}
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-ink hover:bg-cream-dark"
                >
                  {t(s.key)}
                </button>
              </li>
            ))}
            <li>
              <a
                href={`tel:${restaurant.phone.tel}`}
                className="mt-1 block rounded-lg bg-bordeaux px-3 py-2 text-center text-sm font-medium text-cream"
              >
                {restaurant.phone.display}
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
