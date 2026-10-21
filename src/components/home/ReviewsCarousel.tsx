"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { LiveReview, ReviewsPayload } from "@/lib/reviews/types";

type Props = {
  initialData: ReviewsPayload;
};

export function ReviewsCarousel({ initialData }: Props) {
  const t = useTranslations("reviews");
  const [data, setData] = useState(initialData);
  const [index, setIndex] = useState(0);

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
          setIndex(0);
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
  const safeIndex = reviews.length ? index % reviews.length : 0;

  useEffect(() => {
    if (reviews.length < 2) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(id);
  }, [reviews.length]);

  if (!reviews.length) return null;

  const review: LiveReview = reviews[safeIndex];

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
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

        <blockquote
          key={review.id}
          className="animate-fade-in mt-10 rounded-2xl bg-white/80 px-6 py-8 ring-1 ring-bordeaux/8 backdrop-blur-sm"
        >
          {review.rating > 0 && (
            <div
              className="flex justify-center gap-0.5 text-bordeaux"
              aria-label={`${review.rating} / 5`}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-lg">
                  {i < review.rating ? "★" : "☆"}
                </span>
              ))}
            </div>
          )}
          <p className="mt-4 font-display text-lg leading-relaxed text-ink sm:text-xl">
            “{review.text}”
          </p>
          <footer className="mt-4 text-sm font-medium text-ink-muted">
            {review.author}
            {review.relativeTime ? ` · ${review.relativeTime}` : ""} ·{" "}
            {review.source}
          </footer>
        </blockquote>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {reviews.map((r, i) => (
            <button
              key={r.id}
              type="button"
              aria-label={t("dot", { n: i + 1 })}
              onClick={() => setIndex(i)}
              className={`h-2 w-2 rounded-full transition ${
                i === safeIndex ? "scale-125 bg-bordeaux" : "bg-bordeaux/25"
              }`}
            />
          ))}
        </div>

        <a
          href={data.mapsUrl}
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
