export type FormulaKey = "simple" | "menu" | "menuDessert";

export type TierPrices = {
  simple: number;
  menu: number;
  menuDessert: number;
};

export type MenuItem = {
  id: string;
  nameFr: string;
  nameEn: string;
  category: MenuCategoryId;
  prices: TierPrices;
  noteFr?: string;
  noteEn?: string;
  descriptionFr?: string;
  descriptionEn?: string;
  configurable?: boolean;
  image?: string;
  featured?: boolean;
};

export type TacoSize = {
  id: "S" | "M" | "L" | "XL";
  meats: number;
  wraps: number;
  prices: TierPrices;
};

export type SizedItem = {
  id: string;
  nameFr: string;
  nameEn: string;
  sizes: { label: string; price: number; noteFr?: string; noteEn?: string }[];
};

export type SimplePricedItem = {
  id: string;
  nameFr: string;
  nameEn: string;
  price: number;
  noteFr?: string;
  noteEn?: string;
  variants?: { labelFr: string; labelEn: string; price: number }[];
};

export type DrinkItem = {
  id: string;
  nameFr: string;
  nameEn: string;
  group: "beer" | "wine" | "soft" | "hot";
  variants: { label: string; price: number }[];
};

export type Extra = {
  id: string;
  nameFr: string;
  nameEn: string;
  price: number;
  contexts: ("sandwich" | "tacos" | "bowl" | "lahmacun")[];
};

export type MenuCategoryId =
  | "sandwiches"
  | "durums"
  | "assiettes"
  | "salades"
  | "bowls"
  | "burgers"
  | "tacos"
  | "barquettes"
  | "enfant"
  | "desserts"
  | "boissons";

export const MENU_CATEGORIES: {
  id: MenuCategoryId;
  nameFr: string;
  nameEn: string;
}[] = [
  { id: "sandwiches", nameFr: "Sandwichs", nameEn: "Sandwiches" },
  { id: "durums", nameFr: "Nos durums", nameEn: "Durums" },
  { id: "tacos", nameFr: "Nos tacos", nameEn: "Tacos" },
  { id: "burgers", nameFr: "Nos burgers", nameEn: "Burgers" },
  { id: "assiettes", nameFr: "Les assiettes", nameEn: "Plates" },
  { id: "bowls", nameFr: "Les bowls", nameEn: "Bowls" },
  { id: "salades", nameFr: "Salades", nameEn: "Salads" },
  { id: "barquettes", nameFr: "Barquettes", nameEn: "Sides" },
  { id: "enfant", nameFr: "Menu enfant", nameEn: "Kids menu" },
  { id: "desserts", nameFr: "Les desserts", nameEn: "Desserts" },
  { id: "boissons", nameFr: "Boissons", nameEn: "Drinks" },
];

export const MEATS = [
  { id: "kebab", nameFr: "Kebab", nameEn: "Kebab" },
  { id: "steak", nameFr: "Steak", nameEn: "Steak" },
  { id: "poulet", nameFr: "Poulet", nameEn: "Chicken" },
  { id: "cordon-bleu", nameFr: "Cordon bleu", nameEn: "Cordon bleu" },
  { id: "kofte", nameFr: "Köfte", nameEn: "Köfte" },
  { id: "sucuk", nameFr: "Sucuk", nameEn: "Sucuk" },
  { id: "merguez", nameFr: "Merguez", nameEn: "Merguez" },
  { id: "tenders", nameFr: "Tenders", nameEn: "Tenders" },
  { id: "nuggets", nameFr: "Nuggets", nameEn: "Nuggets" },
  { id: "mexicain", nameFr: "Mexicain", nameEn: "Mexican" },
  { id: "adana", nameFr: "Adana", nameEn: "Adana" },
] as const;

