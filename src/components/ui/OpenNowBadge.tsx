"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { getOpenStatus, type OpenStatus } from "@/lib/hours";

export function OpenNowBadge() {
  const locale = useLocale();
  const [status, setStatus] = useState<OpenStatus | null>(null);

  useEffect(() => {
    const update = () => setStatus(getOpenStatus());
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, []);

  if (!status) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        status.isOpen
          ? "bg-green/15 text-green"
          : "bg-bordeaux/10 text-bordeaux"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status.isOpen ? "bg-green animate-pulse" : "bg-bordeaux"
        }`}
        aria-hidden
      />
      {locale === "fr" ? status.labelFr : status.labelEn}
    </span>
  );
}
