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

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURED_ITEMS.slice(0, 3).map((item) => {
          const name = locale === "fr" ? item.nameFr : item.nameEn;
          return (
            <article
              key={item.id}
              className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-bordeaux/8 transition hover:shadow-md"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width:768px) 100vw, 33vw"
                  />
                )}
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl font-semibold text-ink">
                  {name}
                </h3>
                <p className="mt-1 text-sm text-ink-muted">
                  {t("from")}{" "}
                  <span className="font-semibold text-bordeaux">
                    {formatPrice(item.prices.simple, locale)}
                  </span>
                </p>
                <ComposeProductButton
                  productId={item.id}
                  category={item.category}
                  label={`${t("configure")} →`}
                  className="mt-4 inline-flex text-sm font-semibold text-bordeaux underline-offset-4 hover:underline"
                />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
