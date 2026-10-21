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
    whatsapp: "33329943038",
  },
  hours: [
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
    {
      id: "mon",
      daysFr: "Lundi",
      daysEn: "Monday",
      slots: [],
      closed: true,
    },
  ],
  maps: {
    embedUrl:
      "https://maps.google.com/maps?q=23+Avenue+Kennedy,+88300+Neufch%C3%A2teau&t=&z=16&ie=UTF8&iwloc=&output=embed",
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=23+Avenue+Kennedy,+88300+Neufch%C3%A2teau",
    reviewsUrl:
      "https://www.google.com/maps/search/?api=1&query=Snack+Medya+23+Avenue+Kennedy+Neufchateau",
  },
  /** Fiche Uber Eats du restaurant — boutons masqués tant que vide */
  uberEatsUrl:
    "https://www.ubereats.com/fr/store/snack-medya/6rlq2FKDVlqgi2GltUe-cw",
  placeId: "ChIJZ1r8tGJp5UcRoLdLrz8FSd0",
  geo: {
    lat: 48.3556,
    lng: 5.6962,
  },
} as const;
