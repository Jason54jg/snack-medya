import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { FEATURED_ITEMS, formatPrice } from "@/data/menu";
import { ComposeProductButton } from "@/components/menu/ComposeProductButton";

export async function FeaturedProducts() {
  const t = await getTranslations("featured");
  const locale = (await getLocale()) as "fr" | "en";

  return (
    <section className="bg-lattice mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="max-w-xl">
        <h2 className="font-display text-3xl font-semibold text-bordeaux sm:text-4xl">
          {t("title")}
        </h2>
        <p className="mt-2 text-ink-muted">{t("subtitle")}</p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURED_ITEMS.slice(0, 3).map((item) => {
          const name = locale === "fr" ? item.nameFr : item.nameEn;
          return (
            <article
              key={item.id}
              className="group relative rounded-2xl border border-bordeaux/10 bg-cream/70 p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-[2px] transition duration-300 hover:-translate-y-1 hover:border-bordeaux/25 hover:bg-cream/85 hover:shadow-[0_16px_36px_-22px_rgba(107,30,42,0.35)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-cream-dark">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.04]"
                    sizes="(max-width:768px) 100vw, 33vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 rounded-md bg-cream/95 px-2.5 py-1 font-display text-sm font-semibold text-bordeaux backdrop-blur-sm">
                  {t("from")} {formatPrice(item.prices.simple, locale)}
                </span>
              </div>
              <div className="space-y-3 px-2.5 py-4">
                <h3 className="font-display text-xl font-semibold text-ink">
                  {name}
                </h3>
                <ComposeProductButton
                  productId={item.id}
                  category={item.category}
                  label={`${t("configure")} →`}
                  className="inline-flex items-center rounded-full border border-bordeaux/20 bg-cream/90 px-3.5 py-1.5 text-sm font-semibold text-bordeaux transition hover:border-bordeaux hover:bg-bordeaux hover:text-cream"
                />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
