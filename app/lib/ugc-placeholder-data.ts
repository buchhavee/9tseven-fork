// app/lib/ugc-placeholder-data.ts
//
// Placeholder-data til "Shop the Look"-funktionen.
//
// Erstatter et Shopify metaobject (planlagte fields: person_name, person_tag,
// quote, ugc_image og products som product_reference liste).
// ugcLooks.ts læser herfra og henter hvert produkt via handle fra Storefront API.
// Når metaobjects er klar, er det kun ugcLooks.ts
// der skal opdateres. Komponenter forbliver uændrede.
//
// person, quote og imageSrc er UGC-felter der lever her indtil metaobjects
// eksisterer. Produkter refereres udelukkende via handle — al produktdata
// (titel, pris, billede, størrelser og varianter) hentes fra Shopify.
// Handles der ikke kan resolves droppes automatisk.

export interface UGCLook {
  id: string;
  person: {
    name: string;
    handle: string;
    tag: string; // e.g. "Social Run · Fælledparken"
  };
  quote: string;
  imageSrc: string;
  products: {
    handle: string;
  }[];
}

export const ugcLooks: UGCLook[] = [
  {
    id: "look-01",
    person: { name: "Julia S.", handle: "juliaseppanen", tag: "CASUAL RUN OUTFIT · DENMARK" },
    quote: "The jacket was perfect for the morning chill.",
    imageSrc: "/images/UGCCards/julia2.png",
    products: [
      { handle: "lightweight-running-jacket" }, // Lightweight Running Jacket
      { handle: "9tseven-race-shorts" }, // Race Shorts
      { handle: "perf-socks" }, // Performance Socks Black
    ],
  },
  {
    id: "look-02",
    person: { name: "Jun A.", handle: "junandersen", tag: "LIFESTYLE OUTFIT · ITALY" },
    quote: "BUILT FOR REPEATS — LIGHT, FAST, NO FUSS.",
    imageSrc: "/images/UGCCards/jun.png",
    products: [
      { handle: "performance-longsleeve-white" }, // Performance Longsleeve White
      { handle: "9tseven-race-shorts" }, // Race Shorts
      { handle: "performance-socks-white" }, // Performance Socks White
    ],
  },
  {
    id: "look-03",
    person: { name: "Rafa A.", handle: "rafaacunar", tag: "TRACK PRACTICE OUTFIT · DENMARK" },
    quote: "COMFORT THAT LASTS THE WHOLE 30K.",
    imageSrc: "/images/UGCCards/rafa.png",
    products: [
      { handle: "more-than-running-t-shirt" }, // More Than Running T-shirt
      { handle: "parachute-nylon-pants" }, // Parachute Nylon Pants
      { handle: "9tseven-water-bottle" }, // Water Bottle
    ],
  },
  {
    id: "look-04",
    person: { name: "Julia S.", handle: "juliaseppanen", tag: "CPH MARATHON 26 OUTFIT · DENMARK" },
    quote: "The jacket was perfect for the morning chill.",
    imageSrc: "/images/UGCCards/julia.jpg",
    products: [
      { handle: "lightweight-running-jacket" }, // Lightweight Running Jacket
      { handle: "9tseven-race-shorts" }, // Race Shorts
      { handle: "perf-socks" }, // Performance Socks Black
    ],
  },
];
