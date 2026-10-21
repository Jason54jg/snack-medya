import { formatPrice } from "@/data/menu";
import { restaurant } from "@/data/restaurant";
import { calculateTotal } from "@/lib/pricing";
import type { CartLine } from "@/lib/store/cart";
import type { ConfiguratorState } from "@/lib/store/configurator";
import { cartItemLabel } from "@/lib/cartLabel";

export function buildCartOrderMessage(
  lines: CartLine[],
  locale: "fr" | "en",
): string {
  const total =
    Math.round(lines.reduce((sum, l) => sum + l.price, 0) * 100) / 100;
  const linesOut: string[] = [];

  if (locale === "fr") {
    linesOut.push(`Bonjour ${restaurant.name},`);
    linesOut.push("Je souhaiterais commander :");
  } else {
    linesOut.push(`Hello ${restaurant.name},`);
    linesOut.push("I would like to order:");
  }
  linesOut.push("");

  lines.forEach((line, i) => {
    const { title, detail } = cartItemLabel(line.config, locale);
    linesOut.push(`${i + 1}. ${title} — ${formatPrice(line.price, locale)}`);
    if (detail) linesOut.push(`   ${detail}`);
  });

  linesOut.push("");
  linesOut.push(
    `${locale === "fr" ? "Total estimé" : "Estimated total"}: ${formatPrice(total, locale)}`,
  );
  linesOut.push(locale === "fr" ? "Merci !" : "Thank you!");

  return linesOut.join("\n");
}

export function whatsappCartUrl(
  lines: CartLine[],
  locale: "fr" | "en",
): string {
  const text = encodeURIComponent(buildCartOrderMessage(lines, locale));
  return `https://wa.me/${restaurant.phone.whatsapp}?text=${text}`;
}

/** @deprecated single-item — préférer le panier */
export function buildOrderMessage(
  state: ConfiguratorState,
  locale: "fr" | "en",
): string {
  return buildCartOrderMessage(
    [{ id: "1", price: calculateTotal(state), config: state }],
    locale,
  );
}

export function whatsappOrderUrl(
  state: ConfiguratorState,
  locale: "fr" | "en",
): string {
  return whatsappCartUrl(
    [
      { id: "1", price: calculateTotal(state), config: state },
    ],
    locale,
  );
}