export const SAUCES = [
  { id: "mayonnaise", nameFr: "Mayonnaise", nameEn: "Mayonnaise" },
  { id: "ketchup", nameFr: "Ketchup", nameEn: "Ketchup" },
  { id: "blanche", nameFr: "Blanche", nameEn: "White sauce" },
  { id: "biggy", nameFr: "Biggy", nameEn: "Biggy" },
  { id: "curry", nameFr: "Curry", nameEn: "Curry" },
  { id: "barbecue", nameFr: "Barbecue", nameEn: "Barbecue" },
  { id: "andalouse", nameFr: "Andalouse", nameEn: "Andalouse" },
  { id: "harissa", nameFr: "Harissa", nameEn: "Harissa" },
  { id: "algerienne", nameFr: "Algérienne", nameEn: "Algerian" },
  { id: "samourai", nameFr: "Samouraï", nameEn: "Samurai" },
  { id: "moutarde", nameFr: "Moutarde", nameEn: "Mustard" },
] as const;

export const EXTRAS: Extra[] = [
  {
    id: "viande",
    nameFr: "Viande",
    nameEn: "Meat",
    price: 3.5,
    contexts: ["sandwich", "tacos"],
  },
  {
    id: "viande-bowl",
    nameFr: "Supplément viande",
    nameEn: "Extra meat",
    price: 2,
    contexts: ["bowl"],
  },
  {
    id: "feta",
    nameFr: "Fêta",
    nameEn: "Feta",
    price: 1,
    contexts: ["sandwich"],
  },
  {
    id: "feta-tacos",
    nameFr: "Fêta",
    nameEn: "Feta",
    price: 2,
    contexts: ["tacos"],
  },
  {
    id: "mozza",
    nameFr: "Mozza",
    nameEn: "Mozzarella",
    price: 2,
    contexts: ["sandwich", "tacos"],
  },
  {
    id: "cheddar",
    nameFr: "Cheddar",
    nameEn: "Cheddar",
    price: 1,
    contexts: ["sandwich", "tacos"],
  },
  {
    id: "oeuf",
    nameFr: "Œuf",
    nameEn: "Egg",
    price: 1.5,
    contexts: ["sandwich"],
  },
  {
    id: "oeuf-tacos",
    nameFr: "Œuf",
    nameEn: "Egg",
    price: 1.5,
    contexts: ["tacos"],
  },
  {
    id: "frites",
    nameFr: "Frites",
    nameEn: "Fries",
    price: 2,
    contexts: ["sandwich"],
  },
  {
    id: "lahmacun-viande",
    nameFr: "Viande (Lahmacun)",
    nameEn: "Meat (Lahmacun)",
    price: 1,
    contexts: ["lahmacun"],
  },
];

export const TACO_SIZES: TacoSize[] = [
  {
    id: "S",
    meats: 1,
    wraps: 1,
    prices: { simple: 8, menu: 11, menuDessert: 14 },
  },
  {
    id: "M",
    meats: 2,
    wraps: 1,
    prices: { simple: 10, menu: 13, menuDessert: 16 },
  },
  {
    id: "L",
    meats: 3,
    wraps: 2,
    prices: { simple: 14, menu: 17, menuDessert: 20 },
  },
  {
    id: "XL",
    meats: 4,
    wraps: 2,
    prices: { simple: 16, menu: 19, menuDessert: 22 },
  },
];

const IMG = {
  kebab:
    "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=1200&q=80",
  durum:
    "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=1200&q=80",
  plate:
    "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=1200&q=80",
  burger:
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80",
  tacos:
    "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1200&q=80",
  bowl:
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80",
  salad:
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
  dessert:
    "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=1200&q=80",
  fries:
    "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=1200&q=80",
  drink:
    "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=1200&q=80",
  kids:
    "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80",
  panini:
    "https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=1200&q=80",
};

