# Fixing "Stripe Not Configured" Error in Cart Checkout

## The Issue

When clicking "Proceed to Payment" from the cart/checkout page, you see:

> "Stripe checkout is not yet configured. Payment processing is currently unavailable."

## Why This Happens

You have TWO different Stripe integrations:

1. **✅ Stripe Buy Buttons** - Working on product detail pages

   - Uses: `STRIPE_PUBLISHABLE_KEY` (already configured)
   - Direct Stripe-hosted checkout

2. **❌ Cart Checkout** - Not configured yet
   - Uses: `STRIPE_SECRET_KEY` (missing)
   - Netlify function creates custom checkout sessions

## Solution: Add Stripe Secret Key

### Step 1: Get Your Stripe Secret Key

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Copy your **Secret key** (starts with `sk_test_` for test mode)
   - ⚠️ **NEVER** share this key publicly
   - ⚠️ Keep it secret - it has full account access

### Step 2: For Local Development

Create `netlify/.env` file:

```bash
# Stripe Secret Key for Cart Checkout
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
```

### Step 3: For Netlify Production

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Select your site
3. Go to **Site configuration** → **Environment variables**
4. Add new variable:
   - **Key**: `STRIPE_SECRET_KEY`
   - **Value**: Your secret key from Stripe
   - **Scope**: All scopes (or Production, Deploy Preview, Branch deploys as needed)
5. Click **Save**
6. Redeploy your site for changes to take effect

### Step 4: Test the Flow

1. Add items to cart
2. Go to checkout
3. Click "Proceed to Payment"
4. Should redirect to Stripe checkout

## Two Ways to Buy Now

After this fix, customers can purchase in two ways:

### Option 1: Direct Buy (Single Product)

- Product detail page → "Buy Now" button
- Goes directly to Stripe for that product
- Uses Buy Button IDs

### Option 2: Cart Checkout (Multiple Products)

- Add products to cart → Checkout page
- Review cart → "Proceed to Payment"
- Creates custom checkout session
- Uses Secret Key

## Environment Variables Summary

```bash
# Frontend (.env in frontend/ directory)
VITE_STRIPE_PUBLISHABLE_KEY_TEST=pk_test_xxx  # For Buy Buttons
VITE_STRIPE_PUBLISHABLE_KEY_LIVE=pk_live_xxx  # Production Buy Buttons

# Backend/Netlify (netlify/.env file)
STRIPE_SECRET_KEY=sk_test_xxx  # For Cart Checkout (test)
# or
STRIPE_SECRET_KEY=sk_live_xxx  # For Production Cart Checkout
```

## Security Notes

✅ **Safe to expose**:

- Publishable keys (`pk_test_`, `pk_live_`)
- Buy Button IDs

❌ **NEVER expose**:

- Secret keys (`sk_test_`, `sk_live_`)
- Webhook secrets

## Testing Cart Checkout

Use Stripe test cards:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- Any future expiry + any CVC

## Common Issues

### "Stripe not configured" persists

- Check: Environment variable is set correctly
- Check: Variable name is exactly `STRIPE_SECRET_KEY`
- Check: No extra spaces in the key
- Try: Redeploy the site

### Function not found

- Check: Netlify functions are deployed
- Check: `netlify/functions/create-checkout-session.js` exists
- Try: Run `netlify dev` locally first

### Invalid API key

- Check: Using correct key (test vs live)
- Check: Key starts with `sk_test_` or `sk_live_`
- Check: Key copied completely (they're long!)

## Quick Fix for Local Testing

```bash
# In project root
cd netlify
echo 'STRIPE_SECRET_KEY=sk_test_51SfaUuFKiaEr26ZcfbvuMzvhEppaDktng2q6i698rXtsdlwdquLFpPfJzczUbTkYCxnVzSdGlG3XGFU5FdyM3nbI00WebWCSeO' > .env

# Test with Netlify CLI
netlify dev
```

Then visit `http://localhost:8888` and test the cart checkout flow.

## What Each Key Does

| Key Type      | Starts With            | Used For               | Location         |
| ------------- | ---------------------- | ---------------------- | ---------------- |
| Publishable   | `pk_test_`, `pk_live_` | Buy Buttons, Frontend  | Frontend `.env`  |
| Secret        | `sk_test_`, `sk_live_` | Cart Checkout, Backend | Netlify env vars |
| Buy Button ID | `buy_btn_`             | Product Buy Buttons    | Product data     |

## Next Steps

1. ✅ Get Stripe Secret Key from dashboard
2. ✅ Add to `netlify/.env` for local testing
3. ✅ Add to Netlify environment variables for production
4. ✅ Test cart checkout flow
5. ✅ Switch to live keys when ready for production

---

**TL;DR**: You need to set `STRIPE_SECRET_KEY` environment variable in Netlify to enable cart checkout. Get it from Stripe Dashboard → API Keys.
