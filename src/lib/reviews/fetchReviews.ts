import { FALLBACK_REVIEWS } from "./fallback";
import type { LiveReview, ReviewsPayload } from "./types";

const PLACE_ID =
  process.env.GOOGLE_PLACE_ID ?? "ChIJJUEoD0Gz7EcRunIOtLfN6Sg";

/** Identifiant interne Google Maps de la fiche (sert à repérer le bon résultat) */
const MAPS_FEATURE_ID = "0x47ecb3410f284125:0x28e9cdb7b40e72ba";
const MAPS_QUERY = "Snack Medya 23 Avenue Kennedy 88300 Neufchâteau";

const MAPS_URL =
  process.env.GOOGLE_MAPS_URL ??
  "https://www.google.com/maps/search/?api=1&query=Snack+Medya+Neufch%C3%A2teau&query_place_id=ChIJJUEoD0Gz7EcRunIOtLfN6Sg";

const REVALIDATE = 60 * 60; // 1 h
const FETCH_TIMEOUT_MS = 8_000;
const DISPLAYED_REVIEWS = 3;

/**
 * Les 3 meilleurs avis les plus récents : 5★ d'abord, complétés par des 4★.
 * Sans date (sources publiques), on garde l'ordre de la source.
 */
function pickTopRecent(reviews: LiveReview[]): LiveReview[] {
  const byDateDesc = reviews
    .map((r, i) => ({ r, i, t: r.publishedAt ? Date.parse(r.publishedAt) : NaN }))
    .sort((a, b) => {
      const ta = Number.isFinite(a.t) ? a.t : -Infinity;
      const tb = Number.isFinite(b.t) ? b.t : -Infinity;
      return tb - ta || a.i - b.i;
    })
    .map(({ r }) => r);

  return [
    ...byDateDesc.filter((r) => r.rating === 5),
    ...byDateDesc.filter((r) => r.rating === 4),
  ].slice(0, DISPLAYED_REVIEWS);
}

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
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=name,rating,user_ratings_total,reviews,url&reviews_sort=newest&language=fr&key=${key}`,
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
          publishedAt: r.time ? new Date(r.time * 1000).toISOString() : undefined,
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
          publishTime?: string;
        },
        i: number,
      ) => ({
        id: r.name ?? `g-new-${i}`,
        author: r.authorAttribution?.displayName ?? "Client Google",
        rating: r.rating ?? 5,
        text: r.text?.text ?? "",
        relativeTime: r.relativePublishTimeDescription,
        publishedAt: r.publishTime,
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

/**
 * Note + nombre d'avis en direct depuis la recherche publique Google Maps (sans clé API).
 * Format interne non documenté : en cas de changement, on retombe sur l'agrégateur.
 */
async function fetchFromGoogleMapsPublic(): Promise<Partial<ReviewsPayload> | null> {
  try {
    const res = await fetch(
      `https://www.google.com/search?tbm=map&hl=fr&gl=fr&q=${encodeURIComponent(MAPS_QUERY)}`,
      fetchOpts({
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36",
          "Accept-Language": "fr-FR,fr;q=0.9",
        },
      }),
    );
    if (!res.ok) return null;
    const body = await res.text();

    const featureAt = body.indexOf(MAPS_FEATURE_ID);
    if (featureAt < 0) return null;

    // …["254 avis",…],null,null,null,4.4,254]… juste avant l'identifiant de la fiche
    const pattern = /\],null,null,null,([1-5](?:\.\d+)?),(\d+)[,\]]/g;
    let best: RegExpExecArray | null = null;
    for (let m = pattern.exec(body); m && m.index < featureAt; m = pattern.exec(body)) {
      best = m;
    }
    if (!best || featureAt - best.index > 1000) return null;

    const rating = Number(best[1]);
    const totalCount = Number(best[2]);
    if (!(rating >= 1 && rating <= 5) || !(totalCount > 0)) return null;

    return {
      rating,
      totalCount,
      mapsUrl: MAPS_URL,
      fetchedAt: new Date().toISOString(),
      source: "google-maps",
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
  const payload = await collectReviews();
  const top = pickTopRecent(payload.reviews);
  return {
    ...payload,
    reviews: top.length ? top : pickTopRecent(FALLBACK_REVIEWS.reviews),
  };
}

async function collectReviews(): Promise<ReviewsPayload> {
  if (process.env.SKIP_LIVE_REVIEWS === "1") return FALLBACK_REVIEWS;
  const [fromGoogle, mapsMeta, aggregatorMeta, texts] = await Promise.all([
    fetchFromGooglePlaces(),
    fetchFromGoogleMapsPublic(),
    fetchFromAggregator(),
    fetchPublicReviewTexts(),
  ]);
  // Google Maps (à jour) avant l'agrégateur (souvent en retard)
  const meta = mapsMeta ?? aggregatorMeta;

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
        : mapsMeta
          ? "google-maps"
          : aggregatorMeta
            ? "aggregator"
            : "fallback",
    };
  }

  return {
    ...FALLBACK_REVIEWS,
    fetchedAt: new Date().toISOString(),
  };
}
