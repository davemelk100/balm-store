# Inventory Tracking Guide - BALM Store

## 📌 Important Context

**Stripe does NOT have built-in inventory tracking.** This implementation uses Stripe's **metadata fields** to store and display inventory counts, but you must **manually update** stock levels after sales.

## 🛠️ How It Works

### Architecture

```
Stripe Product Metadata (stock_S, stock_M, etc.)
    ↓
Netlify Function (parses inventory)
    ↓
Frontend (displays inventory)
    ↓
User sees available sizes and quantities
```

### What This System Does

✅ **Displays** inventory counts per size  
✅ **Shows** which sizes are in/out of stock  
✅ **Provides** data for UI to disable out-of-stock sizes  

### What This System DOES NOT Do

❌ **Does NOT** automatically decrement stock after purchases  
❌ **Does NOT** prevent overselling  
❌ **Does NOT** sync with payment completion  

## 📝 Setting Up Inventory in Stripe

### Step 1: Go to Stripe Dashboard

1. Navigate to https://dashboard.stripe.com/products
2. Select a product (or create a new one)

### Step 2: Add Sizes Metadata

In the **Metadata** section, add:

```
Key: sizes
Value: S,M,L,XL,2XL,3XL
```

*(Comma-separated, no spaces)*

### Step 3: Add Stock Levels for Each Size

For each size listed above, add a metadata field:

```
Key: stock_S
Value: 10

Key: stock_M
Value: 15

Key: stock_L
Value: 20

Key: stock_XL
Value: 12

Key: stock_2XL
Value: 8

Key: stock_3XL
Value: 5
```

### Example Product Metadata

| Key        | Value                  |
| ---------- | ---------------------- |
| category   | art                    |
| sizes      | S,M,L,XL,2XL,3XL       |
| stock_S    | 10                     |
| stock_M    | 15                     |
| stock_L    | 20                     |
| stock_XL   | 12                     |
| stock_2XL  | 8                      |
| stock_3XL  | 5                      |
| colors     | Black,White,Navy       |
| details    | 100% cotton, pre-shrunk|

### Step 4: Save Changes

- Click **Save** in Stripe Dashboard
- Your store will fetch updates within 5 minutes (cache)

## 🔄 Updating Inventory After Sales

**CRITICAL:** You must manually update inventory in Stripe after each sale.

### Manual Process

1. When you receive a Stripe payment notification:
   - Note the product purchased and size
   - Go to Stripe Dashboard → Products
   - Find the product
   - Update the appropriate `stock_[SIZE]` field
   - Decrement by the quantity sold

### Example

**Sale:** 2x Medium shirts

**Before:**
```
stock_M: 15
```

**After:**
```
stock_M: 13
```

## 🚀 Automated Options (Advanced)

### Option 1: Stripe Webhooks + Custom Backend

Build a system that:

1. Listens for `checkout.session.completed` webhooks
2. Extracts product ID and metadata (size) from the order
3. Updates inventory in Stripe via API
4. Logs changes to your database

**Pros:** Fully automated  
**Cons:** Requires backend development, webhook handling

### Option 2: Recreate Backend Inventory System

Bring back the database-based inventory you previously removed:

1. Create Product and Inventory models in your backend
2. Store stock levels in your database
3. Decrement via API on purchase
4. Use webhooks to trigger updates

**Pros:** More control, better for complex inventory  
**Cons:** More infrastructure, database management

### Option 3: Third-Party Integration

