import assert from "node:assert/strict";
import test from "node:test";
import { loadTypescript } from "./load-avis.mjs";

test("un échec de toutes les sources ne rajeunit pas le secours", async () => {
  const previous = global.fetch;
  global.fetch = async () => { throw Error("offline"); };
  try {
    const { getReviews } = loadTypescript("src/lib/reviews/fetchReviews.ts");
    const result = await getReviews();
    assert.equal(result.source, "fallback");
    assert.equal(result.fetchedAt, null);
    assert.ok(Number.isFinite(Date.parse(result.attemptedAt)));
    assert.ok(result.reviews.length > 0);
  } finally { global.fetch = previous; }
});
