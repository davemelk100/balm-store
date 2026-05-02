// API Configuration
// In dev (Vite serves the SPA on a different port from FastAPI) we point at
// localhost:8000. In prod (FastAPI serves both the SPA and the API on the same
// origin), default to "" so requests stay same-origin.
const defaultBase = import.meta.env.DEV ? "http://localhost:8000" : "";
export const API_BASE_URL = import.meta.env.VITE_API_BASE ?? defaultBase;

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
