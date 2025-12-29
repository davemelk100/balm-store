// Stripe Configuration

// Get environment variables with fallbacks
const isDevelopment = import.meta.env.MODE === "development";

// Stripe Publishable Keys
export const STRIPE_PUBLISHABLE_KEY = isDevelopment
  ? import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY_TEST ||
    "pk_test_51SfaUuFKiaEr26Zc7BOy7iWmDZTlbxR8P4MU48q7SNhPAZo8JS84jtUYihIJgFGGzL4GTrgdCA6Shp6UbBAH3Ofs00paxt1Glz"
  : import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY_LIVE ||
    "pk_test_51SfaUuFKiaEr26Zc7BOy7iWmDZTlbxR8P4MU48q7SNhPAZo8JS84jtUYihIJgFGGzL4GTrgdCA6Shp6UbBAH3Ofs00paxt1Glz";

// Stripe Buy Button IDs per product
// Map product IDs to their corresponding Stripe Buy Button IDs
export const STRIPE_BUY_BUTTON_IDS: Record<string, string> = {
  "balm-shirt-2": "buy_btn_1SjUfNFKiaEr26ZcXyKu3pwe", // BALM Cursive Button-Up
  // Add more products here as you create them in Stripe
  // "product-id": "buy_btn_xxx",
};

// Get Stripe Buy Button ID for a product
export const getStripeBuyButtonId = (productId: string): string | null => {
  return STRIPE_BUY_BUTTON_IDS[productId] || null;
};

// Default buy button ID (fallback)
export const DEFAULT_BUY_BUTTON_ID = "buy_btn_1SjUfNFKiaEr26ZcXyKu3pwe";

// Stripe API Version
export const STRIPE_API_VERSION = "2023-10-16";

// Configuration check
export const isStripeConfigured = (): boolean => {
  return !!STRIPE_PUBLISHABLE_KEY && STRIPE_PUBLISHABLE_KEY.startsWith("pk_");
};
