import { FALLBACK_REVIEWS } from "./fallback";
import type { LiveReview, ReviewsPayload } from "./types";

const PLACE_ID =
  process.env.GOOGLE_PLACE_ID ?? "ChIJZ1r8tGJp5UcRoLdLrz8FSd0";

const MAPS_URL =
  process.env.GOOGLE_MAPS_URL ??
  "https://www.google.com/maps/search/?api=1&query=Snack+Medya+23+Avenue+Kennedy+Neufchateau";

const REVALIDATE = 60 * 60; // 1 h
const FETCH_TIMEOUT_MS = 8_000;

function fetchOpts(init: RequestInit = {}): RequestInit {
  return {
    ...init,
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    next: { revalidate: REVALIDATE },
  };
}

async function fetchFromGooglePlaces(): Promise<ReviewsPayload | null> {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) return null;

  try {
    // Places API (New) — Place Details
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${PLACE_ID}`,
      fetchOpts({
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": key,
          "X-Goog-FieldMask":
            "id,displayName,rating,userRatingCount,reviews,googleMapsUri",
        },
      }),
    );

    if (!res.ok) {
      // Legacy Place Details fallback
      const legacy = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=name,rating,user_ratings_total,reviews,url&language=fr&key=${key}`,
        fetchOpts(),
      );
      if (!legacy.ok) return null;
      const data = await legacy.json();
      if (data.status !== "OK" || !data.result) return null;

      const reviews: LiveReview[] = (data.result.reviews ?? []).map(
        (
          r: {
            author_name: string;
            rating: number;
            text: string;
            relative_time_description?: string;
            time?: number;
          },
          i: number,
        ) => ({
          id: `g-${r.time ?? i}`,
          author: r.author_name,
          rating: r.rating,
          text: r.text,
          relativeTime: r.relative_time_description,
          source: "Google" as const,
        }),
      );

      return {
        rating: data.result.rating ?? FALLBACK_REVIEWS.rating,
        totalCount:
          data.result.user_ratings_total ?? FALLBACK_REVIEWS.totalCount,
        reviews: reviews.filter((r) => r.text?.trim()),
        mapsUrl: data.result.url ?? MAPS_URL,
        fetchedAt: new Date().toISOString(),
        source: "google-places",
      };
    }

    const data = await res.json();
    const reviews: LiveReview[] = (data.reviews ?? []).map(
      (
        r: {
          name?: string;
          authorAttribution?: { displayName?: string };
          rating?: number;
          text?: { text?: string };
          relativePublishTimeDescription?: string;
        },
        i: number,
      ) => ({
        id: r.name ?? `g-new-${i}`,
        author: r.authorAttribution?.displayName ?? "Client Google",
        rating: r.rating ?? 5,
        text: r.text?.text ?? "",
        relativeTime: r.relativePublishTimeDescription,
        source: "Google" as const,
      }),
    );

    return {
      rating: data.rating ?? FALLBACK_REVIEWS.rating,
      totalCount: data.userRatingCount ?? FALLBACK_REVIEWS.totalCount,
      reviews: reviews.filter((r) => r.text.trim()),
      mapsUrl: data.googleMapsUri ?? MAPS_URL,
      fetchedAt: new Date().toISOString(),
      source: "google-places",
    };
  } catch {
    return null;
  }
}

/** Note + volume via JSON-LD Rankeat (agrégateur Google, sans clé API) */
async function fetchFromAggregator(): Promise<Partial<ReviewsPayload> | null> {
  try {
    const res = await fetch(
      "https://rankeat.fr/restaurants/snack-medya-neufchateau",
      fetchOpts({
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; SnackMedyaBot/1.0; +https://snack-medya.fr)",
          Accept: "text/html",
        },
      }),
    );
    if (!res.ok) return null;
    const html = await res.text();

    const scripts = [
      ...html.matchAll(/<script[^>]*ld\+json[^>]*>([\s\S]*?)<\/script>/gi),
    ];

    for (const match of scripts) {
      try {
        const json = JSON.parse(match[1]);
        if (
          json?.name === "Snack Medya" &&
          json?.aggregateRating?.ratingValue
        ) {
          const rating = Number(json.aggregateRating.ratingValue);
          const totalCount = Number(
            json.aggregateRating.reviewCount ??
              json.aggregateRating.ratingCount,
          );
          if (!Number.isFinite(rating) || !Number.isFinite(totalCount)) {
            continue;
          }
          return {
            rating,
            totalCount,
            mapsUrl: MAPS_URL,
            fetchedAt: new Date().toISOString(),
            source: "aggregator",
          };
        }
      } catch {
        /* next script */
      }
    }

    return null;
  } catch {
    return null;
  }
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  rsquo: "’",
  lsquo: "‘",
  rdquo: "”",
  ldquo: "“",
  hellip: "…",
  eacute: "é",
  egrave: "è",
  ecirc: "ê",
  agrave: "à",
  acirc: "â",
  ccedil: "ç",
  ocirc: "ô",
  ugrave: "ù",
  icirc: "î",
};

