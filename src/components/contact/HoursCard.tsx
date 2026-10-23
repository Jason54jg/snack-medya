import { getLocale, getTranslations } from "next-intl/server";
import { restaurant } from "@/data/restaurant";

export async function HoursCard() {
  const t = await getTranslations("contact");
  const locale = await getLocale();

  return (
    <div className="rounded-2xl bg-bordeaux p-6 text-cream shadow-lg">
      <h3 className="font-display text-xl font-semibold">{restaurant.name}</h3>
      <p className="mt-2 text-sm text-cream/85">{restaurant.address.full}</p>
      <a
        href={`tel:${restaurant.phone.tel}`}
        data-track="call"
        className="mt-3 inline-block text-lg font-semibold underline-offset-2 hover:underline"
      >
        {restaurant.phone.display}
      </a>
      <div className="mt-6 border-t border-cream/20 pt-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-cream/60">
          {t("hours")}
        </p>
        <ul className="mt-3 space-y-2 text-sm">
          {restaurant.hours.map((h) => (
            <li key={h.id} className="flex justify-between gap-4">
              <span>{locale === "fr" ? h.daysFr : h.daysEn}</span>
              <span className="text-right text-cream/90">
                {"closed" in h && h.closed
                  ? t("closed")
                  : h.slots.join(" · ")}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