export const SANDWICHES: MenuItem[] = [
  {
    id: "kebab",
    nameFr: "Kebab",
    nameEn: "Kebab",
    category: "sandwiches",
    prices: { simple: 7, menu: 10, menuDessert: 13 },
    configurable: true,
    featured: true,
    image: IMG.kebab,
  },
  {
    id: "maxi-kebab",
    nameFr: "Maxi Kebab",
    nameEn: "Maxi Kebab",
    category: "sandwiches",
    prices: { simple: 11, menu: 14, menuDessert: 17 },
    configurable: true,
    image: IMG.kebab,
  },
  {
    id: "mini-kebab",
    nameFr: "Mini Kebab",
    nameEn: "Mini Kebab",
    category: "sandwiches",
    prices: { simple: 5.5, menu: 8.5, menuDessert: 11.5 },
    configurable: true,
    image: IMG.kebab,
  },
  {
    id: "americain",
    nameFr: "Américain",
    nameEn: "Américain",
    category: "sandwiches",
    prices: { simple: 6.5, menu: 9.5, menuDessert: 12.5 },
    noteFr: "Servi avec frites & steak",
    noteEn: "Served with fries & steak",
    configurable: true,
    image: IMG.kebab,
  },
  {
    id: "maxi-americain",
    nameFr: "Maxi Américain",
    nameEn: "Maxi Américain",
    category: "sandwiches",
    prices: { simple: 11.5, menu: 13, menuDessert: 16 },
    configurable: true,
    image: IMG.kebab,
  },
  {
    id: "poulet",
    nameFr: "Poulet",
    nameEn: "Chicken",
    category: "sandwiches",
    prices: { simple: 7.5, menu: 10.5, menuDessert: 13.5 },
    descriptionFr: "Sandwich à base de poulet grillé, crudités et sauce au choix",
    descriptionEn: "Grilled chicken sandwich with salad and sauce of your choice",
    configurable: true,
    image: IMG.kebab,
  },
  {
    id: "mexicain",
    nameFr: "Mexicain",
    nameEn: "Mexican",
    category: "sandwiches",
    prices: { simple: 7.5, menu: 10.5, menuDessert: 13.5 },
    descriptionFr: "Viande épicée façon mexicaine, crudités et sauce au choix",
    descriptionEn: "Spicy Mexican-style meat, salad and sauce of your choice",
    configurable: true,
    image: IMG.kebab,
  },
  {
    id: "kofte-s",
    nameFr: "Köfte",
    nameEn: "Köfte",
    category: "sandwiches",
    prices: { simple: 7.5, menu: 10.5, menuDessert: 13.5 },
    descriptionFr: "Boulettes de viande turques (köfte), crudités et sauce au choix",
    descriptionEn: "Turkish meatballs (köfte), salad and sauce of your choice",
    configurable: true,
    image: IMG.kebab,
  },
  {
    id: "merguez-s",
    nameFr: "Merguez",
    nameEn: "Merguez",
    category: "sandwiches",
    prices: { simple: 7.5, menu: 10.5, menuDessert: 13.5 },
    descriptionFr: "Merguez grillées, crudités et sauce au choix",
    descriptionEn: "Grilled merguez sausages, salad and sauce of your choice",
    configurable: true,
    image: IMG.kebab,
  },
  {
    id: "sucuk-s",
    nameFr: "Sucuk",
    nameEn: "Sucuk",
    category: "sandwiches",
    prices: { simple: 7, menu: 10, menuDessert: 13 },
    configurable: true,
    image: IMG.kebab,
  },
  {
    id: "adana-s",
    nameFr: "Adana",
    nameEn: "Adana",
    category: "sandwiches",
    prices: { simple: 8.5, menu: 11.5, menuDessert: 14.5 },
    configurable: true,
    image: IMG.kebab,
  },
  {
    id: "panini",
    nameFr: "Panini",
    nameEn: "Panini",
    category: "sandwiches",
    prices: { simple: 7.5, menu: 10.5, menuDessert: 13.5 },
    noteFr: "Viande au choix : kebab, poulet ou steak haché",
    noteEn: "Choice of meat: kebab, chicken or beef patty",
    configurable: true,
    image: IMG.panini,
  },
];

