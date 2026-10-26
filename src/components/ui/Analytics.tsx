"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useLocale } from "next-intl";

/**
 * Mesure d’audience sans cookie (voir dépôt webdashbord).
 * Sans NEXT_PUBLIC_ANALYTICS_URL, le composant ne fait rien.
 */
const ANALYTICS_URL = process.env.NEXT_PUBLIC_ANALYTICS_URL?.replace(/\/+$/, "");
const ANALYTICS_SITE = process.env.NEXT_PUBLIC_ANALYTICS_SITE ?? "snack-medya";

type AnalyticsEvent = {
  type: "pageview" | "click";
  label?: string;
  referrer?: string;
};

// Niveau module : survit aux doubles effets de StrictMode et aux remontages
let lastPageview = "";
let referrerSent = false;
let currentLang = "";

function currentPath() {
  return `${window.location.pathname}${window.location.hash}`;
}

function send(event: AnalyticsEvent) {
  if (!ANALYTICS_URL) return;

  try {
    const body = JSON.stringify({
      site: ANALYTICS_SITE,
      path: currentPath(),
      lang: currentLang || undefined,
      ...event,
    });
    // /api/send (pas /api/collect) : EasyPrivacy bloque /api/collect
    const url = `${ANALYTICS_URL}/api/send`;
    const blob = new Blob([body], { type: "text/plain" });

    // fetch d’abord : moins souvent bloqué que sendBeacon ($ping)
    fetch(url, {
      method: "POST",
      body: blob,
      keepalive: true,
      headers: { "Content-Type": "text/plain" },
    }).catch(() => {
      navigator.sendBeacon?.(url, blob);
    });
  } catch {
    // L’analytics ne doit jamais casser le site
  }
}

function trackPageview() {
  const key = `${currentPath()}|${currentLang}`;
  if (key === lastPageview) return;
  lastPageview = key;

  // document.referrer ne change pas lors d’une navigation côté client
  const referrer = referrerSent ? "" : document.referrer;
  referrerSent = true;
  send({ type: "pageview", referrer });
}

function trackClick(event: MouseEvent) {
  if (event.type === "auxclick" && event.button !== 1) return;

  const target = event.target instanceof Element ? event.target : null;
  const label = target?.closest("[data-track]")?.getAttribute("data-track");
  if (!label) return;

  send({ type: "click", label });
}

export function Analytics() {
  const pathname = usePathname();
  const locale = useLocale();

  useEffect(() => {
    if (!ANALYTICS_URL) return;
    currentLang = locale;
    trackPageview();
  }, [pathname, locale]);

  useEffect(() => {
    if (!ANALYTICS_URL) return;

    window.addEventListener("hashchange", trackPageview);
    // Capture : le clic est compté même si un composant stoppe la propagation
    document.addEventListener("click", trackClick, true);
    document.addEventListener("auxclick", trackClick, true);
    return () => {
      window.removeEventListener("hashchange", trackPageview);
      document.removeEventListener("click", trackClick, true);
      document.removeEventListener("auxclick", trackClick, true);
    };
  }, []);

  return null;
}
