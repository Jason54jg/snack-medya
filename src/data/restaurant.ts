export const restaurant = {
  name: "Snack Medya",
  brand: "Medya Kebab",
  address: {
    street: "23 Avenue Kennedy",
    city: "Neufchâteau",
    postalCode: "88300",
    country: "France",
    full: "23 Avenue Kennedy, 88300 Neufchâteau",
  },
  phone: {
    display: "03 29 94 30 38",
    tel: "+33329943038",
  },
  hours: [
    {
      id: "mon",
      daysFr: "Lundi",
      daysEn: "Monday",
      slots: [],
      closed: true,
    },
    {
      id: "tue-sat",
      daysFr: "Mardi – Samedi",
      daysEn: "Tuesday – Saturday",
      slots: ["11h00 – 14h00", "17h00 – 22h00"],
    },
    {
      id: "sun",
      daysFr: "Dimanche",
      daysEn: "Sunday",
      slots: ["17h00 – 22h00"],
    },
  ],
  maps: {
    embedUrl:
      "https://maps.google.com/maps?q=23+Avenue+Kennedy,+88300+Neufch%C3%A2teau&t=&z=16&ie=UTF8&iwloc=&output=embed",
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=23+Avenue+Kennedy,+88300+Neufch%C3%A2teau",
    reviewsUrl:
      "https://www.google.com/maps/search/?api=1&query=Snack+Medya+Neufch%C3%A2teau&query_place_id=ChIJJUEoD0Gz7EcRunIOtLfN6Sg",
  },
  /** Fiche Uber Eats du restaurant — boutons masqués tant que vide */
  uberEatsUrl:
    "https://www.ubereats.com/fr/store/snack-medya/6rlq2FKDVlqgi2GltUe-cw",
  placeId: "ChIJJUEoD0Gz7EcRunIOtLfN6Sg",
  geo: {
    lat: 48.3549586,
    lng: 5.6915295,
  },
} as const;