export const DURUMS: MenuItem[] = [
  {
    id: "durum-kebab",
    nameFr: "Durum Kebab",
    nameEn: "Durum Kebab",
    category: "durums",
    prices: { simple: 8, menu: 11, menuDessert: 14 },
    configurable: true,
    featured: true,
    image: IMG.durum,
  },
  {
    id: "max-durum-kebab",
    nameFr: "Max Durum Kebab",
    nameEn: "Max Durum Kebab",
    category: "durums",
    prices: { simple: 12, menu: 15, menuDessert: 18 },
    configurable: true,
    image: IMG.durum,
  },
  {
    id: "durum-steak",
    nameFr: "Durum Steak",
    nameEn: "Durum Steak",
    category: "durums",
    prices: { simple: 7, menu: 10, menuDessert: 13 },
    configurable: true,
    image: IMG.durum,
  },
  {
    id: "pizza-lahmacun",
    nameFr: "Pizza Lahmacun",
    nameEn: "Lahmacun Pizza",
    category: "durums",
    prices: { simple: 8, menu: 11, menuDessert: 14 },
    noteFr: "+ avec viande : 1,00€",
    noteEn: "+ with meat: €1.00",
    configurable: true,
    image: IMG.durum,
  },
  {
    id: "durum-kofte",
    nameFr: "Durum Köfte",
    nameEn: "Durum Köfte",
    category: "durums",
    prices: { simple: 8, menu: 11, menuDessert: 14 },
    configurable: true,
    image: IMG.durum,
  },
  {
    id: "durum-adana",
    nameFr: "Durum Adana",
    nameEn: "Durum Adana",
    category: "durums",
    prices: { simple: 9, menu: 12, menuDessert: 15 },
    configurable: true,
    image: IMG.durum,
  },
  {
    id: "durum-nugget",
    nameFr: "Durum Nugget",
    nameEn: "Durum Nugget",
    category: "durums",
    prices: { simple: 7, menu: 10, menuDessert: 13 },
    configurable: true,
    image: IMG.durum,
  },
  {
    id: "durum-sucuk",
    nameFr: "Durum Sucuk",
    nameEn: "Durum Sucuk",
    category: "durums",
    prices: { simple: 7, menu: 10, menuDessert: 13 },
    configurable: true,
    image: IMG.durum,
  },
];

const ASSIETTE_COMMON: TierPrices = {
  simple: 12,
  menu: 13.5,
  menuDessert: 16.5,
};

export const ASSIETTES: MenuItem[] = [
  "kebab",
  "sucuk",
  "nuggets",
  "kofte",
  "cheese",
  "cordon-bleu",
  "adana",
  "pizza-kebab",
  "mexicain",
  "tenders",
].map((slug) => {
  const labels: Record<string, { fr: string; en: string }> = {
    kebab: { fr: "Assiette Kebab", en: "Kebab Plate" },
    sucuk: { fr: "Assiette Sucuk", en: "Sucuk Plate" },
    nuggets: { fr: "Assiette Nuggets", en: "Nuggets Plate" },
    kofte: { fr: "Assiette Köfte", en: "Köfte Plate" },
    cheese: { fr: "Assiette Cheese", en: "Cheese Plate" },
    "cordon-bleu": { fr: "Assiette Cordon bleu", en: "Cordon bleu Plate" },
    adana: { fr: "Assiette Adana", en: "Adana Plate" },
    "pizza-kebab": { fr: "Assiette Pizza kebab", en: "Pizza kebab Plate" },
    mexicain: { fr: "Assiette Mexicain", en: "Mexican Plate" },
    tenders: { fr: "Assiette Tenders", en: "Tenders Plate" },
  };
  return {
    id: `assiette-${slug}`,
    nameFr: labels[slug].fr,
    nameEn: labels[slug].en,
    category: "assiettes" as const,
    prices: ASSIETTE_COMMON,
    configurable: true,
    featured: slug === "kebab",
    image: IMG.plate,
  };
});

