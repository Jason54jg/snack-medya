import { getReviews } from "@/lib/reviews/fetchReviews";
import { ReviewsGrid } from "./ReviewsGrid";

export async function ReviewsSection() {
  const data = await getReviews();
  return <ReviewsGrid initialData={data} />;
}
