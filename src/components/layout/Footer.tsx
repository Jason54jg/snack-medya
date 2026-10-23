import { getTranslations } from "next-intl/server";
import { restaurant } from "@/data/restaurant";

export async function Footer() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const year = new Date().getFullYear();

  const links = [
    { href: "#accueil", label: tNav("home") },
    { href: "#menu", label: tNav("menu") },
    { href: "#avis", label: tNav("reviews") },
    { href: "#contact", label: tNav("contact") },
  ];

  return (
    <footer className="border-t border-bordeaux/10 bg-bordeaux-dark text-cream">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-semibold">Snack Medya</p>
          <p className="mt-2 text-sm text-cream/75">{t("tagline")}</p>
          <p className="mt-4 text-xs text-cream/55">{t("hoursShort")}</p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-cream/60">
            {t("contactHeading")}
          </p>
          <p className="mt-2 text-sm">{restaurant.address.full}</p>
          <a
            href={`tel:${restaurant.phone.tel}`}
            data-track="call"
            className="mt-1 inline-block text-sm font-medium text-cream underline-offset-2 hover:underline"
          >
            {restaurant.phone.display}
          </a>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-cream/60">
            {t("linksHeading")}
          </p>
          <ul className="mt-2 space-y-1 text-sm">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="hover:underline">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10 py-4 text-center text-xs text-cream/50">
        © {year} Snack Medya. {t("rights")}
      </div>
    </footer>
  );
}
