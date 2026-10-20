import {
  EXTRAS,
  MEATS,
  MENU_ENFANT,
  SAUCES,
  getItemById,
} from "@/data/menu";
import { formulaLabel } from "@/lib/pricing";
import type { ConfiguratorState } from "@/lib/store/configurator";

export function cartItemLabel(
  state: ConfiguratorState,
  locale: "fr" | "en",
): { title: string; detail: string } {
  const parts: string[] = [];

  let title = locale === "fr" ? "Article" : "Item";

  if (state.mode === "enfant") {
    title = locale === "fr" ? MENU_ENFANT.nameFr : MENU_ENFANT.nameEn;
    const theme =
      state.kidsTheme === "fille"
        ? locale === "fr"
          ? "Fille"
          : "Girl"
        : locale === "fr"
          ? "Garçon"
          : "Boy";
    parts.push(theme);
    const meat = MEATS.find((m) => m.id === state.kidsMeat);
    if (meat) parts.push(locale === "fr" ? meat.nameFr : meat.nameEn);
  } else if (state.mode === "tacos") {
    title = `Tacos ${state.tacoSize ?? ""}`.trim();
    if (state.formula) parts.push(formulaLabel(state.formula, locale));
    if (state.meats.length) {
      parts.push(
        state.meats
          .map((id) => {
            const m = MEATS.find((x) => x.id === id);
            return m ? (locale === "fr" ? m.nameFr : m.nameEn) : id;
          })
          .join(", "),
      );
    }
  } else if (state.productId) {
    const item = getItemById(state.productId);
    if (item) title = locale === "fr" ? item.nameFr : item.nameEn;
    if (state.formula) parts.push(formulaLabel(state.formula, locale));
    if (state.meats.length) {
      parts.push(
        state.meats
          .map((id) => {
            const m = MEATS.find((x) => x.id === id);
            return m ? (locale === "fr" ? m.nameFr : m.nameEn) : id;
          })
          .join(", "),
      );
    }
  }

  if (state.sauces.length) {
    parts.push(
      state.sauces
        .map((id) => {
          const s = SAUCES.find((x) => x.id === id);
          return s ? (locale === "fr" ? s.nameFr : s.nameEn) : id;
        })
        .join(", "),
    );
  }

  if (state.extras.length) {
    parts.push(
      "+ " +
        state.extras
          .map((id) => {
            const e = EXTRAS.find((x) => x.id === id);
            return e ? (locale === "fr" ? e.nameFr : e.nameEn) : id;
          })
          .join(", "),
    );
  }

  return { title, detail: parts.filter(Boolean).join(" · ") };
}

export function snapshotConfig(
  state: ConfiguratorState,
): Omit<ConfiguratorState, "step"> & { step: number } {
  return {
    mode: state.mode,
    productId: state.productId,
    formula: state.formula,
    tacoSize: state.tacoSize,
    meats: [...state.meats],
    sauces: [...state.sauces],
    extras: [...state.extras],
    kidsTheme: state.kidsTheme,
    kidsMeat: state.kidsMeat,
    step: state.step,
  };
}
