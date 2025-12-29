# 🚀 Auto-Sync Quick Start - 5 Steps to Automatic Inventory

Follow these 5 steps to enable automatic inventory synchronization.

## Step 1: Deploy the Webhook Function (2 minutes)

```bash
cd /Users/davemelkonian/Movies/repos/balm-store

# Stage the new files
git add netlify/functions/stripe-webhook.js
git add netlify/functions/create-checkout-session.js

# Commit
git commit -m "Add automatic inventory sync via webhooks"

# Push to deploy
git push
```

**Wait:** 1-2 minutes for Netlify to deploy

**Verify:** Check Netlify dashboard shows the new `stripe-webhook` function

---

## Step 2: Configure Webhook in Stripe (5 minutes)

### 2.1 Get Your Netlify URL

```bash
# Option A: From netlify CLI
netlify status

# Option B: Check your Netlify dashboard
# It will be something like: https://your-site-name.netlify.app
```

### 2.2 Add Webhook Endpoint in Stripe

1. Go to: https://dashboard.stripe.com/test/webhooks
2. Click **"+ Add endpoint"**
3. Enter endpoint URL:
   ```
   https://YOUR-SITE-NAME.netlify.app/.netlify/functions/stripe-webhook
   ```
4. Click **"Select events"**
5. Search and select: **`checkout.session.completed`** ✅
6. Click **"Add events"**
7. Click **"Add endpoint"**

### 2.3 Copy the Webhook Signing Secret

After creating the endpoint, you'll see a page with:
- Endpoint URL
- **Signing secret** (starts with `whsec_...`)

**COPY THIS SECRET** - you'll need it in Step 3

---

## Step 3: Add Environment Variables to Netlify (2 minutes)

### 3.1 Via Netlify Dashboard (Easiest)

1. Go to: https://app.netlify.com
2. Select your site
3. Go to **Site configuration** → **Environment variables**
4. Click **"Add a variable"**
5. Add:
   ```
   Key: STRIPE_WEBHOOK_SECRET
   Value: whsec_xxxxxxxxxxxxx (paste the secret from Step 2.3)
   ```
6. Click **"Create variable"**

### 3.2 Via Netlify CLI (Alternative)

```bash
netlify env:set STRIPE_WEBHOOK_SECRET "whsec_xxxxxxxxxxxxx"
```

### 3.3 Redeploy to Use New Variable

```bash
netlify deploy --prod --build
```

---

## Step 4: Test the Webhook (5 minutes)

### 4.1 Test with Stripe CLI (Recommended)

```bash
# Terminal 1: Forward webhooks to local dev server
netlify dev

# Terminal 2: Listen for Stripe webhooks
stripe listen --forward-to http://localhost:8888/.netlify/functions/stripe-webhook

# Terminal 3: Trigger a test event
stripe trigger checkout.session.completed
```

**Expected output:**
```
✅ Webhook received
🛒 Checkout completed: cs_test_xxxxx
⚠️  No size information found in checkout metadata
```

This is expected for test events - real checkouts will have size info.

### 4.2 Test with Real Purchase (Test Mode)

1. Go to your store: https://your-site.netlify.app
2. Add a product to cart
3. Proceed to checkout
4. Use test card: **4242 4242 4242 4242**
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits
5. Complete purchase

**Check results:**

**In Netlify Function Logs:**
```bash
netlify logs:function stripe-webhook
```

Look for:
```
🛒 Checkout completed: cs_xxxxx
✅ Decremented inventory: Product Name - Size M - Qty 1
```

**In Stripe Dashboard:**
Go to your product → Check metadata → Verify stock decreased

---

## Step 5: Verify Everything Works (5 minutes)

### 5.1 Check Initial Inventory

```bash
# View current inventory via CLI
stripe products retrieve prod_xxxxx | grep -A 10 "metadata"
```

Or check in Stripe Dashboard → Products → Your Product → Metadata

