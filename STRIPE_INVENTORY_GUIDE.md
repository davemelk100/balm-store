# Stripe Inventory Management Guide

## Overview

The BALM Store now uses **Stripe as the single source of truth** for product inventory and management. All product data, pricing, and inventory are managed through the Stripe Dashboard, and the store automatically fetches this data for display.

## What Changed

### Removed Components

- ✅ Backend product management API endpoints (`/api/products`)
- ✅ Backend inventory tracking system (Order, Product, InventoryLog models)
- ✅ Admin panel HTML file (`store_admin.html`)
- ✅ Product database tables and schemas
- ✅ Inventory-related documentation

### Current Architecture

- **Product Source**: Stripe Products & Prices API
- **Frontend**: Fetches products via Netlify serverless function
- **Inventory Management**: Stripe Dashboard
- **Checkout**: Stripe Checkout / Buy Buttons

## Managing Products in Stripe

### 1. Access Stripe Dashboard

1. Go to [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Navigate to **Products** in the left sidebar

### 2. Create a New Product

1. Click **+ Add product**
2. Fill in the basic information:
   - **Name**: Product title (e.g., "BALM Chest Print Button-Up Cursive")
   - **Description**: Short product description
   - **Images**: Upload product images (first image will be the main image)
   - **Price**: Set the price and currency

### 3. Add Custom Metadata

To match the store's product structure, add metadata fields:

```
category: art | music | sports
sizes: S,M,L,XL,2XL,3XL
colors: Black,White,Navy,Gray
details: Full product details/materials/care instructions
```

**How to add metadata:**

1. Scroll to the **Metadata** section in the product editor
2. Click **+ Add metadata**
3. Enter key-value pairs as shown above

### 4. Set Up Inventory (Optional)

Stripe automatically tracks inventory if you enable it:

1. In the product editor, expand **Advanced options**
2. Enable **Track inventory**
3. Set initial stock quantity
4. Configure low stock alerts

### 5. Create Buy Buttons (Optional)

For direct checkout functionality:

1. Go to **Products** → Select your product
2. Click **Create payment link** or **Create buy button**
3. Copy the Buy Button ID
4. Add it to `frontend/src/config/stripe.ts`:

```typescript
export const STRIPE_BUY_BUTTON_IDS: Record<string, string> = {
  "product-id": "buy_btn_xxxxx",
};
```

## How Products Are Fetched

### Architecture

```
Stripe Products API
        ↓
Netlify Function (/.netlify/functions/get-products)
        ↓
Frontend (Store.tsx, ProductDetail.tsx)
        ↓
Display to Users
```

### Netlify Function

Located at: `netlify/functions/get-products.js`

This serverless function:

- Authenticates with Stripe using `STRIPE_SECRET_KEY`
- Fetches all active products with expanded price data
- Transforms Stripe data to match the app's Product interface
- Returns formatted products as JSON
- Caches responses for 5 minutes

### Frontend Integration

Both `Store.tsx` and `ProductDetail.tsx` fetch products via:

```typescript
const response = await fetch("/.netlify/functions/get-products");
const data = await response.json();
```

**Fallback Mechanism**: If the Stripe fetch fails, the app falls back to local products defined in `frontend/src/store/data/storeProducts.ts`.

## Product Data Mapping

### Stripe → App Format

| Stripe Field                        | App Field         | Notes                                   |
| ----------------------------------- | ----------------- | --------------------------------------- |
| `product.id`                        | `stripeProductId` | Unique Stripe product ID                |
| `product.name`                      | `title`           | Product name/title                      |
| `product.description`               | `description`     | Short description                       |
| `product.images[0]`                 | `image`           | Main product image                      |
| `product.images`                    | `images`          | All product images                      |
| `product.default_price.unit_amount` | `price`           | Price in dollars (converted from cents) |
| `product.metadata.category`         | `mainCategory`    | Product category (art, music, sports)   |
| `product.metadata.sizes`            | `sizes`           | Available sizes (comma-separated)       |
| `product.metadata.colors`           | `colors`          | Available colors (comma-separated)      |
| `product.metadata.details`          | `details`         | Full product details                    |

## Environment Variables Required

### Backend (.env)

No longer requires product-related environment variables.

### Frontend (.env or Netlify)

```bash
# Stripe Publishable Key (for frontend)
VITE_STRIPE_PUBLISHABLE_KEY_TEST=pk_test_xxxxx
VITE_STRIPE_PUBLISHABLE_KEY_LIVE=pk_live_xxxxx
```

### Netlify Functions

```bash
# Stripe Secret Key (server-side only)
STRIPE_SECRET_KEY=sk_test_xxxxx  # or sk_live_xxxxx for production
```

**Important**: Never expose `STRIPE_SECRET_KEY` in frontend code!

## Testing Your Setup

### 1. Create Test Products

1. Go to Stripe Dashboard (Test Mode)
2. Create 2-3 test products with metadata
3. Upload product images
4. Set prices

### 2. Verify Netlify Function

```bash
# Local development
netlify dev

# Test the endpoint
curl http://localhost:8888/.netlify/functions/get-products
```

### 3. Check Frontend

1. Start the frontend dev server
2. Navigate to the store page
3. Verify products load from Stripe
4. Check browser console for any errors

## Managing Inventory

### Stock Tracking

1. Enable inventory tracking in Stripe product settings
2. Stripe automatically decrements stock on successful checkout
3. Set up low stock alerts in Stripe Dashboard

### Updating Prices

1. Go to Stripe Dashboard → Products
2. Select the product
3. Update the price (creates a new price object)
4. Optionally archive old prices

### Updating Product Details

1. Go to Stripe Dashboard → Products
2. Select the product
3. Modify name, description, images, or metadata
4. Save changes
5. Frontend automatically fetches updates (5-minute cache)

## Best Practices

### 1. Product Images

- Upload high-quality images (minimum 1500x2000px)
- Use consistent aspect ratios (3:4 recommended)
- First image is the primary display image
- Support multiple images for product galleries

### 2. Metadata Standards

- Use consistent category names: `art`, `music`, `sports`
- Format sizes consistently: `S,M,L,XL,2XL,3XL`
- Keep metadata keys lowercase
- Use comma-separated values for lists

### 3. Pricing

- Always use cents/smallest currency unit in Stripe
- Consider tax implications (Stripe Tax integration)
- Set up price tiers if offering quantity discounts

### 4. Testing

- Always test in Stripe Test Mode first
- Use test cards (4242 4242 4242 4242)
- Verify product data mapping is correct
- Test checkout flow end-to-end

## Troubleshooting

### Products Not Showing

1. Check Stripe product is marked as **Active**
2. Verify `STRIPE_SECRET_KEY` is set in Netlify
3. Check browser console for fetch errors
4. Verify Netlify function is deployed

### Images Not Loading

1. Ensure images are uploaded to Stripe
2. Check image URLs in Stripe response
3. Verify CORS settings if using external images
4. Check browser network tab for 404s

### Price Shows $0

1. Verify product has a default price set
2. Check price is active in Stripe
3. Ensure price unit_amount is set correctly

### Metadata Not Mapping

1. Verify metadata keys match expected format
2. Check for typos in metadata keys
3. Ensure comma-separated values have no spaces
4. Review Netlify function transformation logic

## Migration from Database to Stripe

If you previously had products in the database:

### Manual Migration Steps

1. Export existing product data from database
2. For each product:
   - Create corresponding product in Stripe
   - Upload images to Stripe
   - Set price and metadata
   - Note the new Stripe product ID
3. Update any hardcoded product references
4. Test thoroughly before removing database

### Automated Migration (Advanced)

Consider creating a migration script that:

1. Reads from old database
2. Creates products via Stripe API
3. Uploads images to Stripe
4. Maps all fields to metadata
5. Generates mapping file for reference

## Additional Resources

- [Stripe Products API Documentation](https://stripe.com/docs/api/products)
- [Stripe Inventory Management](https://stripe.com/docs/products-prices/inventory-management)
- [Stripe Buy Button Documentation](https://stripe.com/docs/payment-links/buy-button)
- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)

## Support

For issues or questions:

1. Check Stripe Dashboard logs
2. Review Netlify function logs
3. Check browser console errors
4. Verify environment variables are set
5. Test Stripe API directly with curl/Postman

---

**Last Updated**: December 2025
**Version**: 2.0 (Stripe-only inventory)
