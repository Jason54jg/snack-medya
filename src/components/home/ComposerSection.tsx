import { getTranslations } from "next-intl/server";
import { Configurator } from "@/components/configurator/Configurator";

export async function ComposerSection() {
  const t = await getTranslations("configurator");

  return (
    <div
      id="composer"
      className="scroll-mt-24 bg-lattice mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20"
    >
      <header className="max-w-2xl">
        <h2 className="font-display text-3xl font-semibold text-bordeaux sm:text-4xl">
          {t("title")}
        </h2>
        <p className="mt-3 text-ink-muted">{t("subtitle")}</p>
      </header>
      <div className="mt-10">
        <Configurator />
      </div>
    </div>
  );
}
