// Store Types - Centralized type definitions for the store module

export interface Product {
  id: string;
  stripeProductId?: string; // Stripe Product ID when fetched from Stripe
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
