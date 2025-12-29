// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

export const API_ENDPOINTS = {
  // Auth
  login: `${API_BASE_URL}/api/auth/login`,
  register: `${API_BASE_URL}/api/auth/register`,
  session: `${API_BASE_URL}/api/auth/session`,
} as const;

// Note: Products are now fetched from Stripe via Netlify functions
// Use: /.netlify/functions/get-products