/** Texte brut HTML → texte (balises retirées, entités décodées) */
function htmlToText(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code: string) => {
      if (code[0] === "#") {
        const n =
          code[1] === "x" || code[1] === "X"
            ? parseInt(code.slice(2), 16)
            : parseInt(code.slice(1), 10);
        return Number.isFinite(n) && n > 0 && n <= 0x10ffff
          ? String.fromCodePoint(n)
          : match;
      }
      return NAMED_ENTITIES[code.toLowerCase()] ?? match;
    })
    .replace(/\s+/g, " ")
    .trim();
}

/** Avis individuels depuis une fiche publique (sans clé Google) */
async function fetchPublicReviewTexts(): Promise<LiveReview[] | null> {
  try {
    const res = await fetch(
      "https://cavajazzer.fr/snack-medya/",
      fetchOpts({
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; SnackMedyaBot/1.0; +https://snack-medya.fr)",
          Accept: "text/html",
        },
      }),
    );
    if (!res.ok) return null;
    const html = await res.text();

    const start = html.search(/Avis de Snack Medya/i);
    if (start < 0) return null;
    const section = html.slice(start, start + 25000);
    const end = section.search(
      /D['’]autres entreprises|Contact information|Proposez une modification/i,
    );
    const chunk = end > 0 ? section.slice(0, end) : section;

    const parts = chunk.split(/<h[2-5][^>]*>/i).slice(1);
    const reviews: LiveReview[] = [];

    for (const part of parts) {
      const authorMatch = part.match(/^([\s\S]*?)<\/h[2-5]>/i);
      if (!authorMatch) continue;
      const author = htmlToText(authorMatch[1]);
      if (
        !author ||
        /Avis de Snack|Emplacement|Contact|Liens|Catégories|Location/i.test(
          author,
        )
      ) {
        continue;
      }

      const after = part.slice(authorMatch[0].length);
      const head = htmlToText(after.slice(0, 200));
      const ratingMatch = head.match(/\b([1-5])\s*\/\s*5\b/);
      // Sans note explicite : on n’invente pas (affiche 0 étoile → masqué côté UI si besoin)
      const rating = ratingMatch ? parseInt(ratingMatch[1], 10) : 0;

      const pMatch = after.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
      const text = htmlToText(pMatch?.[1] ?? "");

      if (text.length < 15) continue;

      reviews.push({
        id: `pub-${reviews.length}-${author.slice(0, 16).replace(/\s+/g, "-")}`,
        author,
        rating: Number.isFinite(rating) ? rating : 0,
        text: text.slice(0, 600),
        source: "Google",
      });
      if (reviews.length >= 25) break;
    }

    return reviews.length >= 3 ? reviews : null;
  } catch {
    return null;
  }
}

export async function getReviews(): Promise<ReviewsPayload> {
  const [fromGoogle, meta, texts] = await Promise.all([
    fetchFromGooglePlaces(),
    fetchFromAggregator(),
    fetchPublicReviewTexts(),
  ]);

  if (fromGoogle && fromGoogle.reviews.length > 0) {
    return {
      ...fromGoogle,
      // Prefer live total from Places; keep aggregator as backup if missing
      totalCount: fromGoogle.totalCount || meta?.totalCount || fromGoogle.totalCount,
      rating: fromGoogle.rating || meta?.rating || fromGoogle.rating,
    };
  }

  if (meta || texts || fromGoogle) {
    return {
      rating:
        fromGoogle?.rating ?? meta?.rating ?? FALLBACK_REVIEWS.rating,
      totalCount:
        fromGoogle?.totalCount ??
        meta?.totalCount ??
        FALLBACK_REVIEWS.totalCount,
      reviews: texts?.length
        ? texts
        : fromGoogle?.reviews?.length
          ? fromGoogle.reviews
          : FALLBACK_REVIEWS.reviews,
      mapsUrl: fromGoogle?.mapsUrl ?? MAPS_URL,
      fetchedAt: new Date().toISOString(),
      source: fromGoogle
        ? "google-places"
        : meta
          ? "aggregator"
          : "fallback",
    };
  }

  return {
    ...FALLBACK_REVIEWS,
    fetchedAt: new Date().toISOString(),
  };
}
