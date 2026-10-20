import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const BASE = "https://snack-medya.fr";

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.map((locale) => ({
    url: `${BASE}/${locale}`,
    lastModified: new Date(),
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${BASE}/${l}`]),
      ),
    },
  }));
}
