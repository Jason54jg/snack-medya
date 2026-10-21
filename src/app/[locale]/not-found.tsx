import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-20 text-center">
      <p className="font-display text-6xl font-semibold text-bordeaux">404</p>
      <h1 className="mt-4 font-display text-2xl text-ink">{t("title")}</h1>
      <Link
        href="/"
        className="mt-8 rounded-full bg-bordeaux px-5 py-2.5 text-sm font-semibold text-cream hover:bg-bordeaux-light"
      >
        {t("back")}
      </Link>
    </div>
  );
}
