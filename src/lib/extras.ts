import { EXTRAS, type Extra, type FormulaKey } from "@/data/menu";
import type { ConfigMode } from "@/lib/store/configurator";

export function getAllowedExtras(mode: ConfigMode, productId: string | null, formula: FormulaKey | null = null) {
  let context: Extra["contexts"][number];
  switch (mode) {
    case "sandwiches":
      context = "sandwich";
      break;
    case "tacos":
      context = "tacos";
      break;
    case "bowls":
      context = "bowl";
      break;
    case "durums":
      context = "durum";
      break;
    default:
      return [];
  }
  return EXTRAS.filter((extra) =>
    (extra.contexts.includes(context) ||
      (mode === "durums" && productId === "pizza-lahmacun" && extra.contexts.includes("lahmacun"))) &&
    (!extra.formulas || (formula !== null && extra.formulas.includes(formula)))
  );
}
