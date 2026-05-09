// Store Types - Centralized type definitions for the store module

export interface Show {
  // ISO date (YYYY-MM-DD). Used for sorting and to filter past shows.
  date: string;
  venue: string;
  city: string;
  ticketUrl?: string;
}

export interface Release {
  // ISO date (YYYY-MM-DD). Drives sort order.
  date: string;
  // Optional display override — use when the release date is approximate
  // (e.g. "Fall 2026") rather than a known day.
  dateLabel?: string;
  title: string;
  // E.g. "LP", "EP", "Single".
  type: string;
  url?: string;
}

export interface Artist {
  slug: string;
  name: string;
  image: string;
  bio?: string;
  websiteUrl?: string;
  bandcampUrl?: string;
  spotifyUrl?: string;
  paypalUrl?: string;
  venmoUrl?: string;
  shows?: Show[];
  releases?: Release[];
}

export interface Product {
  id: string;
  stripeProductId?: string; // Stripe Product ID when fetched from Stripe
  // When set, the product belongs to a featured artist and is shown on
  // /artists/:slug rather than the main BALM grid.
  artistSlug?: string;
  // Direct payment links surfaced on the product page alongside Stripe
  // checkout. Used for artist merch where Stripe products may not exist
  // yet — buyers can pay via PayPal/Venmo directly.
  paypalUrl?: string;
  venmoUrl?: string;
  mainCategory: "art" | "music" | "sports" | "clothing";
  title: string;
  price: number;
  image: string;
  images?: string[]; // Optional array for multiple images
  description: string;
  fullDescription?: string;
  details?: string;
  sizeChart?: {
    sizes: string[];
    measurements: {
      [key: string]: {
        bodyLength: string;
        chestWidth: string;
        sleeveLength: string;
      };
    };
  };
  sizes?: string[];
  colors?: string[];
  // Inventory tracking per size
  inventory?: {
    [size: string]: number; // e.g., { "S": 10, "M": 15, "L": 20 }
  };
  // Stripe Integration
  stripePriceId?: string; // Stripe Price ID for checkout
  stripeBuyButtonId?: string; // Stripe Buy Button ID
  metadata?: Record<string, any>; // Stripe metadata
  // When set, the product is stream-only (no checkout); the product
  // detail page renders a "Stream" button that opens a modal with
  // links to the platforms below.
  streamUrl?: string;
  spotifyUrl?: string;
  bandcampUrl?: string;
  // Bandcamp <iframe> embed src — when set, the product page replaces the
  // image carousel with the embedded player.
  bandcampEmbedUrl?: string;
  // Optional override for the embed iframe height (px). Bandcamp's embed
  // markup ships a per-release height (e.g. 442 for tracks, 470 for albums).
  bandcampEmbedHeight?: number;
  // Track listing for albums / EPs / singles.
  tracks?: { title: string; duration: string }[];
}

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  description: string;
  quantity: number;
  size?: string; // Track which size was selected
}
