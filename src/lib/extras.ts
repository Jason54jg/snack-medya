import { EXTRAS } from "@/data/menu";
import type { ConfigMode } from "@/lib/store/configurator";
export function getAllowedExtras(mode: ConfigMode, productId: string | null) {
  if (!mode || mode === "enfant") return [];
  if (mode === "tacos") return EXTRAS.filter((extra) => extra.contexts.includes("tacos"));
  if (mode === "bowls") return EXTRAS.filter((extra) => extra.contexts.includes("bowl"));
  return EXTRAS.filter((extra) =>
    (extra.contexts.includes("sandwich") || extra.contexts.includes("general")) &&
    (extra.id !== "lahmacun-viande" || productId === "pizza-lahmacun")
  );
}
