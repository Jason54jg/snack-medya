import { Fraunces, DM_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RestaurantJsonLd } from "@/components/seo/JsonLd";
import { InitialSplash } from "@/components/ui/InitialSplash";
import { BackToTop } from "@/components/ui/BackToTop";
import "../globals.css";

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
const basePath = isGithubPages ? `/${repo}` : "";
const bgPattern = `url("${basePath}/images/bg-pattern.png")`;

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    alternates: {
      languages: {
        fr: "/fr",
        en: "/en",
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      locale: locale === "fr" ? "fr_FR" : "en_GB",
      type: "website",
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations("common");

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${fraunces.variable} ${dmSans.variable} antialiased text-ink`}
        style={{ ["--bg-pattern" as string]: bgPattern }}
      >
        <NextIntlClientProvider messages={messages}>
          <RestaurantJsonLd />
          <InitialSplash />
          <a
            href="#menu"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-bordeaux focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-cream"
          >
            {t("skipToMenu")}
          </a>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main id="main" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <BackToTop />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
