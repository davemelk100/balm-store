# Testing Stripe Locally with Netlify Functions

## The Issue

You're seeing "Stripe checkout is not yet configured" because:

1. You're running `npm run dev` which starts Vite on port 5173
2. The Stripe checkout needs Netlify serverless functions to work
3. Regular `npm run dev` doesn't run the Netlify functions

## Solution: Use Netlify Dev

### Step 1: Install Netlify CLI Dependencies

```bash
# Navigate to the functions directory
cd /Users/davemelkonian/Movies/repos/balm-store/netlify/functions

# Install the dependencies (includes stripe package)
npm install
```

### Step 2: Reinstall Netlify CLI (Optional - if it's broken)

```bash
# If netlify command is not working properly
npm uninstall -g netlify-cli
npm install -g netlify-cli
```

### Step 3: Start Netlify Dev

```bash
# Navigate back to project root
cd /Users/davemelkonian/Movies/repos/balm-store

# Stop your current npm run dev (Ctrl+C in the terminal)

# Start Netlify Dev instead
netlify dev
```

This will:
- Start your Vite dev server on port 5173
- Proxy it through Netlify Dev on port 8888
- Make functions available at `http://localhost:8888/.netlify/functions/`

### Step 4: Access Your Site

Open your browser and go to:
```
http://localhost:8888
```

NOT `http://localhost:5173` - that won't have the functions!

---

## How It Works

### Regular `npm run dev` (What you're doing now)
```
Frontend: http://localhost:5173
Functions: ❌ Not available
Stripe: ❌ Won't work
```

### `netlify dev` (What you should use)
```
Frontend: http://localhost:8888 (proxies to 5173)
Functions: ✅ http://localhost:8888/.netlify/functions/
Stripe: ✅ Works with local env vars
```

---

## Environment Variables for Local Testing

Your `netlify.toml` already has the Stripe test key for local development:

```toml
[context.dev.environment]
  STRIPE_SECRET_KEY = "sk_test_51SfaUu..."
```

This is automatically loaded when you run `netlify dev`.

---

## Quick Testing Checklist

1. ✅ Install function dependencies: `cd netlify/functions && npm install`
2. ✅ Stop current Vite dev server (Ctrl+C)
3. ✅ Run `netlify dev` from project root
4. ✅ Open `http://localhost:8888` (not 5173!)
5. ✅ Add items to cart and checkout
6. ✅ Use test card: `4242 4242 4242 4242`

---

## Alternative: Use Production Site

If you don't want to test locally, just:

1. Set up Stripe on Netlify (see STRIPE_FIX.md)
2. Test on your deployed site
3. Use test card: `4242 4242 4242 4242`

---

## Common Issues

### "Cannot find module 'stripe'"

**Solution:** Install dependencies in the functions folder:
```bash
cd netlify/functions
npm install
```

### Port 8888 already in use

**Solution:** Kill the process or use a different port:
```bash
netlify dev --port 9999
```

### Functions not found (404)

**Solution:** Make sure you're running from the project root, not the frontend folder:
```bash
cd /Users/davemelkonian/Movies/repos/balm-store
netlify dev
```

### Still seeing "not configured" error

**Solution:** Check that `netlify.toml` has the Stripe key in the `[context.dev.environment]` section.

---

## Workflow

### For Local Development with Stripe:
```bash
cd /Users/davemelkonian/Movies/repos/balm-store
netlify dev
# Opens on http://localhost:8888
```

### For Local Development without Stripe (faster):
```bash
cd /Users/davemelkonian/Movies/repos/balm-store/frontend
npm run dev
# Opens on http://localhost:5173
# But checkout won't work
```

---

## Summary

**To test Stripe locally:**
1. Run `netlify dev` instead of `npm run dev`
2. Use `http://localhost:8888` instead of `http://localhost:5173`
3. The Stripe test key from `netlify.toml` will be automatically loaded

**To test Stripe in production:**
1. Add `STRIPE_SECRET_KEY` to Netlify environment variables (see STRIPE_FIX.md)
2. Redeploy your site
3. Test on your live URL

That's it! 🎉

