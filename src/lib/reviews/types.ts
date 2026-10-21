export type LiveReview = {
  id: string;
  author: string;
  rating: number;
  text: string;
  relativeTime?: string;
  /** Date ISO de publication, quand la source la fournit (Google Places) */
  publishedAt?: string;
  source: "Google";
};

export type ReviewsPayload = {
  rating: number;
  totalCount: number;
  reviews: LiveReview[];
  mapsUrl: string;
  fetchedAt: string;
  source: "google-places" | "google-maps" | "aggregator" | "fallback";
};
