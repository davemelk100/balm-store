# Fix: Product Detail Page Not Loading

## Problem Identified

When clicking on a product from the store page, the product detail page was showing blank/loading indefinitely.

### Root Cause

**Product ID Mismatch:**
- Local fallback product used ID: `"balm-shirt-2"`
- Stripe product has ID: `"prod_TgsPf8wZHkrZsZ"`
- When clicking a product, URL became: `/product/balm-shirt-2`
- ProductDetail page tried to find `"balm-shirt-2"` in Stripe products
- No match found → blank page

## Solution Applied

### 1. Updated Local Product ID
Changed `frontend/src/store/data/storeProducts.ts` to use the Stripe product ID:

```typescript
// Before
{
  id: "balm-shirt-2",
  // ...
}

// After
{
  id: "prod_TgsPf8wZHkrZsZ", // Matches Stripe product ID
  stripeProductId: "prod_TgsPf8wZHkrZsZ",
  stripePriceId: "price_1SjUf0FKiaEr26Zcds2Jb77m",
  // ...
}
```

### 2. Added Debugging Console Logs
Enhanced both `Store.tsx` and `ProductDetail.tsx` to log:
- What product ID is being searched for
- What the Netlify function returns
- Whether products are found or fallback is used

### 3. Improved Error Handling
Added better console warnings and error messages to help debug issues in the future.

## How It Works Now

```
User clicks product on Store page
   ↓
Navigates to: /product/prod_TgsPf8wZHkrZsZ
   ↓
ProductDetail fetches from Netlify function
   ↓
Finds product with ID: prod_TgsPf8wZHkrZsZ
   ↓
Displays product details ✅
```

## Testing Steps

1. **Clear browser cache** (Ctrl+Shift+R or Cmd+Shift+R)
2. **Navigate to store page**
3. **Click on a product**
4. **Product detail page should load**
5. **Check browser console** for debug logs:
   ```
   Fetching products from Netlify function...
   Netlify function response: 200 {...}
   Setting products from Stripe: [...]
   ```

## Debugging

If it still doesn't work, check:

### 1. Browser Console
Look for:
- `Fetching product with id: prod_TgsPf8wZHkrZsZ`
- `Products from Stripe: [...]`
- `Found product: {...}`

### 2. Netlify Function Status
```bash
# Test locally
netlify dev

# Then visit:
curl http://localhost:8888/.netlify/functions/get-products
```

Should return:
```json
{
  "products": [
    {
      "id": "prod_TgsPf8wZHkrZsZ",
      "title": "BALM Chest Print Button-Up Cursive",
      ...
    }
  ]
}
```

### 3. Stripe Dashboard
Verify product exists:
1. Go to https://dashboard.stripe.com/products
2. Find product with ID: `prod_TgsPf8wZHkrZsZ`
3. Ensure it's marked as "Active"
4. Check that it has a default price set

### 4. Environment Variables
Ensure Netlify has `STRIPE_SECRET_KEY` set:
```bash
# Check locally
netlify env:list

# Or in Netlify dashboard:
# Site settings → Environment variables
```

## For Future Products

When adding new products, always use the Stripe product ID:

```typescript
// In storeProducts.ts
{
  id: "prod_StripeProductID", // ← Use actual Stripe ID
  stripeProductId: "prod_StripeProductID",
  stripePriceId: "price_StripePriceID",
  stripeBuyButtonId: "buy_btn_xxxxx", // Optional
  // ... rest of product data
}
```

To find your Stripe product IDs:
1. Go to Stripe Dashboard → Products
2. Click on a product
3. Copy the ID from the URL or product details

## Alternative: Custom ID Mapping

If you want to keep using custom IDs like `"balm-shirt-2"`, you can:

### Option 1: Add Custom ID to Stripe Metadata
In Stripe Dashboard → Product → Metadata:
- Key: `customId`
- Value: `balm-shirt-2`

Then modify `netlify/functions/get-products.js`:
```javascript
return {
  id: product.metadata?.customId || product.id,
  stripeProductId: product.id,
  // ...
};
```

### Option 2: Create ID Mapping File
Create `frontend/src/store/data/productIdMapping.ts`:
```typescript
export const productIdMapping: Record<string, string> = {
  "balm-shirt-2": "prod_TgsPf8wZHkrZsZ",
  "other-product": "prod_AnotherID",
};
```

Then update ProductDetail.tsx to use the mapping.

## Current Status

✅ **Fixed** - Local product now uses Stripe product ID
✅ **Enhanced** - Added debug logging for troubleshooting
✅ **Improved** - Better error handling and fallbacks

The product detail page should now work correctly!

---

**Date Fixed:** December 29, 2025
**Issue:** Product ID mismatch between local fallback and Stripe products
**Solution:** Updated local product to use Stripe product ID

