import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import { getLocale } from "next-intl/server";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://snack-medya.fr"),
  title: "Snack Medya — Kebab & Snack à Neufchâteau",
  description:
    "Snack Medya à Neufchâteau : kebabs, tacos, burgers. Composez votre menu et commandez.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${fraunces.variable} ${dmSans.variable} antialiased bg-cream text-ink`}
      >
        {children}
      </body>
    </html>
  );
}
