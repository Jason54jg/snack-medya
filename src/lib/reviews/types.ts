export type LiveReview = {
  id: string;
  author: string;
  rating: number;
  text: string;
  relativeTime?: string;
  source: "Google";
};

export type ReviewsPayload = {
  rating: number;
  totalCount: number;
  reviews: LiveReview[];
  mapsUrl: string;
  fetchedAt: string;
  source: "google-places" | "aggregator" | "fallback";
};
