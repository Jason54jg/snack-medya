import type { ReviewsPayload } from "./types";

/** Avis publics connus (sources agrégées) — utilisés si les APIs échouent */
export const FALLBACK_REVIEWS: ReviewsPayload = {
  rating: 4.4,
  totalCount: 254,
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Snack+Medya+Neufch%C3%A2teau&query_place_id=ChIJJUEoD0Gz7EcRunIOtLfN6Sg",
  fetchedAt: null,
  source: "fallback",
  reviews: [
    {
      id: "fb-1",
      author: "Jean Brahhammer",
      rating: 5,
      text: "Kebab excellent ! Bien préparé. Cuisine et établissement très propre. Large choix de menu. Je recommande vivement ce restaurant.",
      source: "Google",
    },
    {
      id: "fb-2",
      author: "Alan",
      rating: 5,
      text: "Super bon, surtout les frites. Personnel très accueillant et sympathique. Meilleur kebab de Neufchâteau, je recommande.",
      source: "Google",
    },
    {
      id: "fb-3",
      author: "Thierry Meunier",
      rating: 5,
      text: "Très sympa, assiette copieuse. Service rapide et bon.",
      source: "Google",
    },
    {
      id: "fb-4",
      author: "Cédric Muller",
      rating: 5,
      text: "Très bon kebab je recommande sans hésitation.",
      source: "Google",
    },
    {
      id: "fb-5",
      author: "roger",
      rating: 5,
      text: "Ils ont préparé un repas sans gluten pour ma femme. Bonne nourriture, bon rapport qualité-prix, personnel serviable, propre et bien fréquenté par les locaux.",
      source: "Google",
    },
    {
      id: "fb-6",
      author: "M",
      rating: 5,
      text: "Très bon kebab ! Et serveuse jeune et dynamique ! Je recommande !",
      source: "Google",
    },
    {
      id: "fb-7",
      author: "Cédric",
      rating: 5,
      text: "Très bon kebab, je recommande sans hésitation.",
      source: "Google",
    },
  ],
};
