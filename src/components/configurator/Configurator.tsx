"use client";

import { useEffect, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  ALL_TIER_ITEMS,
  ASSIETTES,
  BOWLS,
  BURGERS,
  DURUMS,
  EXTRAS,
  MEATS,
  MENU_ENFANT,
  SALADES,
  SANDWICHES,
  SAUCES,
  TACO_SIZES,
  formatPrice,
  getItemById,
  type FormulaKey,
} from "@/data/menu";
import { restaurant } from "@/data/restaurant";
import { calculateTotal } from "@/lib/pricing";
import { whatsappCartUrl } from "@/lib/orderMessage";
import { cartItemLabel, snapshotConfig } from "@/lib/cartLabel";
import {
  useConfiguratorStore,
  type ConfigMode,
} from "@/lib/store/configurator";
import { useCartStore } from "@/lib/store/cart";

const CATEGORIES: { id: ConfigMode; key: string }[] = [
  { id: "sandwiches", key: "sandwiches" },
  { id: "durums", key: "durums" },
  { id: "tacos", key: "tacos" },
  { id: "burgers", key: "burgers" },
  { id: "assiettes", key: "assiettes" },
  { id: "bowls", key: "bowls" },
  { id: "salades", key: "salades" },
  { id: "enfant", key: "enfant" },
];

function productsForMode(mode: ConfigMode) {
  switch (mode) {
    case "sandwiches":
      return SANDWICHES;
    case "durums":
      return DURUMS;
    case "burgers":
      return BURGERS;
    case "assiettes":
      return ASSIETTES;
    case "bowls":
      return BOWLS;
    case "salades":
      return SALADES;
    default:
      return [];
  }
}

function extrasForMode(mode: ConfigMode) {
  if (mode === "tacos") {
    return EXTRAS.filter((e) => e.contexts.includes("tacos"));
  }
  if (mode === "bowls") {
    return EXTRAS.filter(
      (e) => e.contexts.includes("bowl") || e.id === "viande-bowl",
    );
  }
  return EXTRAS.filter(
    (e) =>
      e.contexts.includes("sandwich") || e.contexts.includes("general"),
  );
}

