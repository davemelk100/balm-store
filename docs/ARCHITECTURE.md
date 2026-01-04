# Architecture & Technical Guide

Overview of the BALM Store's technical architecture and codebase structure.

## 🏗️ Project Structure

```
balm-store/
├── frontend/          # React + Vite application
│   ├── src/
│   │   ├── store/    # E-commerce logic (extensible)
│   │   ├── components/ # Shared UI components
│   │   └── lib/      # Style and animation utilities
│   └── public/       # Static assets (images, logos)
├── backend/           # FastAPI application
│   ├── app/
│   │   ├── api/      # Routes and Endpoints
│   │   ├── models/   # SQLAlchemy Database Models
│   │   └── schemas/  # Pydantic Data Validation
│   └── scripts/      # Database and deployment scripts
├── docs/              # Consolidated Documentation
└── netlify/           # Serverless functions (Checkout Flow)
```

---

## 🛒 Store Module (Frontend)
The `/frontend/src/store/` directory is designed to be semi-autonomous. It contains:
- **`data/storeProducts.ts`**: The central catalog of product information.
- **`context/CartContext.tsx`**: State management for the shopping cart with LocalStorage persistence.
- **`pages/Store.tsx`**: The main storefront grid with dynamic filtering.

---

## 🔧 Backend Logic (FastAPI)
- **ORM**: SQLAlchemy v2 with support for SQLite (dev) and PostgreSQL (prod).
- **Auth**: JWT-based authentication with bcrypt password hashing.
- **Admin**: A custom HTML/JS admin dashboard located at `/backend/store_admin.html` served by the backend.

---

## 💳 Checkout Flow
1. **Frontend**: Collects cart items and user details.
2. **Netlify Function**: `netlify/functions/create-checkout-session.js` validates the cart and talks to Stripe.
3. **Stripe**: Handles the secure payment UI.
4. **Backend**: Receives webhooks to update order status (if configured).

---

## 🎨 Design System
- **Styling**: Tailwind CSS with custom theme extensions.
- **Components**: Radix UI for accessible primitives.
- **Animations**: Framer Motion for liquid transitions and glassmorphism effects.
