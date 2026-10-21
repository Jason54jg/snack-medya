import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { HERO_IMAGE } from "@/data/menu";
import { restaurant } from "@/data/restaurant";
import { OpenNowBadge } from "@/components/ui/OpenNowBadge";

export async function Hero() {
  const t = await getTranslations("hero");

  return (
    <div className="relative isolate min-h-[88vh] overflow-hidden">
      <Image
        src={HERO_IMAGE}
        alt="Kebab Snack Medya"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/50 to-ink/25" />
      {/* Fondu vers le fond motif cream */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 sm:h-36"
        style={{
          background:
            "linear-gradient(to top, var(--cream) 0%, color-mix(in srgb, var(--cream) 70%, transparent) 45%, transparent 100%)",
        }}
      />

      <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 sm:pb-20">
        <div className="animate-fade-up mb-3 [&_span]:bg-cream/15 [&_span]:text-cream [&_span]:ring-1 [&_span]:ring-cream/30">
          <OpenNowBadge />
        </div>
        <p className="animate-fade-up font-display text-4xl font-semibold tracking-tight text-cream sm:text-6xl md:text-7xl">
          {t("brand")}
        </p>
        <h1 className="animate-fade-up-delay mt-3 max-w-xl font-display text-2xl font-medium text-cream/95 sm:text-3xl md:text-4xl">
          {t("headline")}
        </h1>
        <p className="animate-fade-up-delay-2 mt-4 max-w-md text-base text-cream/80 sm:text-lg">
          {t("sub")}
        </p>
        <div className="animate-fade-up-delay-2 mt-8 flex flex-wrap gap-3">
          <a
            href="#menu"
            className="rounded-full bg-bordeaux px-6 py-3 text-sm font-semibold text-cream shadow-lg transition hover:bg-bordeaux-light"
          >
            {t("ctaCompose")}
          </a>
          <a
            href="#menu"
            className="rounded-full border border-cream/40 bg-cream/10 px-6 py-3 text-sm font-semibold text-cream backdrop-blur-sm transition hover:bg-cream/20"
          >
            {t("ctaMenu")}
          </a>
          {restaurant.uberEatsUrl && (
            <a
              href={restaurant.uberEatsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-cream/40 bg-cream/10 px-6 py-3 text-sm font-semibold text-cream backdrop-blur-sm transition hover:bg-cream/20"
            >
              {t("ctaUberEats")}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
