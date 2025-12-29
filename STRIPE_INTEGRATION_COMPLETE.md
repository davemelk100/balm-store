# Stripe Integration - Quick Setup

## What Was Configured

### 1. **Configuration System** (`frontend/src/config/stripe.ts`)

- Centralized Stripe configuration
- Environment-based key selection (test/live)
- Product-to-Buy-Button ID mapping
- Helper functions for configuration

### 2. **Product Type Updates** (`frontend/src/store/types/index.ts`)

- Added `stripeBuyButtonId?: string` field
- Added `stripePriceId?: string` field (for future use)

### 3. **Product Data** (`frontend/src/store/data/storeProducts.ts`)

- Added `stripeBuyButtonId` to "BALM Chest Print Button-Up Cursive"
- Current ID: `buy_btn_1SjUfNFKiaEr26ZcXyKu3pwe`

### 4. **Components Updated**

- **Store.tsx** (Home Page): Dynamic Stripe button rendering
- **ProductDetail.tsx** (Product Page): Dynamic Stripe button rendering
- Both use `product.stripeBuyButtonId` to conditionally show buttons

### 5. **Button Styling**

- CSS in `globals.css` for external styling
- JavaScript shadow DOM injection for internal styling
- Matches existing neumorphic button design

## Current Configuration

### Publishable Key (Test Mode)

```
pk_test_51SfaUuFKiaEr26Zc7BOy7iWmDZTlbxR8P4MU48q7SNhPAZo8JS84jtUYihIJgFGGzL4GTrgdCA6Shp6UbBAH3Ofs00paxt1Glz
```

### Product with Stripe Integration

- **Product ID**: `balm-shirt-2`
- **Buy Button ID**: `buy_btn_1SjUfNFKiaEr26ZcXyKu3pwe`
- **Price**: $25.00

## Quick Start

### To Add a New Product with Stripe:

1. **Create Buy Button in Stripe Dashboard**

   ```
   https://dashboard.stripe.com/test/payments/buy-button
   ```

2. **Add to Product Data** in `storeProducts.ts`:

   ```typescript
   {
     id: "new-product-id",
     title: "Product Name",
     price: 29.99,
     // ... other fields ...
     stripeBuyButtonId: "buy_btn_YOUR_NEW_ID",
   }
   ```

3. **Button Appears Automatically**
   - On home page product card (if `stripeBuyButtonId` is set)
   - On product detail page (if `stripeBuyButtonId` is set)

## Environment Variables

Create `frontend/.env`:

```bash
# Optional - Override default keys
VITE_STRIPE_PUBLISHABLE_KEY_TEST=your_test_key
VITE_STRIPE_PUBLISHABLE_KEY_LIVE=your_live_key
```

## Testing

Use Stripe test cards:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- Any future expiry + any CVC

## What's Working

✅ Stripe Buy Button loads on pages
✅ Dynamic button IDs per product
✅ Conditional rendering (only shows if product has button ID)
✅ Custom styling matches your design
✅ Environment-based key selection
✅ Clean configuration system

## Next Steps

1. ✅ Configuration complete
2. ⏭️ Create more products in Stripe
3. ⏭️ Generate Buy Buttons for each
4. ⏭️ Add Buy Button IDs to product data
5. ⏭️ Test checkout flow
6. ⏭️ Configure webhooks for order fulfillment
7. ⏭️ Switch to live mode for production

## Files Modified

- ✅ `frontend/src/config/stripe.ts` (new)
- ✅ `frontend/src/store/types/index.ts`
- ✅ `frontend/src/store/data/storeProducts.ts`
- ✅ `frontend/src/store/pages/Store.tsx`
- ✅ `frontend/src/store/pages/ProductDetail.tsx`
- ✅ `frontend/src/globals.css`
- ✅ `frontend/src/vite-env.d.ts`

## Documentation

📖 Full guide: `STRIPE_CONFIGURATION_GUIDE.md`
