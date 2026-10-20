import { getTranslations } from "next-intl/server";
import { HoursCard } from "@/components/contact/HoursCard";
import { MapEmbed } from "@/components/contact/MapEmbed";
import { restaurant } from "@/data/restaurant";

export async function ContactSection() {
  const t = await getTranslations("contact");

  return (
    <div className="bg-lattice mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <header className="max-w-2xl">
        <h2 className="font-display text-3xl font-semibold text-bordeaux sm:text-4xl">
          {t("title")}
        </h2>
        <p className="mt-3 text-ink-muted">{t("subtitle")}</p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <HoursCard />
        <div className="space-y-4">
          <MapEmbed />
          <div className="flex flex-wrap gap-3">
            <a
              href={`tel:${restaurant.phone.tel}`}
              className="rounded-full bg-bordeaux px-5 py-2.5 text-sm font-semibold text-cream hover:bg-bordeaux-light"
            >
              {t("call")}
            </a>
            <a
              href={restaurant.maps.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-bordeaux/30 px-5 py-2.5 text-sm font-semibold text-bordeaux hover:bg-cream-dark"
            >
              {t("directions")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
