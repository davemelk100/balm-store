# Stripe Inventory Management Setup Guide

## Overview

This guide explains how to sync your BALM Store with Stripe to let Stripe manage your product inventory. This eliminates the need for a separate backend database.

## Architecture

**Before:** Products in `storeProducts.ts` → Manual updates required
**After:** Products in Stripe Dashboard → Automatically synced to your store

### How It Works

1. **Stripe Dashboard** - Manage products, prices, inventory
2. **Netlify Function** (`get-products.js`) - Fetches products from Stripe API
3. **Frontend** - Displays products dynamically from Stripe
4. **Checkout** - Uses Stripe Price IDs for seamless payment

## Setup Steps

### Step 1: Create Products in Stripe Dashboard

1. Go to [Stripe Dashboard → Products](https://dashboard.stripe.com/products)
2. Click **"+ Add product"**
3. Fill in product details:

```
Name: BALM Chest Print Button-Up Cursive
Description: 2.9 oz./yd² (US), 4.8 oz./L yd (CA), 100% polyester...
Price: $25.00 USD
Images: Upload your product images
```

4. **Add Custom Metadata** (Important for store features):
   ```
   category: art
   sizes: S,M,L,XL,2XL,3XL
   colors: Black,White,Navy
   details: Materials: 100% polyester...
   ```

5. **Enable Inventory Tracking** (Optional):
   - Turn on "Track quantity"
   - Set stock levels
   - Stripe will automatically prevent overselling

6. Click **Save product**

### Step 2: Set Up Environment Variables

Add these to your **Netlify** environment variables (Site settings → Environment variables):

```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### Step 3: Deploy the Changes

The following files have been updated:

1. **`netlify/functions/get-products.js`** - NEW: Fetches products from Stripe
2. **`netlify/functions/create-checkout-session.js`** - UPDATED: Supports Stripe Price IDs
3. **`frontend/src/store/pages/Store.tsx`** - UPDATED: Fetches from Stripe API
4. **`frontend/src/store/pages/Checkout.tsx`** - UPDATED: Uses Price IDs when available

Commit and push:

```bash
git add .
git commit -m "Add Stripe inventory management integration"
git push
```

### Step 4: Test the Integration

1. **Visit your store:** https://balmsoothes.com
2. Products should now load from Stripe
3. Add a product to cart
4. Go to checkout
5. Complete a test purchase

## Product Metadata Fields

When creating products in Stripe, use these metadata keys:

| Metadata Key | Example Value | Description |
|--------------|---------------|-------------|
| `category` | `art` | Main product category |
| `sizes` | `S,M,L,XL` | Available sizes (comma-separated) |
| `colors` | `Black,White,Navy` | Available colors (comma-separated) |
| `details` | `Materials: 100% polyester...` | Full product details |
| `sizeChart` | (Optional) | JSON string for size measurements |

## Managing Inventory in Stripe

### Add a New Product

1. Stripe Dashboard → Products → Add product
2. Fill in details + metadata
3. Product appears automatically on your store (refresh page)

### Update Product Price

1. Stripe Dashboard → Products → Select product
2. Edit price
3. Changes reflect immediately

### Update Product Images

1. Stripe Dashboard → Products → Select product
2. Upload new images
3. Images update on next page load

### Track Inventory

1. Enable "Track quantity" on product
2. Set stock level
3. Stripe prevents checkout when out of stock
4. You'll get low-stock notifications

### Deactivate Product

1. Stripe Dashboard → Products → Select product
2. Toggle "Active" to OFF
3. Product is hidden from store automatically

## Benefits of This Approach

✅ **No Backend Needed** - Stripe handles everything
✅ **Real-time Updates** - Change products instantly
✅ **Inventory Tracking** - Prevent overselling automatically
✅ **Simple Management** - One dashboard for products + payments
✅ **Automatic Tax** - Stripe Tax integration ready
✅ **Webhooks Ready** - Easy to add order notifications later

## Fallback Behavior

If Stripe is unavailable or not configured:
- Store falls back to `storeProducts.ts` (local products)
- Checkout creates prices on-the-fly
- No errors shown to customers

## Advanced Features (Optional)

### Enable Automatic Tax

In `create-checkout-session.js`, uncomment:

```javascript
automatic_tax: { enabled: true },
```

Then enable Stripe Tax in your dashboard.

### Add Webhooks for Order Notifications

1. Create webhook endpoint in Netlify Functions
2. Listen for `checkout.session.completed` events
3. Send order confirmation emails
4. Update inventory in external systems

### Add Product Variants

Use Stripe's built-in variant support:
- Different prices for sizes
- Color variations
- Quantity discounts

## Monitoring

### View Sales

Stripe Dashboard → Payments

### View Product Performance

Stripe Dashboard → Analytics → Products

### Low Stock Alerts

Stripe Dashboard → Products → Inventory alerts

## Troubleshooting

### Products not loading?

1. Check Netlify function logs
2. Verify `STRIPE_SECRET_KEY` is set
3. Check browser console for errors
4. Ensure products are marked "Active" in Stripe

### Checkout failing?

1. Verify Stripe keys are correct (live vs test)
2. Check product has valid price
3. Review Netlify function logs

### Images not showing?

1. Ensure images are uploaded to Stripe
2. Check image URLs are HTTPS
3. Verify CORS settings if using external images

## Support

- **Stripe Docs:** https://stripe.com/docs/products-prices/overview
- **Netlify Functions:** https://docs.netlify.com/functions/overview/

## Next Steps

1. ✅ Create your products in Stripe Dashboard
2. ✅ Add metadata for sizes, colors, etc.
3. ✅ Deploy these changes
4. ✅ Test checkout flow
5. ⏳ Enable live mode when ready
6. ⏳ Set up webhooks for order notifications (optional)

---

**You're all set!** Your store now uses Stripe as the single source of truth for products and inventory.

