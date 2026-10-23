"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { LiveReview, ReviewsPayload } from "@/lib/reviews/types";

type Props = {
  initialData: ReviewsPayload;
};

export function ReviewsGrid({ initialData }: Props) {
  const t = useTranslations("reviews");
  const [data, setData] = useState(initialData);

  useEffect(() => {
    let cancelled = false;

    // Export statique (GitHub Pages) : pas de route /api, on garde le payload du build
    if (process.env.NEXT_PUBLIC_STATIC_EXPORT === "true") return;

    async function refresh() {
      try {
        const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
        const res = await fetch(`${base}/api/reviews`, { cache: "no-store" });
        if (!res.ok) return;
        const json = (await res.json()) as ReviewsPayload;
        if (!cancelled && json.reviews?.length) {
          setData(json);
        }
      } catch {
        /* keep SSR payload */
      }
    }

    refresh();
    const interval = window.setInterval(refresh, 60 * 60 * 1000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  const reviews = data.reviews;
  if (!reviews.length) return null;

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <h2 className="font-display text-3xl font-semibold text-bordeaux sm:text-4xl">
          {t("title")}
        </h2>
        <p className="mt-2 text-ink-muted">{t("subtitle")}</p>
        <p className="mt-3 text-sm font-medium text-gold">
          {t("rating", {
            rating: data.rating.toFixed(1).replace(".", ","),
            count: data.totalCount,
          })}
        </p>

        <ul className="mt-10 grid gap-5 text-left md:grid-cols-3">
          {reviews.map((review: LiveReview) => (
            <li key={review.id}>
              <blockquote className="flex h-full flex-col rounded-2xl bg-white/80 px-6 py-7 ring-1 ring-bordeaux/8 backdrop-blur-sm">
                <div
                  className="flex gap-0.5 text-bordeaux"
                  aria-label={`${review.rating} / 5`}
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-lg" aria-hidden>
                      {i < review.rating ? "★" : "☆"}
                    </span>
                  ))}
                </div>
                <p className="mt-4 flex-1 font-display text-base leading-relaxed text-ink sm:text-lg">
                  “{review.text}”
                </p>
                <footer className="mt-4 text-sm font-medium text-ink-muted">
                  {review.author}
                  {review.relativeTime ? ` · ${review.relativeTime}` : ""} ·{" "}
                  {review.source}
                </footer>
              </blockquote>
            </li>
          ))}
        </ul>

        <a
          href={data.mapsUrl}
          data-track="google-reviews"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex rounded-full border border-bordeaux/25 bg-white/70 px-5 py-2.5 text-sm font-semibold text-bordeaux transition hover:bg-bordeaux hover:text-cream"
        >
          {t("seeAll", { count: data.totalCount })}
        </a>
      </div>
    </section>
  );
}
