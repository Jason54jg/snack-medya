import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** GitHub Pages (temporaire) — export statique. La route /api/reviews reste dans le code pour un hébergement serveur plus tard. */
const isGithubPages = process.env.GITHUB_PAGES === "true";
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "snack-medya";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BASE_PATH: isGithubPages ? `/${repoName}` : "",
    NEXT_PUBLIC_STATIC_EXPORT: isGithubPages ? "true" : "false",
  },
  ...(isGithubPages
    ? {
        output: "export" as const,
        basePath: `/${repoName}`,
        assetPrefix: `/${repoName}/`,
        trailingSlash: true,
        images: {
          unoptimized: true,
          remotePatterns: [
            {
              protocol: "https",
              hostname: "images.unsplash.com",
            },
          ],
        },
      }
    : {
        images: {
          remotePatterns: [
            {
              protocol: "https",
              hostname: "images.unsplash.com",
            },
          ],
        },
      }),
};

export default withNextIntl(nextConfig);
