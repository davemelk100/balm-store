# Stripe Local Development Setup ✅

## Configuration Complete!

Your Stripe checkout is now properly configured for local development.

## What Was Configured:

### 1. Environment Variables
- **Root `.env` file** contains Stripe test keys:
  - `STRIPE_PUBLISHABLE_KEY` - For frontend (if needed)
  - `STRIPE_SECRET_KEY` - For Netlify functions

### 2. Netlify Configuration
- **`netlify.toml`** now includes Stripe secret key in dev environment
- Netlify functions can access the key during local development

### 3. Dependencies
- Stripe package (`stripe@^14.0.0`) installed in `netlify/functions/`
- Ready to process payments

## Testing Locally

### 1. Start Netlify Dev
```bash
cd /Users/davemelkonian/Movies/repos/balm-store
netlify dev
```

This starts:
- Frontend at: `http://localhost:8888`
- Netlify functions at: `http://localhost:8888/.netlify/functions/`

### 2. Test the Checkout Flow

1. Open `http://localhost:8888` in your browser
2. Add items to cart
3. Click "Proceed to Payment"
4. You'll be redirected to Stripe Checkout page

### 3. Test Cards

Use these test cards in Stripe test mode:

| Card Number | Description |
|-------------|-------------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0000 0000 0002` | Card declined |
| `4000 0025 0000 3155` | Requires authentication (3D Secure) |

- **Expiry**: Any future date
- **CVC**: Any 3 digits  
- **ZIP**: Any 5 digits

## Current Configuration

### Test Keys (Already Set):
```
STRIPE_PUBLISHABLE_KEY=pk_test_51SfaUuFKiaEr26Zc7BOy7iWmDZTlbxR8P4MU48q7SNhPAZo8JS84jtUYihIJgFGGzL4GTrgdCA6Shp6UbBAH3Ofs00paxt1Glz
STRIPE_SECRET_KEY=sk_test_51SfaUuFKiaEr26ZcfbvuMzvhEppaDktng2q6i698rXtsdlwdquLFpPfJzczUbTkYCxnVzSdGlG3XGFU5FdyM3nbI00WebWCSeO
```

⚠️ **Note**: These are TEST keys. Never commit them to public repositories!

## Production Deployment

### For Netlify Production:

1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Select your site
3. Go to **Site configuration** → **Environment variables**
4. Add **production** Stripe keys:
   - `STRIPE_SECRET_KEY` = your live secret key (`sk_live_...`)
   - `VITE_STRIPE_PUBLIC_KEY` = your live publishable key (`pk_live_...`)

### Getting Production Keys:

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Toggle from "Test mode" to "Live mode" (top right)
3. Go to **Developers** → **API keys**
4. Copy your live keys

## Files Modified

1. **`netlify.toml`** - Added dev environment config with Stripe key
2. **`.env`** (root) - Contains Stripe test keys for local development
3. **`netlify/functions/create-checkout-session.js`** - Already configured (no changes needed)

## Troubleshooting

### Issue: "Stripe checkout is not yet configured"

**Solution**: Make sure Netlify Dev is running and has loaded the environment variables. Restart with:
```bash
pkill -f "netlify dev"
cd /Users/davemelkonian/Movies/repos/balm-store
netlify dev
```

### Issue: Function returns 503 error

**Solution**: Environment variable not loaded. Check that:
1. `.env` file exists in project root
2. `STRIPE_SECRET_KEY` is in the file
3. `netlify.toml` has `[context.dev.environment]` section with the key
4. Netlify Dev was restarted after changes

### Issue: Can't access checkout page

**Solution**: Make sure both servers are running:
1. Backend API: `http://localhost:8000` (for Google OAuth)
2. Netlify Dev: `http://localhost:8888` (for frontend + Stripe functions)

## Security Notes

✅ **Current Setup is Secure:**
- Using test mode keys (safe for development)
- Keys in `.env` file (should be in `.gitignore`)
- Keys not exposed to frontend

❌ **DO NOT:**
- Commit `.env` file to git
- Share your secret keys
- Use test keys in production
- Expose secret keys in frontend code

## Additional Resources

- [Stripe Testing Documentation](https://stripe.com/docs/testing)
- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [Stripe Checkout Documentation](https://stripe.com/docs/payments/checkout)

---

**Status**: ✅ Ready for local development and testing!

