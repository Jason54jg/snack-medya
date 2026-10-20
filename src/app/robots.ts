import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const repo = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "snack-medya";
const owner = process.env.GITHUB_REPOSITORY?.split("/")[0] ?? "Jason54jg";

const SITE = isGithubPages
  ? `https://${owner}.github.io/${repo}`
  : "https://snack-medya.fr";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE}/sitemap.xml`,
  };
}
