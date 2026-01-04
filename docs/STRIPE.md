# Stripe Integration Guide

This guide covers everything related to Stripe payments, from simple "Buy Now" buttons to full cart checkout integration.

## 💳 Purchasing Methods

### 1. Buy Now Buttons (Direct)
- **Status**: Ready to use with Publishable Key.
- **Location**: Product detail pages.
- **Mechanism**: Redirects directly to a Stripe-hosted checkout page for that specific item.
- **Requirements**: `VITE_STRIPE_PUBLIC_KEY` in `.env`.

### 2. Cart Checkout (Multi-item)
- **Status**: Requires Secret Key configuration.
- **Location**: Shopping cart checkout flow.
- **Mechanism**: Uses a Netlify function to create a custom Stripe Checkout Session.
- **Requirements**: `STRIPE_SECRET_KEY` in Netlify/Local environment.

---

## 🚀 5-Minute Setup

### 1. Get Your Keys
1. Visit the [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys).
2. Copy your **Publishable key** (`pk_test_...`) and **Secret key** (`sk_test_...`).

### 2. Local Configuration
Add your keys to the root `.env` file:
```env
VITE_STRIPE_PUBLIC_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key
```

### 3. Production Configuration (Netlify)
1. Go to Netlify Dashboard → Site Settings → Environment Variables.
2. Add `STRIPE_SECRET_KEY`.
3. Add `VITE_STRIPE_PUBLIC_KEY`.
4. Trigger a redeploy.

---

## 🧪 Local Testing

To test the full cart checkout flow (including Netlify functions) locally:

1. **Install Netlify CLI**: `npm install -g netlify-cli`
2. **Start Dev Server**: `netlify dev` (Runs on port 8888)
3. **Webhook Testing** (Optional):
   ```bash
   stripe listen --forward-to http://localhost:8888/.netlify/functions/create-checkout-session
   ```

### Test Card Numbers
| Result | Card Number |
| :--- | :--- |
| **Success** | `4242 4242 4242 4242` |
| **Decline** | `4000 0000 0000 0002` |
| **3D Secure** | `4000 0027 6000 3184` |

---

## 🔍 Troubleshooting

- **"Stripe checkout is not yet configured"**: Ensure `STRIPE_SECRET_KEY` is set in the environment where the backend/functions are running.
- **Redirect Fails**: Ensure your `VITE_API_URL` correctly points to the running backend.
- **No keys found**: Check that you are using the correct prefix (`pk_test_` vs `pk_live_`).

---

## 📦 Advanced Configuration
- **Automatic Tax**: Enable in `netlify/functions/create-checkout-session.js`.
- **Promotion Codes**: Set `allow_promotion_codes: true` in the checkout session parameters.
