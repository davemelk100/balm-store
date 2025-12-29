# Debugging: Product Detail Page Not Showing

## Issue
Product detail page shows blank/loading after clicking product link from store.

## Debug Steps

### 1. Check Browser Console
Open your browser's Developer Tools (F12) and check the Console tab for:
- Network errors
- JavaScript errors
- Console.log messages showing what's being fetched

### 2. Check Network Tab
In Developer Tools → Network tab:
1. Clear all requests
2. Navigate to a product detail page
3. Look for the request to `/.netlify/functions/get-products`
4. Check if it's returning 200 OK
5. Click on it and view the Response tab

**Expected Response:**
```json
{
  "products": [
    {
      "id": "prod_TgsPf8wZHkrZsZ",
      "stripeProductId": "prod_TgsPf8wZHkrZsZ",
      "stripePriceId": "price_1SjUf0FKiaEr26Zcds2Jb77m",
      "title": "Product Name",
      "price": 25.00,
      "description": "Description",
      "image": "https://...",
      "images": [...],
      "mainCategory": "art",
      "sizes": ["S", "M", "L"],
      "colors": ["Black", "White"],
      "details": "...",
      "metadata": {...}
    }
  ]
}
```

### 3. Verify Product ID in URL
When you click a product, check the URL:
- Is it `/product/balm-shirt-2` (old local ID)?
- Or is it `/product/prod_TgsPf8wZHkrZsZ` (Stripe product ID)?

**Problem:** If the Store page is showing local products but using their local IDs (like `balm-shirt-2`), but the detail page is trying to fetch from Stripe using that ID, it won't find a match because Stripe products have IDs like `prod_xxxxx`.

### 4. Check Stripe Product Metadata
In Stripe Dashboard → Products → Your Product:
1. Verify the product has metadata set:
   - `category`: art, music, or sports
   - `sizes`: S,M,L,XL (optional)
   - `colors`: Black,White (optional)
   - `details`: Full description (optional)

### 5. Test Netlify Function Directly

**Option A: Local Development**
```bash
# In terminal
netlify dev

# In another terminal or browser, visit:
curl http://localhost:8888/.netlify/functions/get-products
```

**Option B: Production**
```bash
# Visit in browser or curl
curl https://your-site.netlify.app/.netlify/functions/get-products
```

Should return JSON with products array.

### 6. Common Issues & Solutions

#### Issue: Netlify Function Returns Empty Products
**Cause:** STRIPE_SECRET_KEY not set or product not active in Stripe

**Solution:**
1. Check Netlify dashboard → Site settings → Environment variables
2. Verify `STRIPE_SECRET_KEY` is set to `sk_test_xxxxx` or `sk_live_xxxxx`
3. In Stripe Dashboard, ensure product is marked as "Active"

#### Issue: Product ID Mismatch
**Cause:** Store page shows local products (with local IDs) but detail page expects Stripe IDs

**Solution:**
Two options:

**Option 1: Update local product ID to match Stripe ID**
In `frontend/src/store/data/storeProducts.ts`:
```typescript
{
  id: "prod_TgsPf8wZHkrZsZ", // Use Stripe product ID
  stripeBuyButtonId: "buy_btn_1SjUfNFKiaEr26ZcXyKu3pwe",
  // ... rest of product
}
```

**Option 2: Add a mapping in the Netlify function**
Modify `netlify/functions/get-products.js` to use a custom ID from metadata:
```javascript
return {
  id: product.metadata?.customId || product.id, // Use custom ID if provided
  stripeProductId: product.id,
  // ... rest
};
```

Then in Stripe Dashboard, add metadata:
- `customId`: balm-shirt-2

#### Issue: CORS Error
**Cause:** Netlify function not accessible or CORS headers missing

**Solution:**
The function already has CORS headers. Ensure you're running via `netlify dev` locally or deployed to Netlify.

#### Issue: Function Not Found (404)
**Cause:** Netlify functions not deployed or wrong path

**Solution:**
1. Ensure `netlify.toml` has functions directory configured
2. Deploy functions: `netlify deploy --prod`
3. Check Netlify dashboard → Functions tab

### 7. Quick Fix: Temporary Hybrid Approach

If you want to keep using local product data with local IDs while testing Stripe:

**Update ProductDetail.tsx to prioritize local products:**
```typescript
useEffect(() => {
  // Try local first
  const localProduct = storeProducts.find((p) => p.id === id);
  
  if (localProduct) {
    setProduct(localProduct);
    setLoading(false);
    return;
  }
  
  // If not found locally, try Stripe
  const fetchProduct = async () => {
    // ... existing Stripe fetch logic
  };
  
  fetchProduct();
}, [id]);
```

### 8. Debugging Console Logs

I've added console.log statements to your code. Check the browser console for:

```
Fetching product with id: balm-shirt-2
Netlify function response: {...}
Products from Stripe: [...]
Found product: {...} or undefined
```

This will tell you:
1. What ID is being searched for
2. What products Stripe returned
3. Whether a match was found

### 9. Verify Your Current Setup

Run these checks:

**Check 1: Is Netlify function running?**
```bash
# In terminal
netlify dev
# Should see: ◈ Functions server is listening on 8888
```

**Check 2: Are products showing on store homepage?**
- If yes → Netlify function works
- If no → Function not working or returning empty

**Check 3: What's in the product URL?**
- Click a product
- Look at URL bar
- Note the product ID after `/product/`

**Check 4: Does that ID exist in Stripe?**
- Go to Stripe Dashboard → Products
- Search for that product ID
- If not found, there's your problem!

## Recommended Solution

Based on your Stripe event showing `prod_TgsPf8wZHkrZsZ`:

### Step 1: Update Your Local Product Data
```typescript
// frontend/src/store/data/storeProducts.ts
export const storeProducts: Product[] = [
  {
    id: "prod_TgsPf8wZHkrZsZ", // ← Use Stripe ID here
    mainCategory: "art",
    title: "BALM Chest Print Button-Up Cursive",
    price: 25.0,
    // ... rest of your product data
    stripeBuyButtonId: "buy_btn_1SjUfNFKiaEr26ZcXyKu3pwe",
  },
];
```

### Step 2: Ensure Stripe Product Has Metadata
In Stripe Dashboard → Product `prod_TgsPf8wZHkrZsZ` → Add metadata:
```
category: art
sizes: S,M,L,XL,2XL,3XL
colors: Black,White,Navy
details: 2.9 oz./yd² (US), 4.8 oz./L yd (CA), 100% polyester...
```

### Step 3: Test Again
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Navigate to store
4. Click product
5. Check if detail page loads

## Still Not Working?

Share these with me:
1. Screenshot of browser console errors
2. Network tab showing the get-products response
3. The URL of the product detail page
4. Output from: `curl http://localhost:8888/.netlify/functions/get-products`