ASSIETTES.push(
  {
    id: "assiette-steak",
    nameFr: "Assiette Steak",
    nameEn: "Steak Plate",
    category: "assiettes",
    prices: { simple: 11, menu: 12.5, menuDessert: 15.5 },
    configurable: true,
    image: IMG.plate,
  },
  {
    id: "assiette-medya",
    nameFr: "Assiette Medya",
    nameEn: "Medya Plate",
    category: "assiettes",
    prices: { simple: 15, menu: 16.5, menuDessert: 19.5 },
    noteFr: "Mixte de viandes",
    noteEn: "Mixed meats",
    configurable: true,
    featured: true,
    image: IMG.plate,
  },
);

export const SALADES: MenuItem[] = [
  {
    id: "salade-maison",
    nameFr: "Salade maison",
    nameEn: "House salad",
    category: "salades",
    prices: { simple: 10, menu: 11.5, menuDessert: 14.5 },
    noteFr: "Normale 10,00€ / Poulet ou tenders 11,00€",
    noteEn: "Classic €10.00 / Chicken or tenders €11.00",
    configurable: true,
    image: IMG.salad,
  },
];

export const BOWLS: MenuItem[] = [
  "kebab",
  "steak",
  "cordon-bleu",
  "tenders",
  "nuggets",
].map((slug) => {
  const labels: Record<string, { fr: string; en: string }> = {
    kebab: { fr: "Bowl Kebab", en: "Kebab Bowl" },
    steak: { fr: "Bowl Steak", en: "Steak Bowl" },
    "cordon-bleu": { fr: "Bowl Cordon bleu", en: "Cordon bleu Bowl" },
    tenders: { fr: "Bowl Tenders", en: "Tenders Bowl" },
    nuggets: { fr: "Bowl Nuggets", en: "Nuggets Bowl" },
  };
  return {
    id: `bowl-${slug}`,
    nameFr: labels[slug].fr,
    nameEn: labels[slug].en,
    category: "bowls" as const,
    prices: { simple: 10, menu: 11.5, menuDessert: 14.5 },
    noteFr: "Supplément viande : +2,00€",
    noteEn: "Extra meat: +€2.00",
    configurable: true,
    image: IMG.bowl,
  };
});

export const BURGERS: MenuItem[] = [
  {
    id: "burger-classique",
    nameFr: "Burger classique",
    nameEn: "Classic burger",
    category: "burgers",
    prices: { simple: 6.5, menu: 9.5, menuDessert: 12.5 },
    descriptionFr: "Steak, tomate, salade verte, oignon, sauce à composer",
    descriptionEn: "Steak, tomato, lettuce, onion, sauce of your choice",
    configurable: true,
    image: IMG.burger,
  },
  {
    id: "burger-medya",
    nameFr: "Burger Medya",
    nameEn: "Medya burger",
    category: "burgers",
    prices: { simple: 11, menu: 14, menuDessert: 17 },
    descriptionFr:
      "Steak double, œuf, cheddar double, salade verte, oignon, tomate, sauce à composer",
    descriptionEn:
      "Double steak, egg, double cheddar, lettuce, onion, tomato, sauce of your choice",
    configurable: true,
    featured: true,
    image: IMG.burger,
  },
  {
    id: "burger-cheese",
    nameFr: "Burger cheese",
    nameEn: "Cheese burger",
    category: "burgers",
    prices: { simple: 7, menu: 10, menuDessert: 13 },
    descriptionFr: "Steak, cheddar, salade verte, tomate, oignon, sauce à composer",
    descriptionEn: "Steak, cheddar, lettuce, tomato, onion, sauce of your choice",
    configurable: true,
    image: IMG.burger,
  },
  {
    id: "burger-fish",
    nameFr: "Burger fish",
    nameEn: "Fish burger",
    category: "burgers",
    prices: { simple: 6.5, menu: 9.5, menuDessert: 12.5 },
    descriptionFr:
      "Poisson pané, cheddar, salade verte, tomate, oignon, sauce à composer",
    descriptionEn:
      "Breaded fish, cheddar, lettuce, tomato, onion, sauce of your choice",
    configurable: true,
    image: IMG.burger,
  },
];

