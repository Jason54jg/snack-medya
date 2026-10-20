import { NextResponse } from "next/server";
import { getReviews } from "@/lib/reviews/fetchReviews";

export const revalidate = 3600;

export async function GET() {
  const data = await getReviews();
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
