import {
  MENU_ENFANT,
  TACO_SIZES,
  getItemById,
  type FormulaKey,
} from "@/data/menu";
import { getAllowedExtras } from "@/lib/extras";
import type { ConfiguratorState } from "@/lib/store/configurator";

export function calculateTotal(state: ConfiguratorState): number {
  if (state.mode === "enfant") {
    return MENU_ENFANT.price;
  }

  let base = 0;

  if (state.mode === "tacos") {
    const size = TACO_SIZES.find((s) => s.id === state.tacoSize);
    if (!size || !state.formula) return 0;
    base = size.prices[state.formula];
  } else if (state.productId && state.formula) {
    const item = getItemById(state.productId);
    if (!item) return 0;
    base = item.prices[state.formula];
    // Salade maison : +1€ si poulet ou tenders (normale 10€ → 11€)
    if (
      state.productId === "salade-maison" &&
      state.meats.some((m) => m === "poulet" || m === "tenders")
    ) {
      base += 1;
    }
  } else {
    return 0;
  }

  const allowedExtras = getAllowedExtras(state.mode, state.productId, state.formula);
  const extraTotal = state.extras.reduce((sum, extraId) => {
    const extra = allowedExtras.find((e) => e.id === extraId);
    return sum + (extra?.price ?? 0);
  }, 0);

  return Math.round((base + extraTotal) * 100) / 100;
}

export function formulaLabel(
  key: FormulaKey,
  locale: "fr" | "en",
): string {
  const map = {
    fr: { simple: "Simple", menu: "Menu", menuDessert: "Menu dessert" },
    en: {
      simple: "Single",
      menu: "Meal deal",
      menuDessert: "Meal + dessert",
    },
  };
  return map[locale][key];
}