export function Configurator() {
  const t = useTranslations("configurator");
  const locale = useLocale() as "fr" | "en";
  const store = useConfiguratorStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("product");
    if (!productId) return;
    const item = getItemById(productId);
    if (!item) return;
    const mode = item.category as ConfigMode;
    if (
      mode === "sandwiches" ||
      mode === "durums" ||
      mode === "burgers" ||
      mode === "assiettes" ||
      mode === "bowls" ||
      mode === "salades"
    ) {
      store.selectFromCatalog(mode, item.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  const total = calculateTotal(store);

  const complete = store.isComplete();
  const maxMeats = store.maxMeats();
  const cartLines = useCartStore((s) => s.lines);
  const addLine = useCartStore((s) => s.addLine);
  const removeLine = useCartStore((s) => s.removeLine);
  const clearCart = useCartStore((s) => s.clear);
  const cartSum = useMemo(
    () =>
      Math.round(cartLines.reduce((sum, l) => sum + l.price, 0) * 100) / 100,
    [cartLines],
  );

  const addToCart = () => {
    if (!store.isComplete()) return;
    const snap = snapshotConfig(store);
    addLine({
      price: calculateTotal(snap),
      config: snap,
    });
    store.reset();
  };

  const chip = (active: boolean) =>
    `rounded-full border px-3 py-2 text-sm font-medium transition ${
      active
        ? "border-bordeaux bg-bordeaux text-cream"
        : "border-bordeaux/20 bg-white text-ink hover:border-bordeaux/40"
    }`;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-8">
        {/* Step 0: Category */}
        <section>
          <h2 className="font-display text-xl font-semibold text-bordeaux">
            1. {t("steps.category")}
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.id!}
                type="button"
                className={chip(store.mode === c.id)}
                onClick={() => store.setMode(c.id)}
              >
                {t(`categories.${c.key}`)}
              </button>
            ))}
          </div>
        </section>

        {/* Tacos size */}
        {store.mode === "tacos" && (
          <section>
            <h2 className="font-display text-xl font-semibold text-bordeaux">
              2. {t("steps.size")}
            </h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {TACO_SIZES.map((size) => (
                <button
                  key={size.id}
                  type="button"
                  className={`rounded-xl border p-4 text-left transition ${
                    store.tacoSize === size.id
                      ? "border-bordeaux bg-bordeaux/5 ring-2 ring-bordeaux"
                      : "border-bordeaux/15 bg-white hover:border-bordeaux/30"
                  }`}
                  onClick={() => store.setTacoSize(size.id)}
                >
                  <span className="font-display text-2xl font-semibold text-bordeaux">
                    {size.id}
                  </span>
                  <p className="mt-1 text-xs text-ink-muted">
                    {t("tacoHint", {
                      meats: size.meats,
                      wraps: size.wraps,
                    })}
                  </p>
                  <p className="mt-2 text-sm font-medium">
                    {formatPrice(size.prices.simple, locale)}
                  </p>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Product pick */}
        {store.mode &&
          store.mode !== "tacos" &&
          store.mode !== "enfant" && (
            <section>
              <h2 className="font-display text-xl font-semibold text-bordeaux">
                2. {t("steps.product")}
              </h2>
              <div className="mt-4 rounded-2xl border border-bordeaux/10 bg-cream/55 p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] backdrop-blur-[1px] sm:p-3">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {productsForMode(store.mode).map((item) => {
                    const name =
                      locale === "fr" ? item.nameFr : item.nameEn;
                    const active = store.productId === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => store.setProductId(item.id)}
                        className={`flex flex-col items-start gap-0.5 rounded-xl px-3 py-2.5 text-left transition duration-200 ${
                          active
                            ? "bg-bordeaux text-cream shadow-sm"
                            : "bg-cream/80 text-ink ring-1 ring-bordeaux/12 hover:bg-cream hover:ring-bordeaux/30"
                        }`}
                      >
                        <span className="text-sm font-semibold leading-snug">
                          {name}
                        </span>
                        <span
                          className={`font-display text-xs font-medium ${
                            active ? "text-cream/80" : "text-bordeaux"
                          }`}
                        >
                          {formatPrice(item.prices.simple, locale)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

        {/* Kids menu */}
        {store.mode === "enfant" && (
          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-bordeaux">
              2. {locale === "fr" ? MENU_ENFANT.nameFr : MENU_ENFANT.nameEn}{" "}
              — {formatPrice(MENU_ENFANT.price, locale)}
            </h2>
            <div>
              <p className="text-sm font-medium text-ink-muted">
                {t("kidsTheme")}
              </p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  className={chip(store.kidsTheme === "fille")}
                  onClick={() => store.setKidsTheme("fille")}
                >
                  {t("girl")}
                </button>
                <button
                  type="button"
                  className={chip(store.kidsTheme === "garcon")}
                  onClick={() => store.setKidsTheme("garcon")}
                >
                  {t("boy")}
                </button>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-ink-muted">
                {t("kidsMeat")}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(["nuggets", "kebab", "tenders"] as const).map((id) => {
                  const meat = MEATS.find((m) => m.id === id)!;
                  return (
                    <button
                      key={id}
                      type="button"
                      className={chip(store.kidsMeat === id)}
                      onClick={() => store.setKidsMeat(id)}
                    >
                      {locale === "fr" ? meat.nameFr : meat.nameEn}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Formula */}
        {store.mode &&
          store.mode !== "enfant" &&
          (store.productId || store.tacoSize) && (
            <section>
              <h2 className="font-display text-xl font-semibold text-bordeaux">
                3. {t("steps.formula")}
              </h2>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {(
                  [
                    ["simple", "formulas.simple", ""],
                    ["menu", "formulas.menu", "formulas.menuHint"],
                    [
                      "menuDessert",
                      "formulas.menuDessert",
                      "formulas.dessertHint",
                    ],
                  ] as const
                ).map(([key, labelKey, hintKey]) => {
                  let price = 0;
                  if (store.mode === "tacos" && store.tacoSize) {
                    price =
                      TACO_SIZES.find((s) => s.id === store.tacoSize)!
                        .prices[key as FormulaKey];
                  } else if (store.productId) {
                    price =
                      ALL_TIER_ITEMS.find((i) => i.id === store.productId)!
                        .prices[key as FormulaKey];
                  }
                  return (
                    <button
                      key={key}
                      type="button"
                      className={`rounded-xl border p-4 text-left transition ${
                        store.formula === key
                          ? "border-bordeaux bg-bordeaux/5 ring-2 ring-bordeaux"
                          : "border-bordeaux/15 bg-white hover:border-bordeaux/30"
                      }`}
                      onClick={() =>
                        store.setFormula(key as FormulaKey)
                      }
                    >
                      <span className="font-semibold text-ink">
                        {t(labelKey)}
                      </span>
                      {hintKey && (
                        <p className="mt-1 text-xs text-ink-muted">
                          {t(hintKey)}
                        </p>
                      )}
                      <p className="mt-2 font-display text-lg text-bordeaux">
                        {formatPrice(price, locale)}
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

        {/* Meat */}
        {((store.mode === "tacos" && store.formula) ||
          (store.needsMeatChoice() &&
            store.formula &&
            store.mode !== "enfant")) && (
          <section>
            <h2 className="font-display text-xl font-semibold text-bordeaux">
              4. {t("steps.meat")}
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              {maxMeats > 1
                ? t("selectMeats", { count: maxMeats })
                : t("selectMeat")}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(store.mode === "tacos"
                ? MEATS
                : store.productId === "panini"
                  ? MEATS.filter((m) =>
                      ["kebab", "poulet", "steak"].includes(m.id),
                    )
                  : store.productId === "salade-maison"
                    ? MEATS.filter((m) =>
                        ["poulet", "tenders"].includes(m.id),
                      )
                    : MEATS.filter((m) =>
                        ["steak", "kebab"].includes(m.id),
                      )
              ).map((meat) => (
                <button
                  key={meat.id}
                  type="button"
                  className={chip(store.meats.includes(meat.id))}
                  onClick={() => store.toggleMeat(meat.id)}
                >
                  {locale === "fr" ? meat.nameFr : meat.nameEn}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Sauces */}
        {store.formula && store.mode && store.mode !== "enfant" && (
          <section>
            <h2 className="font-display text-xl font-semibold text-bordeaux">
              5. {t("steps.sauces")}
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              {t("selectSauces")}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {SAUCES.map((sauce) => (
                <button
                  key={sauce.id}
                  type="button"
                  className={chip(store.sauces.includes(sauce.id))}
                  onClick={() => store.toggleSauce(sauce.id)}
                >
                  {locale === "fr" ? sauce.nameFr : sauce.nameEn}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Extras */}
        {store.formula && store.mode && store.mode !== "enfant" && (
          <section>
            <h2 className="font-display text-xl font-semibold text-bordeaux">
              6. {t("steps.extras")}
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              {t("selectExtras")}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {extrasForMode(store.mode).map((extra) => {
                const selected = store.extras.includes(extra.id);
                return (
                  <button
                    key={extra.id}
                    type="button"
                    className={`rounded-full border px-3 py-2 text-sm font-medium transition ${
                      selected
                        ? "border-green bg-green text-cream"
                        : "border-green/30 bg-white text-ink hover:border-green"
                    }`}
                    onClick={() => store.toggleExtra(extra.id)}
                  >
                    + {locale === "fr" ? extra.nameFr : extra.nameEn} (
                    {formatPrice(extra.price, locale)})
                  </button>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* Sticky cart + prix */}
      <aside className="lg:sticky lg:top-24 lg:self-start space-y-4">
        <div className="rounded-2xl border border-bordeaux/15 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            {t("currentItem")}
          </p>
          <p className="mt-2 font-display text-3xl font-semibold text-bordeaux">
            {formatPrice(total, locale)}
          </p>
          <button
            type="button"
            disabled={!complete}
            onClick={addToCart}
            className={`mt-4 w-full rounded-full px-4 py-3 text-sm font-semibold transition ${
              complete
                ? "bg-bordeaux text-cream hover:bg-bordeaux-light"
                : "cursor-not-allowed bg-cream-dark text-ink-muted"
            }`}
          >
            {t("addToCart")}
          </button>
          {!complete && (
            <p className="mt-2 text-center text-xs text-ink-muted">
              {t("incompleteAdd")}
            </p>
          )}
          <button
            type="button"
            onClick={() => store.reset()}
            className="mt-3 w-full text-xs text-ink-muted underline-offset-2 hover:underline"
          >
            {t("reset")}
          </button>
        </div>

        <div className="rounded-2xl bg-bordeaux p-5 text-cream shadow-xl">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-cream/60">
              {t("cart")}
            </p>
            {cartLines.length > 0 && (
              <button
                type="button"
                onClick={() => clearCart()}
                className="text-[11px] text-cream/70 underline-offset-2 hover:underline"
              >
                {t("clearCart")}
              </button>
            )}
          </div>

          {cartLines.length === 0 ? (
            <p className="mt-4 text-sm text-cream/70">{t("cartEmpty")}</p>
          ) : (
            <ul className="mt-4 max-h-56 space-y-3 overflow-y-auto pr-1">
              {cartLines.map((line) => {
                const { title, detail } = cartItemLabel(line.config, locale);
                return (
                  <li
                    key={line.id}
                    className="rounded-xl bg-cream/10 px-3 py-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {title}
                        </p>
                        {detail && (
                          <p className="mt-0.5 line-clamp-2 text-xs text-cream/65">
                            {detail}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeLine(line.id)}
                        className="shrink-0 text-xs text-cream/70 hover:text-cream"
                        aria-label={t("remove")}
                      >
                        ✕
                      </button>
                    </div>
                    <p className="mt-1 text-sm font-medium">
                      {formatPrice(line.price, locale)}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}

          <p className="mt-4 font-display text-3xl font-semibold">
            {formatPrice(cartSum, locale)}
          </p>
          <p className="text-sm text-cream/70">{t("finalTotal")}</p>

          <div className="mt-5 flex flex-col gap-2">
            <a
              href={`tel:${restaurant.phone.tel}`}
              className={`rounded-full px-4 py-3 text-center text-sm font-semibold transition ${
                cartLines.length
                  ? "bg-cream text-bordeaux hover:bg-white"
                  : "pointer-events-none bg-cream/30 text-cream/50"
              }`}
            >
              {t("call")} · {restaurant.phone.display}
            </a>
            <a
              href={
                cartLines.length
                  ? whatsappCartUrl(cartLines, locale)
                  : undefined
              }
              target="_blank"
              rel="noopener noreferrer"
              className={`rounded-full px-4 py-3 text-center text-sm font-semibold transition ${
                cartLines.length
                  ? "bg-green-soft text-ink hover:brightness-110"
                  : "pointer-events-none bg-cream/20 text-cream/50"
              }`}
              aria-disabled={!cartLines.length}
            >
              {t("whatsapp")}
            </a>
            {!cartLines.length && (
              <p className="text-center text-xs text-cream/60">
                {t("incomplete")}
              </p>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