export const BARQUETTES: SizedItem[] = [
  {
    id: "barquette-frites",
    nameFr: "Frites",
    nameEn: "Fries",
    sizes: [
      { label: "S", price: 3 },
      { label: "M", price: 4 },
      { label: "L", price: 5.5 },
    ],
  },
  {
    id: "barquette-kebab",
    nameFr: "Kebab",
    nameEn: "Kebab",
    sizes: [
      { label: "S", price: 7 },
      { label: "M", price: 10 },
      { label: "L", price: 13.5 },
    ],
  },
  {
    id: "barquette-tenders",
    nameFr: "Tenders",
    nameEn: "Tenders",
    sizes: [
      { label: "S", price: 7, noteFr: "x4", noteEn: "x4" },
      { label: "M", price: 9.5, noteFr: "x6", noteEn: "x6" },
      { label: "L", price: 13, noteFr: "x9", noteEn: "x9" },
    ],
  },
  {
    id: "barquette-nuggets",
    nameFr: "Nuggets",
    nameEn: "Nuggets",
    sizes: [
      { label: "S", price: 6, noteFr: "x6", noteEn: "x6" },
      { label: "M", price: 9, noteFr: "x9", noteEn: "x9" },
      { label: "L", price: 12, noteFr: "x12", noteEn: "x12" },
    ],
  },
  {
    id: "barquette-chou",
    nameFr: "Chou rouge",
    nameEn: "Red cabbage",
    sizes: [
      { label: "S", price: 3 },
      { label: "M", price: 4 },
    ],
  },
];

export const MENU_ENFANT: SimplePricedItem = {
  id: "menu-enfant",
  nameFr: "Menu enfant",
  nameEn: "Kids menu",
  price: 7.5,
  noteFr: "Menu fille/garçon — viande au choix : nuggets, kebab ou tenders",
  noteEn: "Girl/boy menu — choice of meat: nuggets, kebab or tenders",
};

export const DESSERTS: SimplePricedItem[] = [
  {
    id: "baklavas",
    nameFr: "Baklavas",
    nameEn: "Baklava",
    price: 4,
    noteFr: "4 pièces",
    noteEn: "4 pieces",
  },
  {
    id: "lokoums",
    nameFr: "Lokoums",
    nameEn: "Turkish delight",
    price: 4,
    noteFr: "7 pièces",
    noteEn: "7 pieces",
  },
  { id: "tiramisu", nameFr: "Tiramisu", nameEn: "Tiramisu", price: 4 },
  {
    id: "tarte-daims",
    nameFr: "Tarte aux daims",
    nameEn: "Daim tart",
    price: 4,
  },
];

export const MISC: SimplePricedItem[] = [
  { id: "cornet-glace", nameFr: "Cornet glace", nameEn: "Ice cream cone", price: 2 },
  { id: "the-nature", nameFr: "Thé nature", nameEn: "Plain tea", price: 2.5 },
  { id: "cafe", nameFr: "Café", nameEn: "Coffee", price: 2 },
];

