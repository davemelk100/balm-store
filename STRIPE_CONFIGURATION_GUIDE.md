# Stripe Integration Configuration Guide

## Overview

This guide explains how to configure Stripe integration for the BALM Store.

## Files Structure

```
frontend/
├── src/
│   ├── config/
│   │   └── stripe.ts          # Stripe configuration
│   ├── store/
│   │   ├── data/
│   │   │   └── storeProducts.ts  # Product data with Stripe IDs
│   │   ├── types/
│   │   │   └── index.ts       # Updated Product type
│   │   └── pages/
│   │       ├── Store.tsx      # Home page with Stripe buttons
│   │       └── ProductDetail.tsx  # Product detail with Stripe button
│   └── globals.css            # Stripe button styling
└── .env                       # Environment variables (create this)
```

## Setup Steps

### 1. Create Environment Variables

Create a `.env` file in the `frontend/` directory:

```bash
# Test Mode Keys (for development)
VITE_STRIPE_PUBLISHABLE_KEY_TEST=pk_test_51SfaUuFKiaEr26Zc7BOy7iWmDZTlbxR8P4MU48q7SNhPAZo8JS84jtUYihIJgFGGzL4GTrgdCA6Shp6UbBAH3Ofs00paxt1Glz

# Live Mode Keys (for production - get from Stripe dashboard)
VITE_STRIPE_PUBLISHABLE_KEY_LIVE=pk_live_your_key_here

# API Configuration
VITE_API_URL=http://localhost:8000
```

### 2. Get Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **API Keys**
3. Copy your **Publishable key** (starts with `pk_test_` for test mode)
4. For production, toggle to **Live mode** and copy the live key

### 3. Create Stripe Buy Buttons

For each product you want to sell:

1. Go to [Stripe Buy Button](https://dashboard.stripe.com/test/payments/buy-button)
2. Click **Create buy button**
3. Configure:
   - **Product**: Select or create a product
   - **Price**: Set the amount
   - **Collect customer addresses**: Recommended for shipping
   - **After payment**: Set success URL (your domain)
4. Click **Create**
5. Copy the **Buy Button ID** (format: `buy_btn_xxxxx`)

### 4. Add Product Stripe Configuration

In `frontend/src/store/data/storeProducts.ts`, add the `stripeBuyButtonId` to each product:

```typescript
{
  id: "my-product-id",
  title: "My Product",
  price: 25.00,
  // ... other fields ...
  stripeBuyButtonId: "buy_btn_xxxxx", // From Stripe dashboard
}
```

### 5. Alternative: Use Stripe Config File

Instead of adding to product data, you can also use the centralized config in `frontend/src/config/stripe.ts`:

```typescript
export const STRIPE_BUY_BUTTON_IDS: Record<string, string> = {
  "product-id-1": "buy_btn_xxxxx",
  "product-id-2": "buy_btn_yyyyy",
  // Add more products here
};
```

## Configuration Files

### stripe.ts Configuration

The main Stripe configuration file provides:

- **STRIPE_PUBLISHABLE_KEY**: Auto-selects test/live key based on environment
- **STRIPE_BUY_BUTTON_IDS**: Map of product IDs to Stripe Buy Button IDs
- **getStripeBuyButtonId()**: Helper function to retrieve button ID for a product
- **isStripeConfigured()**: Validation function

### Button Display Logic

Stripe Buy buttons will only display if:

1. The product has a `stripeBuyButtonId` set
2. The Stripe publishable key is configured
3. The Stripe script loads successfully

## Testing

### Test Mode

1. Use test publishable key (`pk_test_...`)
2. Use test Buy Button IDs created in test mode
3. Use Stripe test card numbers:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Any future expiry date and any 3-digit CVC

### Production

1. Switch to live publishable key in `.env`
2. Create live Buy Buttons in Stripe dashboard (live mode)
3. Update product configuration with live Buy Button IDs

## Styling

The Stripe Buy buttons are styled to match your other buttons using:

1. **CSS**: `frontend/src/globals.css` - External styles and `::part()` selectors
2. **JavaScript**: Shadow DOM injection in both `Store.tsx` and `ProductDetail.tsx`

Styles applied:

- Font: Geist Mono
- Background: #f0f0f0
- Shadow: Neumorphic style matching other buttons
- Height: 45px
- Hover: Scale 1.05

## Environment-Based Configuration

The system automatically uses:

- **Development** (`npm run dev`): Test keys
- **Production** (`npm run build`): Live keys (if configured)

Override by setting `VITE_STRIPE_PUBLISHABLE_KEY_TEST` or `VITE_STRIPE_PUBLISHABLE_KEY_LIVE` in `.env`

## Security Notes

1. ✅ **Publishable keys** can be safely exposed in frontend code
2. ❌ **Secret keys** must NEVER be in frontend code
3. ✅ Use Stripe's secure checkout (Buy Buttons use Stripe-hosted checkout)
4. ✅ Configure webhook endpoints in Stripe dashboard for order fulfillment

## Troubleshooting

### Button Not Showing

- Check if product has `stripeBuyButtonId` set
- Verify Stripe script loaded (check browser console)
- Ensure publishable key is configured correctly

### Styling Not Applied

- Check browser console for shadow DOM errors
- Verify globals.css is imported
- Clear browser cache and rebuild

### Wrong Price/Product

- Verify Buy Button ID matches the product in Stripe dashboard
- Check if you're in test vs live mode

## Next Steps

1. Create products in Stripe dashboard
2. Generate Buy Buttons for each product
3. Add Buy Button IDs to product data
4. Test with Stripe test cards
5. Switch to live mode for production

## Resources

- [Stripe Buy Buttons Documentation](https://stripe.com/docs/payment-links/buy-button)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Dashboard](https://dashboard.stripe.com)
