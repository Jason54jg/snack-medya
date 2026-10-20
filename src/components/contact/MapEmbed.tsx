import { restaurant } from "@/data/restaurant";

export function MapEmbed() {
  return (
    <div className="overflow-hidden rounded-2xl ring-1 ring-bordeaux/10">
      <iframe
        title="Snack Medya — carte"
        src={restaurant.maps.embedUrl}
        className="h-72 w-full border-0 sm:h-96"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
