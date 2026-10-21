import { getTranslations } from "next-intl/server";
import { restaurant } from "@/data/restaurant";

export async function MapEmbed() {
  const t = await getTranslations("common");
  return (
    <div className="overflow-hidden rounded-2xl ring-1 ring-bordeaux/10">
      <iframe
        title={t("mapTitle")}
        src={restaurant.maps.embedUrl}
        className="h-72 w-full border-0 sm:h-96"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
