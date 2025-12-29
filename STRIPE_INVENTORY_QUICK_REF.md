# Quick Reference: Stripe Inventory Management

## 🎯 Key Points

- ✅ **Inventory Source**: Stripe Dashboard (no database)
- ✅ **Product Fetching**: Via Netlify function `/.netlify/functions/get-products`
- ✅ **Admin Panel**: Removed (use Stripe Dashboard instead)
- ✅ **Fallback**: Local products if Stripe unavailable

## 🔗 Quick Links

- **Stripe Dashboard**: https://dashboard.stripe.com/products
- **Inventory Guide**: See `STRIPE_INVENTORY_GUIDE.md`
- **Migration Summary**: See `MIGRATION_TO_STRIPE_SUMMARY.md`

## 🛠️ Common Tasks

### Create a New Product

1. Go to Stripe Dashboard → Products
2. Click "+ Add product"
3. Fill in name, description, price
4. Upload images
5. Add metadata:
   - `category`: art | music | sports
   - `sizes`: S,M,L,XL,2XL,3XL
   - `colors`: Black,White,Navy,etc
   - `details`: Full description

### Update Product Price

1. Stripe Dashboard → Products → Select product
2. Update price
3. Save changes
4. Frontend updates within 5 minutes (cache)

### Update Product Images

1. Stripe Dashboard → Products → Select product
2. Upload/replace images
3. First image = main display image

### Track Inventory

1. Stripe Dashboard → Product → Advanced options
2. Enable "Track inventory"
3. Set initial stock
4. Stripe auto-decrements on purchase

### View Product in Store

- Product fetches automatically from Stripe
- No manual sync needed
- Falls back to local if Stripe unavailable

## 🔑 Environment Variables

### Netlify Functions

```bash
STRIPE_SECRET_KEY=sk_test_xxxxx
```

### Frontend

```bash
VITE_STRIPE_PUBLISHABLE_KEY_TEST=pk_test_xxxxx
VITE_STRIPE_PUBLISHABLE_KEY_LIVE=pk_live_xxxxx
```

## 🧪 Quick Test

```bash
# Test Netlify function locally
netlify dev

# Test endpoint
curl http://localhost:8888/.netlify/functions/get-products
```

## 📊 Product Data Structure

```typescript
{
  id: "prod_xxxxx",              // Stripe ID
  stripeProductId: "prod_xxxxx", // Same as id
  stripePriceId: "price_xxxxx",  // Price object ID
  title: "Product Name",
  price: 25.00,                  // In dollars
  description: "Short desc",
  image: "https://...",          // Main image
  images: ["https://..."],       // All images
  mainCategory: "art",           // From metadata
  sizes: ["S", "M", "L"],        // From metadata
  colors: ["Black", "White"],    // From metadata
  details: "Full details",       // From metadata
}
```

## ⚠️ Troubleshooting

| Issue                | Solution                          |
| -------------------- | --------------------------------- |
| Products not showing | Check product is Active in Stripe |
| Price shows $0       | Verify default price is set       |
| Images not loading   | Ensure images uploaded to Stripe  |
| Metadata not mapping | Check metadata key spelling       |

## 📁 Removed Files

- `backend/app/api/routes/products.py`
- `backend/app/models/product.py`
- `backend/app/schemas/product.py`
- `backend/store_admin.html`
- `backend/INVENTORY_*.md`

## 📁 Modified Files

- `backend/app/main.py` - Removed product routes
- `backend/scripts/init_db.py` - Removed product init
- `frontend/src/store/pages/ProductDetail.tsx` - Fetch from Stripe
- `frontend/src/store/types/index.ts` - Added Stripe fields

## 🔄 Data Flow

```
Stripe Dashboard
    ↓
Stripe Products API
    ↓
Netlify Function
    ↓
Frontend (Store/ProductDetail)
    ↓
User Display
```

## 💡 Best Practices

1. **Always use Test Mode first** before creating live products
2. **Upload high-quality images** (min 1500x2000px)
3. **Use consistent metadata keys** (lowercase, no spaces)
4. **Set proper categories** for filtering to work
5. **Test checkout flow** after creating products

## 🆘 Need Help?

1. Check `STRIPE_INVENTORY_GUIDE.md` for detailed instructions
2. Review `MIGRATION_TO_STRIPE_SUMMARY.md` for what changed
3. Check Stripe Dashboard logs for API errors
4. Verify environment variables are set correctly

---

**Last Updated**: December 28, 2025