Use apps from [Stripe App Marketplace](https://marketplace.stripe.com):

- **Stockify** - Inventory management
- Other inventory management apps

**Pros:** Pre-built solution  
**Cons:** Additional cost, may not integrate perfectly

## 💻 Displaying Inventory in Your Frontend

The updated code now provides `product.inventory` data:

```typescript
{
  id: "prod_xxx",
  title: "BALM T-Shirt",
  sizes: ["S", "M", "L", "XL"],
  inventory: {
    "S": 10,
    "M": 15,
    "L": 20,
    "XL": 12
  }
}
```

### Example: Show Stock in ProductDetail.tsx

```tsx
{product.sizes && product.sizes.length > 0 && (
  <div className="space-y-2">
    <label className="text-sm font-medium">Size</label>
    <div className="grid grid-cols-3 gap-2">
      {product.sizes.map((size) => {
        const stock = product.inventory?.[size] || 0;
        const isOutOfStock = stock === 0;
        
        return (
          <button
            key={size}
            disabled={isOutOfStock}
            className={`
              border rounded px-4 py-2
              ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : 'hover:border-black'}
              ${selectedSize === size ? 'border-black bg-black text-white' : ''}
            `}
            onClick={() => setSelectedSize(size)}
          >
            <span>{size}</span>
            {stock <= 5 && stock > 0 && (
              <span className="text-xs text-orange-600"> ({stock} left)</span>
            )}
            {isOutOfStock && (
              <span className="text-xs text-red-600"> (Out of Stock)</span>
            )}
          </button>
        );
      })}
    </div>
  </div>
)}
```

## 🧪 Testing Your Setup

### 1. Verify Netlify Function

```bash
netlify dev
```

Then test:

```bash
curl http://localhost:8888/.netlify/functions/get-products
```

Look for `inventory` field in the response:

```json
{
  "products": [
    {
      "id": "prod_xxx",
      "title": "Product Name",
      "sizes": ["S", "M", "L"],
      "inventory": {
        "S": 10,
        "M": 15,
        "L": 20
      }
    }
  ]
}
```

### 2. Check Frontend Display

1. Start your dev server: `npm run dev`
2. Navigate to a product detail page
3. Inspect the browser console
4. Look for inventory data in the product object

## ⚠️ Limitations & Considerations

### Limitations

1. **Manual Updates Required** - You must update Stripe metadata after each sale
2. **No Overselling Prevention** - Multiple customers can order the same item before you update stock
3. **Cache Delay** - Updates may take up to 5 minutes to appear (due to caching)
4. **No Stock Reservations** - Items aren't reserved during checkout process
5. **Metadata Size Limits** - Stripe metadata has size limits (~8KB per object)

### When This Approach Works

✅ Low volume sales  
✅ Simple inventory (one product per size)  
✅ You can manually update stock frequently  
✅ Overselling is acceptable (you can refund if needed)

### When You Need Something Better

❌ High volume sales (risk of overselling)  
❌ Complex inventory (variants, bundles, etc.)  
❌ Multiple sales channels  
❌ Real-time stock accuracy is critical  
❌ Automatic stock updates required

## 📊 Recommended Workflows

### Workflow 1: Daily Manual Updates (Simple)

1. At end of each day, review all sales
2. Update inventory in Stripe for each product/size sold
3. Check products are still marked as Active

### Workflow 2: Real-Time Spreadsheet (Medium)

1. Maintain a Google Sheet with current inventory
2. When sale occurs, update sheet immediately
3. Periodically sync sheet → Stripe metadata (manually or with script)

### Workflow 3: Webhook Automation (Advanced)

1. Set up webhook listener for `checkout.session.completed`
2. Parse line items from checkout session
3. Update Stripe metadata via API automatically
4. Log all changes to database for audit trail

## 🔑 Environment Variables

Ensure these are set:

```bash
# Netlify Functions
STRIPE_SECRET_KEY=sk_test_xxxxx  # or sk_live_xxxxx

# Frontend
VITE_STRIPE_PUBLISHABLE_KEY_TEST=pk_test_xxxxx
VITE_STRIPE_PUBLISHABLE_KEY_LIVE=pk_live_xxxxx
```

## 📚 Additional Resources

- [Stripe Products API](https://stripe.com/docs/api/products)
- [Stripe Metadata](https://stripe.com/docs/api/metadata)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe App Marketplace](https://marketplace.stripe.com)

---

**Last Updated:** December 29, 2025  
**Status:** Metadata-based inventory (manual updates required)

