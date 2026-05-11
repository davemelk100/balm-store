import { Product } from "../types";

export const storeProducts: Product[] = [
  {
    id: "prod_URjiesOVeb9YC9",
    stripeProductId: "prod_URjiesOVeb9YC9",
    stripePriceId: "price_1TSqFYFCguwn0NjeS48GisoI",
    mainCategory: "clothing",
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
    id: "ftb-shirt",
    artistSlug: "full-time-bionic",
    mainCategory: "clothing",
    title: "Full Time Bionic Buttonup Screenprint",
    price: 25.0,
    image: "/img/products/ftb-shirt.png",
    images: ["/img/products/ftb-shirt.png"],
    // Same fabric / size chart / size + color options as the Balm
    // shirts; see the FTB-shirt-2 and ftb-shirt-3 entries below for
    // alternate prints. Stripe wiring intentionally omitted on all FTB
    // shirts until a real Stripe product/price exists for them — reusing
    // the Balm IDs would charge buyers for the wrong SKU.
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
  },
  {
    id: "ftb-shirt-2",
    artistSlug: "full-time-bionic",
    mainCategory: "clothing",
    title: "Full Time Bionic Buttonup Screenprint",
    price: 25.0,
    image: "/img/products/ftb-shirt-2.png",
    images: ["/img/products/ftb-shirt-2.png"],
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
  },
  {
    id: "ftb-shirt-3",
    artistSlug: "full-time-bionic",
    mainCategory: "clothing",
    title: "Full Time Bionic Buttonup Screenprint",
    price: 25.0,
    image: "/img/products/ftb-shirt-3.png",
    images: ["/img/products/ftb-shirt-3.png"],
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
  },
  {
    id: "balm-album-1",
    artistSlug: "balm",
    hideFromArtistPage: true,
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
    bandcampEmbedUrl:
      "https://bandcamp.com/EmbeddedPlayer/album=3360325143/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/",
    bandcampEmbedHeight: 470,
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
    id: "balm-album-2",
    artistSlug: "balm",
    hideFromArtistPage: true,
    mainCategory: "music",
    title: "Hallucination Season (Instrumental)",
    price: 0,
    image: "https://f4.bcbits.com/img/a2661713931_10.jpg",
    images: ["https://f4.bcbits.com/img/a2661713931_10.jpg"],
    description: "LP",
    details: "",
    streamUrl: "https://open.spotify.com/",
    spotifyUrl: "https://open.spotify.com/",
    bandcampUrl:
      "https://balmsoothes.bandcamp.com/album/hallucination-season-instrumental",
    bandcampEmbedUrl:
      "https://bandcamp.com/EmbeddedPlayer/album=2863685837/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/",
    bandcampEmbedHeight: 470,
    tracks: [
      {
        title: "I'm Just Hearing Of This Now (Instrumental)",
        duration: "02:12",
      },
      { title: "Vokey SM10 Raw (Instrumental)", duration: "04:40" },
      {
        title: "Eating Ourselves (We Are) Eating Ourselves (Instrumental)",
        duration: "03:24",
      },
      { title: "This Time, It's Jeremy (Instrumental)", duration: "02:00" },
      { title: "Beated (Instrumental)", duration: "01:55" },
      { title: "Well I'll Be A (Instrumental)", duration: "02:50" },
      { title: "On Sunday (Instrumental)", duration: "02:50" },
      { title: "Bevacqua (Instrumental)", duration: "01:24" },
      { title: "Cleansing Addict (Instrumental)", duration: "04:20" },
    ],
  },
  {
    id: "balm-single-1",
    artistSlug: "balm",
    hideFromArtistPage: true,
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
    bandcampEmbedUrl:
      "https://bandcamp.com/EmbeddedPlayer/track=4041168687/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/",
    bandcampEmbedHeight: 442,
  },
  {
    id: "balm-single-2",
    artistSlug: "balm",
    hideFromArtistPage: true,
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
    bandcampEmbedUrl:
      "https://bandcamp.com/EmbeddedPlayer/album=3165747959/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/",
    bandcampEmbedHeight: 470,
  },
  {
    id: "ftb-bait-moss",
    artistSlug: "full-time-bionic",
    hideFromArtistPage: true,
    mainCategory: "music",
    title: "Bait Moss",
    price: 0,
    image: "/img/products/ftb-stacked.png",
    images: ["/img/products/ftb-stacked.png"],
    description: "Single",
    details: "",
    streamUrl: "https://fulltimebionic.com/",
    bandcampUrl: "https://fulltimebionic.bandcamp.com/album/woodshed-studios-ep",
    bandcampEmbedUrl: "https://fulltimebionic.com/embed/bait-moss",
    bandcampEmbedWidth: 360,
    bandcampEmbedHeight: 470,
  },
  {
    id: "ftb-pill-choker",
    artistSlug: "full-time-bionic",
    hideFromArtistPage: true,
    mainCategory: "music",
    title: "Pill Choker",
    price: 0,
    image: "/img/products/ftb-stacked.png",
    images: ["/img/products/ftb-stacked.png"],
    description: "Single",
    details: "",
    streamUrl: "https://fulltimebionic.com/",
    bandcampUrl: "https://fulltimebionic.bandcamp.com/album/woodshed-studios-ep",
    bandcampEmbedUrl: "https://fulltimebionic.com/embed/pill-choker",
    bandcampEmbedWidth: 360,
    bandcampEmbedHeight: 470,
  },
  {
    id: "ftb-praise-your-brotherman",
    artistSlug: "full-time-bionic",
    hideFromArtistPage: true,
    mainCategory: "music",
    title: "Praise Your Brotherman",
    price: 0,
    image: "/img/products/ftb-stacked.png",
    images: ["/img/products/ftb-stacked.png"],
    description: "Single",
    details: "",
    streamUrl: "https://fulltimebionic.com/",
    bandcampUrl: "https://fulltimebionic.bandcamp.com/album/woodshed-studios-ep",
    bandcampEmbedUrl: "https://fulltimebionic.com/embed/praise-your-brotherman",
    bandcampEmbedWidth: 360,
    bandcampEmbedHeight: 470,
  },
];
