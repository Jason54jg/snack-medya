import type { Metadata } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const repo = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "snack-medya";
const owner = process.env.GITHUB_REPOSITORY?.split("/")[0] ?? "Jason54jg";

export const metadata: Metadata = {
  metadataBase: new URL(
    isGithubPages
      ? `https://${owner}.github.io/${repo}`
      : "https://snack-medya.fr",
  ),
  title: "Snack Medya — Kebab & Snack à Neufchâteau",
  description:
    "Snack Medya à Neufchâteau : kebabs, tacos, burgers. Composez votre menu et commandez.",
};

/** <html> et <body> sont rendus par [locale]/layout pour porter lang={locale} */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
