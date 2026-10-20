import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${fraunces.variable} ${dmSans.variable} antialiased bg-cream text-ink`}
      >
        {children}
      </body>
    </html>
  );
}
