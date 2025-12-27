// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

export const API_ENDPOINTS = {
  // Products
  products: `${API_BASE_URL}/api/products`,
  product: (id: string) => `${API_BASE_URL}/api/products/${id}`,

  // Orders
  orders: `${API_BASE_URL}/api/orders`,
  order: (id: string) => `${API_BASE_URL}/api/orders/${id}`,

  // Auth
  login: `${API_BASE_URL}/api/auth/login`,
  register: `${API_BASE_URL}/api/auth/register`,
  session: `${API_BASE_URL}/api/auth/session`,
} as const;
