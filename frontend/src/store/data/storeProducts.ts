import { Product } from "../types";

export const storeProducts: Product[] = [
  {
    id: "prod_URjiesOVeb9YC9",
    stripeProductId: "prod_URjiesOVeb9YC9",
    stripePriceId: "price_1TSqFYFCguwn0NjeS48GisoI",
    mainCategory: "art",
    title: "Buttonup Screenprint Cursive",
    price: 25.0,
    image: "/img/products/balm-cursive.png",
    images: ["/img/products/balm-cursive.png"],
    description: "",
    details: `2.9 oz./yd² (US), 4.8 oz./L yd (CA), 100% polyester
Mechanical stretch two-tone mélange fabric
Moisture-wicking performance
Hidden button-down collar
Double-needle flat-felled side and underarm seams
Tailored adjustable cuffs with buttoned sleeve plackets
Back yoke with side pleats`,
    sizeChart: {
      sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
      measurements: {
        S: {
          bodyLength: "27 1/2",
          chestWidth: "21 1/2",
          sleeveLength: "34",
        },
        M: {
          bodyLength: "28 1/2",
          chestWidth: "23",
          sleeveLength: "35",
        },
        L: {
          bodyLength: "29 1/2",
          chestWidth: "24 1/2",
          sleeveLength: "36",
        },
        XL: {
          bodyLength: "30 1/2",
          chestWidth: "26",
          sleeveLength: "37",
        },
        "2XL": {
          bodyLength: "31",
          chestWidth: "27 1/2",
          sleeveLength: "38",
        },
        "3XL": {
          bodyLength: "31 1/2",
          chestWidth: "29",
          sleeveLength: "38 3/4",
        },
      },
    },
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    // Inventory intentionally omitted here — stock comes live from Stripe
    // metadata via /api/products. If that fetch fails, sizes are treated
    // as unavailable rather than risking stale numbers.
    colors: ["Black", "White", "Navy"],
    // Stripe Integration
    stripeBuyButtonId: "buy_btn_1SjUfNFKiaEr26ZcXyKu3pwe",
  },
  {
    id: "prod_URjiesOVeb9YC9-v2",
    stripeProductId: "prod_URjiesOVeb9YC9",
    stripePriceId: "price_1TSqFYFCguwn0NjeS48GisoI",
    mainCategory: "art",
    title: "Buttonup Screenprint Cursive (v2)",
    price: 25.0,
    image: "/img/products/balm-new.png",
    images: ["/img/products/balm-new.png"],
    description: "",
    details: `2.9 oz./yd² (US), 4.8 oz./L yd (CA), 100% polyester
Mechanical stretch two-tone mélange fabric
Moisture-wicking performance
Hidden button-down collar
Double-needle flat-felled side and underarm seams
Tailored adjustable cuffs with buttoned sleeve plackets
Back yoke with side pleats`,
    sizeChart: {
      sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
      measurements: {
        S: { bodyLength: "27 1/2", chestWidth: "21 1/2", sleeveLength: "34" },
        M: { bodyLength: "28 1/2", chestWidth: "23", sleeveLength: "35" },
        L: { bodyLength: "29 1/2", chestWidth: "24 1/2", sleeveLength: "36" },
        XL: { bodyLength: "30 1/2", chestWidth: "26", sleeveLength: "37" },
        "2XL": { bodyLength: "31", chestWidth: "27 1/2", sleeveLength: "38" },
        "3XL": {
          bodyLength: "31 1/2",
          chestWidth: "29",
          sleeveLength: "38 3/4",
        },
      },
    },
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    colors: ["Black", "White", "Navy"],
    stripeBuyButtonId: "buy_btn_1SjUfNFKiaEr26ZcXyKu3pwe",
  },
  {
    id: "balm-album-1",
    mainCategory: "music",
    title: "Hallucination Season",
    price: 0,
    image: "https://f4.bcbits.com/img/a0814571548_10.jpg",
    images: ["https://f4.bcbits.com/img/a0814571548_10.jpg"],
    description: "LP",
    details: "",
    // Stream-only — no checkout, no inventory, no sizes.
    streamUrl: "https://open.spotify.com/",
    spotifyUrl: "https://open.spotify.com/",
    bandcampUrl:
      "https://balmsoothes.bandcamp.com/album/hallucination-season-2",
    tracks: [
      { title: "I'm Just Hearing Of This Now", duration: "02:12" },
      { title: "Vokey SM10 Raw", duration: "04:36" },
      {
        title: "Eating Ourselves (We Are) Eating Ourselves",
        duration: "03:24",
      },
      { title: "This Time, It's Jeremy", duration: "02:00" },
      { title: "Beated", duration: "01:55" },
      { title: "Well I'll Be A", duration: "02:29" },
      { title: "On Sunday", duration: "02:48" },
      { title: "Bevacqua", duration: "02:17" },
      { title: "Cleansing Addict", duration: "02:23" },
    ],
  },
  {
    id: "balm-single-1",
    mainCategory: "music",
    title: "Horseless Miscarriage",
    price: 0,
    image: "https://f4.bcbits.com/img/a2978603035_10.jpg",
    images: ["https://f4.bcbits.com/img/a2978603035_10.jpg"],
    description: "Single",
    details: "",
    streamUrl: "https://open.spotify.com/",
    spotifyUrl: "https://open.spotify.com/",
    bandcampUrl:
      "https://balmsoothes.bandcamp.com/track/horseless-miscarriage",
  },
  {
    id: "balm-single-2",
    mainCategory: "music",
    title: "Egyptian Shumbah",
    price: 0,
    image: "https://f4.bcbits.com/img/a0791764957_10.jpg",
    images: ["https://f4.bcbits.com/img/a0791764957_10.jpg"],
    description: "Single",
    details: "",
    streamUrl: "https://open.spotify.com/",
    spotifyUrl: "https://open.spotify.com/",
    bandcampUrl:
      "https://balmsoothes.bandcamp.com/album/egyptian-shumbah-the-tammys",
  },
];
