# 🔄 Automatic Inventory Sync with Stripe Webhooks

This guide shows you how to set up **true automatic inventory synchronization** - inventory will update automatically when customers complete purchases.

## 🎯 How It Works

```
Customer completes checkout
    ↓
Stripe fires webhook: checkout.session.completed
    ↓
Netlify function receives webhook
    ↓
Function extracts: product ID, size, quantity
    ↓
Function decrements inventory in Stripe metadata
    ↓
✅ Inventory automatically updated!
```

## 📋 Prerequisites

- Stripe account
- Netlify deployment
- Products already set up with inventory metadata

## 🚀 Setup Instructions

### Step 1: Install Dependencies

```bash
cd netlify/functions
npm install stripe
```

### Step 2: Create Webhook Endpoint

The webhook handler has been created at:
```
netlify/functions/stripe-webhook.js
```

This function will be available at:
```
https://your-site.netlify.app/.netlify/functions/stripe-webhook
```

### Step 3: Get Your Webhook Signing Secret

1. Go to [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **+ Add endpoint**
3. Enter your endpoint URL:
   ```
   https://your-site.netlify.app/.netlify/functions/stripe-webhook
   ```
4. Select events to listen for:
   - `checkout.session.completed` ✅ (Required)
   - `payment_intent.succeeded` (Optional)
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_...`)

### Step 4: Add Environment Variables in Netlify

1. Go to Netlify Dashboard → Your Site → Environment Variables
2. Add:
   ```
   STRIPE_SECRET_KEY=sk_test_xxxxx
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```

### Step 5: Deploy

```bash
git add netlify/functions/stripe-webhook.js
git commit -m "Add automatic inventory sync webhook"
git push
```

Netlify will automatically deploy the new function.

### Step 6: Test the Webhook

#### Test in Stripe Dashboard

1. Go to Stripe Dashboard → Webhooks
2. Click on your webhook endpoint
3. Click **Send test webhook**
4. Select `checkout.session.completed`
5. Click **Send test webhook**
6. Check the response - should be 200 OK

#### Test with Stripe CLI

```bash
# Forward webhooks to local development
stripe listen --forward-to http://localhost:8888/.netlify/functions/stripe-webhook

# In another terminal, trigger a test
stripe trigger checkout.session.completed
```

#### Test with Real Purchase (Test Mode)

1. Add product to cart on your site
2. Complete checkout using test card: 4242 4242 4242 4242
3. Check Netlify function logs
4. Verify inventory was decremented in Stripe Dashboard

## ⚠️ Important: Passing Size Information

For the webhook to know which size was purchased, you need to include size in the checkout session:

### Option 1: In Checkout Session Metadata

When creating the checkout session, add size to metadata:

```javascript
// In your create-checkout-session function
const session = await stripe.checkout.sessions.create({
  line_items: [{
    price: priceId,
    quantity: 1,
  }],
  metadata: {
    size: 'M',  // Add the selected size here
  },
  mode: 'payment',
  success_url: successUrl,
  cancel_url: cancelUrl,
});
```

### Option 2: In Price Metadata

Or create a separate price for each size with metadata:

```bash
# Create price with size metadata
stripe prices create \
  --product prod_xxxxx \
  --unit-amount 2500 \
  --currency usd \
  --metadata[size]=M
```

## 🔍 Monitoring & Debugging

### View Webhook Logs in Netlify

1. Netlify Dashboard → Functions
2. Click on `stripe-webhook`
3. View logs in real-time

### View Webhook Logs in Stripe

1. Stripe Dashboard → Webhooks
2. Click on your endpoint
3. View recent events and responses

### Enable Detailed Logging

The webhook function logs:
- ✅ Successful inventory decrements
- ⚠️ Low stock warnings (≤5 items)
- ⚠️ Out of stock alerts
- ❌ Errors and failures

## 🧪 Testing Commands

### Test Webhook Locally

```bash
# Terminal 1: Start Netlify dev server
netlify dev

# Terminal 2: Forward Stripe webhooks
stripe listen --forward-to http://localhost:8888/.netlify/functions/stripe-webhook

# Terminal 3: Trigger test event
stripe trigger checkout.session.completed
```

### Manual Test via curl

```bash
# Test webhook endpoint is accessible
curl -X POST https://your-site.netlify.app/.netlify/functions/stripe-webhook
```

## 📊 How It Updates Inventory

### Example Flow

**Before:**
```
Product: BALM T-Shirt
stock_M: 15
```

**Customer purchases 2 Medium shirts**

**Webhook fires → Function executes:**
1. Receives `checkout.session.completed` event
2. Extracts: Product ID, Size: M, Quantity: 2
3. Retrieves current `stock_M: 15`
4. Calculates new stock: 15 - 2 = 13
5. Updates Stripe: `stock_M: 13`

**After:**
```
Product: BALM T-Shirt
stock_M: 13
```

## 🔐 Security Features

- ✅ **Signature verification** - Ensures webhook is from Stripe
- ✅ **Secret key** - Stored securely in Netlify environment
- ✅ **Method validation** - Only accepts POST requests
- ✅ **Error handling** - Gracefully handles failures

## ⚙️ Advanced Configuration

### Handle Multiple Sizes in One Order

The function automatically handles orders with multiple items:

```javascript
// Customer buys: 2x Medium, 1x Large
// Function will:
// 1. Decrement stock_M by 2
// 2. Decrement stock_L by 1
```

### Set Low Stock Alerts

The function logs warnings when stock is low. To get email alerts, you can extend it:

```javascript
if (newStock <= 5) {
  // Send email notification
  await sendLowStockAlert(productName, size, newStock);
}
```

### Prevent Negative Stock

The function uses `Math.max(0, currentStock - quantity)` to prevent negative values:

```javascript
const newStock = Math.max(0, currentStock - quantity);
```

## 🐛 Troubleshooting

### Webhook Not Receiving Events

1. Check webhook URL is correct in Stripe Dashboard
2. Verify site is deployed (not just local)
3. Check function is deployed: `netlify functions:list`
4. Verify webhook secret is correct in Netlify env vars

### Inventory Not Updating

1. Check Netlify function logs for errors
2. Verify size is being passed in checkout metadata
3. Ensure product metadata keys match (e.g., `stock_M` not `stock-M`)
4. Check product ID is correct

### "Webhook signature verification failed"

- Verify `STRIPE_WEBHOOK_SECRET` is correct
- Ensure you're using the signing secret from the webhook endpoint (not API keys)
- Check the raw body is being passed correctly

### Inventory Going Negative

The function prevents this, but if you see negative values:
- Old webhooks may have been replayed
- Manual updates may have been made
- Check for duplicate webhook processing

## 📈 Monitoring Best Practices

### Daily Checks

```bash
# Check inventory levels via CLI
stripe products list | jq '.data[] | {name, metadata}'

# Or use the inventory report script
./inventory-report.py
```

### Set Up Notifications

Consider adding alerts when:
- Stock reaches 0 (out of stock)
- Stock ≤ 5 (low stock warning)
- Webhook fails to process
- Negative stock detected (error condition)

## 🔄 Comparison: Manual vs Automatic

| Feature | Manual Script | Webhook Auto-Sync |
|---------|---------------|-------------------|
| Triggers | You run it manually | Automatic on purchase |
| Timing | Whenever you remember | Instant |
| Accuracy | Prone to human error | Accurate |
| Scalability | Tedious at scale | Handles any volume |
| Overselling Risk | High | Low |
| Setup Complexity | Low | Medium |

## 📚 Related Files

- `netlify/functions/stripe-webhook.js` - The webhook handler
- `netlify/functions/get-products.js` - Fetches products with inventory
- `STRIPE_CLI_INVENTORY_GUIDE.md` - CLI commands for manual updates
- `INVENTORY_TRACKING_GUIDE.md` - General inventory guide

## 🎯 Next Steps

1. ✅ Deploy the webhook function
2. ✅ Configure webhook in Stripe Dashboard
3. ✅ Add environment variables to Netlify
4. ✅ Update checkout to pass size information
5. ✅ Test with a test purchase
6. ✅ Monitor for a few days
7. ✅ Switch to production keys when ready

---

**Status:** Production-ready automatic inventory sync  
**Last Updated:** December 29, 2025  
**Maintenance:** Monitor webhook logs weekly

