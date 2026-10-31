import { EXTRAS, type Extra } from "@/data/menu";
import type { ConfigMode } from "@/lib/store/configurator";

export function getAllowedExtras(mode: ConfigMode, productId: string | null) {
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
      if (productId !== "pizza-lahmacun") return [];
      context = "lahmacun";
      break;
    default:
      return [];
  }
  return EXTRAS.filter((extra) => extra.contexts.includes(context));
}