Note the stock levels (e.g., `stock_M: 15`)

### 5.2 Make a Test Purchase

1. Add product to cart (select size M)
2. Complete checkout with test card
3. Wait 5-10 seconds

### 5.3 Verify Inventory Updated

```bash
# Check inventory again
stripe products retrieve prod_xxxxx | grep -A 10 "metadata"
```

Stock should have decreased (e.g., `stock_M: 14`)

### 5.4 Check Webhook Status in Stripe

1. Go to: https://dashboard.stripe.com/test/webhooks
2. Click on your webhook endpoint
3. View **"Events"** tab
4. Look for recent `checkout.session.completed` events
5. Click on one → Check **"Response"** shows `200 OK`

---

## ✅ Success Checklist

- [ ] Webhook function deployed to Netlify
- [ ] Webhook endpoint created in Stripe Dashboard
- [ ] `STRIPE_WEBHOOK_SECRET` added to Netlify
- [ ] Test webhook triggers successfully
- [ ] Real purchase decrements inventory
- [ ] Stripe webhook shows 200 OK responses

---

## 🎯 You're Done!

Your inventory now syncs automatically on every purchase. No manual updates needed!

### What Happens Now:

```
Customer adds Size M shirt to cart
    ↓
Customer completes checkout
    ↓ (instant)
Stripe fires webhook
    ↓ (2-3 seconds)
Your function updates inventory
    ↓
stock_M: 15 → 14
    ↓ (5 minutes max)
Frontend shows updated inventory
```

---

## 🔍 Monitoring & Maintenance

### Daily Checks (Optional)

```bash
# View recent webhook events
netlify logs:function stripe-webhook --follow

# Check inventory levels
stripe products list | jq '.data[] | {name, metadata}'
```

### Weekly Review

1. Check Stripe Dashboard → Webhooks for any failed events
2. Review inventory levels for low stock items
3. Restock items as needed (use CLI or dashboard)

---

## 🆘 Troubleshooting

### Webhook Not Receiving Events

**Check:**
1. Netlify function is deployed: `netlify functions:list`
2. URL is correct in Stripe Dashboard
3. Webhook secret matches Netlify env var

**Fix:**
```bash
# Redeploy
git push

# Or force deploy
netlify deploy --prod
```

### Inventory Not Updating

**Check Netlify logs:**
```bash
netlify logs:function stripe-webhook
```

**Common issues:**
- Size not being passed from frontend → Update cart to include size
- Product ID mismatch → Verify product IDs match Stripe
- Metadata keys incorrect → Check `stock_M` format

### Webhook Shows 400/500 Errors

**Check:**
1. `STRIPE_WEBHOOK_SECRET` is correct
2. Webhook signature verification passing
3. Product exists in Stripe
4. Metadata format is correct

**View detailed error:**
```bash
netlify logs:function stripe-webhook --level error
```

---

## 📚 Next Steps

1. ✅ **Test thoroughly** with multiple purchases
2. ✅ **Monitor for a few days** in test mode
3. ✅ **Add low stock alerts** (optional - see webhook code comments)
4. ✅ **Switch to production keys** when ready
5. ✅ **Set up monitoring** (Netlify alerts, etc.)

---

## 🔐 Going Live (Production)

When ready to go live:

1. Create webhook endpoint using **production** Stripe Dashboard
2. Update Netlify env vars with **production** keys:
   ```
   STRIPE_SECRET_KEY=sk_live_xxxxx
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx (production)
   ```
3. Test with small real purchase
4. Monitor closely for first few days

---

**Questions?** See:
- `WEBHOOK_AUTO_SYNC_SETUP.md` - Detailed setup guide
- `INVENTORY_SYNC_COMPARISON.md` - Comparison of methods
- `STRIPE_CLI_INVENTORY_GUIDE.md` - CLI commands for manual updates

**Last Updated:** December 29, 2025  
**Status:** Ready to implement!