export const DRINKS: DrinkItem[] = [
  {
    id: "kronenbourg",
    nameFr: "Kronenbourg",
    nameEn: "Kronenbourg",
    group: "beer",
    variants: [
      { label: "25cl", price: 2.5 },
      { label: "50cl", price: 3 },
    ],
  },
  {
    id: "heineken",
    nameFr: "Heineken",
    nameEn: "Heineken",
    group: "beer",
    variants: [
      { label: "25cl", price: 2.5 },
      { label: "50cl", price: 3.5 },
    ],
  },
  {
    id: "1664",
    nameFr: "1664",
    nameEn: "1664",
    group: "beer",
    variants: [{ label: "25cl", price: 2.5 }],
  },
  {
    id: "brauperle",
    nameFr: "Brauperle 8.0",
    nameEn: "Brauperle 8.0",
    group: "beer",
    variants: [{ label: "50cl", price: 3 }],
  },
  {
    id: "86",
    nameFr: "8.6",
    nameEn: "8.6",
    group: "beer",
    variants: [{ label: "50cl", price: 3.5 }],
  },
  {
    id: "smirnoff-biere",
    nameFr: "Smirnoff Bière",
    nameEn: "Smirnoff Beer",
    group: "beer",
    variants: [{ label: "70cl", price: 6.5 }],
  },
  {
    id: "desperados",
    nameFr: "Desperados",
    nameEn: "Desperados",
    group: "beer",
    variants: [
      { label: "33cl", price: 3.5 },
      { label: "65cl", price: 6 },
    ],
  },
  {
    id: "vin-rouge",
    nameFr: "Vin rouge",
    nameEn: "Red wine",
    group: "wine",
    variants: [
      { label: "12cl", price: 4 },
      { label: "37cl", price: 7 },
      { label: "75cl", price: 12 },
    ],
  },
  {
    id: "vin-rose",
    nameFr: "Vin rosé",
    nameEn: "Rosé wine",
    group: "wine",
    variants: [
      { label: "12cl", price: 4 },
      { label: "37cl", price: 7 },
      { label: "75cl", price: 12 },
    ],
  },
  {
    id: "boisson-33",
    nameFr: "Boisson 33cl",
    nameEn: "Soft drink 33cl",
    group: "soft",
    variants: [{ label: "33cl", price: 2 }],
  },
  {
    id: "cristaline",
    nameFr: "Cristaline",
    nameEn: "Cristaline",
    group: "soft",
    variants: [{ label: "50cl", price: 1.5 }],
  },
  {
    id: "red-bull",
    nameFr: "Red Bull",
    nameEn: "Red Bull",
    group: "soft",
    variants: [{ label: "25cl", price: 2.5 }],
  },
  {
    id: "coca-125",
    nameFr: "Coca-Cola",
    nameEn: "Coca-Cola",
    group: "soft",
    variants: [{ label: "1,25L", price: 3.5 }],
  },
  {
    id: "fanta-125",
    nameFr: "Fanta",
    nameEn: "Fanta",
    group: "soft",
    variants: [{ label: "1,25L", price: 4 }],
  },
  {
    id: "oasis-2l",
    nameFr: "Oasis",
    nameEn: "Oasis",
    group: "soft",
    variants: [{ label: "2,00L", price: 5 }],
  },
  {
    id: "ice-tea-125",
    nameFr: "Ice Tea",
    nameEn: "Ice Tea",
    group: "soft",
    variants: [{ label: "1,25L", price: 4 }],
  },
];

export const ALL_TIER_ITEMS: MenuItem[] = [
  ...SANDWICHES,
  ...DURUMS,
  ...ASSIETTES,
  ...SALADES,
  ...BOWLS,
  ...BURGERS,
];

export const FEATURED_ITEMS = ALL_TIER_ITEMS.filter((i) => i.featured);

export const HERO_IMAGE = IMG.kebab;
export const MENU_IMAGES = IMG;

export function getItemById(id: string): MenuItem | undefined {
  return ALL_TIER_ITEMS.find((i) => i.id === id);
}

export function formatPrice(value: number, locale: "fr" | "en" = "fr"): string {
  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}
