import { getReviews } from "@/lib/reviews/fetchReviews";
import { ReviewsCarousel } from "./ReviewsCarousel";

export async function ReviewsSection() {
  const data = await getReviews();
  return <ReviewsCarousel initialData={data} />;
}
