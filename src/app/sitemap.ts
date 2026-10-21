import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

export const dynamic = "force-static";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const repo = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "snack-medya";
const owner = process.env.GITHUB_REPOSITORY?.split("/")[0] ?? "Jason54jg";

const BASE = isGithubPages
  ? `https://${owner}.github.io/${repo}`
  : "https://snack-medya.fr";

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.map((locale) => ({
    url: `${BASE}/${locale}`,
    lastModified: new Date(),
  }));
}
