# Fix: Stripe Checkout Not Configured

You're seeing this error because the `STRIPE_SECRET_KEY` environment variable is not set in your Netlify production environment.

## Quick Fix (5 minutes) ⚡

### Option 1: Via Netlify Dashboard (Recommended)

1. **Go to your Netlify site:**
   - Visit: https://app.netlify.com
   - Select your BALM Store site

2. **Navigate to Environment Variables:**
   - Click on **Site configuration** (or **Site settings**)
   - Click on **Environment variables** in the left sidebar

3. **Add the Stripe Secret Key:**
   - Click **"Add a variable"** or **"Add environment variable"**
   - **Key:** `STRIPE_SECRET_KEY`
   - **Value:** `sk_test_51SfaUuFKiaEr26ZcfbvuMzvhEppaDktng2q6i698rXtsdlwdquLFpPfJzczUbTkYCxnVzSdGlG3XGFU5FdyM3nbI00WebWCSeO`
   - **Scopes:** Select **"All"** (or both "Production" and "Deploy previews")
   - Click **"Save"**

4. **Redeploy your site:**
   - Go to **Deploys** tab
   - Click **"Trigger deploy"** → **"Deploy site"**
   - Wait for the build to complete (usually 1-2 minutes)

5. **Test it:**
   - Visit your site
   - Add items to cart
   - Click checkout
   - The error should be gone! ✅

---

### Option 2: Via Netlify CLI

If you prefer using the command line:

```bash
# First, reinstall Netlify CLI (there seems to be an issue with your current installation)
npm install -g netlify-cli

# Login to Netlify
netlify login

# Link to your site (run this in your project root)
cd /Users/davemelkonian/Movies/repos/balm-store
netlify link

# Set the environment variable
netlify env:set STRIPE_SECRET_KEY "sk_test_51SfaUuFKiaEr26ZcfbvuMzvhEppaDktng2q6i698rXtsdlwdquLFpPfJzczUbTkYCxnVzSdGlG3XGFU5FdyM3nbI00WebWCSeO"

# Trigger a new deploy
netlify deploy --prod
```

---

## Understanding the Issue

### What's Happening?

The Netlify serverless function at `netlify/functions/create-checkout-session.js` checks if `STRIPE_SECRET_KEY` exists:

```javascript
// Line 14-25
if (!process.env.STRIPE_SECRET_KEY) {
  return {
    statusCode: 503,
    body: JSON.stringify({ 
      error: 'Stripe checkout is not yet configured. Payment processing is currently unavailable.'
    })
  };
}
```

### Why Does Local Work But Production Doesn't?

Your `netlify.toml` file has this:

```toml
[context.dev.environment]
  STRIPE_SECRET_KEY = "sk_test_51SfaUu..."
```

This only works for **local development** (`netlify dev`), not for production deployments.

---

## Testing Your Fix

### Test Cards (Test Mode Only)

Once you've set the environment variable and redeployed:

- **Successful payment:** `4242 4242 4242 4242`
- **Declined payment:** `4000 0000 0000 0002`
- **3D Secure:** `4000 0025 0000 3155`

Use any:
- Future expiry date (e.g., 12/25)
- Any 3-digit CVC (e.g., 123)
- Any postal code (e.g., 12345)

---

## Going to Production (When Ready)

When you're ready to accept real payments:

1. **Get your Live Stripe Keys:**
   - Go to: https://dashboard.stripe.com/apikeys
   - Toggle from **Test mode** to **Live mode**
   - Copy your **Secret key** (starts with `sk_live_`)

2. **Update the Environment Variable:**
   - Go back to Netlify → Environment variables
   - Update `STRIPE_SECRET_KEY` with your live key
   - Redeploy

3. **Update Frontend (if needed):**
   - If you're using `VITE_STRIPE_PUBLIC_KEY`, also update that with `pk_live_...`

---

## Troubleshooting

### Still seeing the error after deploying?

1. **Clear cache and redeploy:**
   - Netlify Dashboard → Deploys
   - **Trigger deploy** → **"Clear cache and deploy site"**

2. **Check the deploy logs:**
   - Look for any errors during build
   - Verify the function was deployed successfully

3. **Check the function logs:**
   - Netlify Dashboard → Functions
   - Click on `create-checkout-session`
   - Check recent invocations for errors

### Error: "No such API key"

- Double-check you copied the **entire** key including the `sk_test_` prefix
- Make sure there are no extra spaces at the beginning or end

### Function returns 404

- Verify `netlify.toml` has: `functions = "../netlify/functions"`
- Check that `create-checkout-session.js` exists in the functions folder
- Redeploy the site

---

## Need Help?

If you're still having issues:

1. Check your Netlify deploy logs
2. Check your browser console for errors
3. Verify your Stripe dashboard is in Test mode
4. Make sure you saved the environment variable with the correct key name: `STRIPE_SECRET_KEY` (no typos!)

---

## Summary

**The fix is simple:**

1. Add `STRIPE_SECRET_KEY` to Netlify environment variables
2. Redeploy your site
3. Test with card `4242 4242 4242 4242`
4. Done! ✅

**Current test key to use:**
```
sk_test_51SfaUuFKiaEr26ZcfbvuMzvhEppaDktng2q6i698rXtsdlwdquLFpPfJzczUbTkYCxnVzSdGlG3XGFU5FdyM3nbI00WebWCSeO
```

This is your **test mode** key (safe to use for testing). Switch to live keys only when you're ready to accept real payments.

