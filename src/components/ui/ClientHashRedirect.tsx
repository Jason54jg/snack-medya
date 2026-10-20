"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

type Props = {
  hash: string;
  query?: string;
};

/** Redirection client — conserve le hash (perdu en redirect HTTP) */
export function ClientHashRedirect({ hash, query = "" }: Props) {
  const locale = useLocale();

  useEffect(() => {
    const qs = query ? `?${query}` : "";
    window.location.replace(`/${locale}${qs}#${hash}`);
  }, [locale, hash, query]);

  return <LoadingScreen fullPage={false} />;
}
