// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE || "http://localhost:8000";

export const API_ENDPOINTS = {
  // Auth
  login: `${API_BASE_URL}/api/auth/login`,
  register: `${API_BASE_URL}/api/auth/register`,
  session: `${API_BASE_URL}/api/auth/session`,
  // Products
  products: `${API_BASE_URL}/api/products`,
  // Checkout
  createCheckoutSession: `${API_BASE_URL}/api/checkout/session`,
} as const;
