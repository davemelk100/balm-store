# 🎯 Quick Netlify CLI Test Instructions

Your Stripe keys are in `.env` and ready to go! Here's how to test with Netlify CLI:

## Current Setup

✅ Vite dev server running on port 5173  
✅ Backend running on port 8000  
✅ Stripe keys in `.env`  
✅ Netlify function created

## Simple Test with Netlify CLI

Since Vite is already running on port 5173, just run this command in a NEW terminal:

```bash
cd /Users/davemelkonian/Movies/repos/balm-store
netlify dev
```

**What will happen:**

- Netlify Dev will detect your Vite server on port 5173
- It will proxy it through port 8888
- Functions will be available at `/.netlify/functions/...`
- Your `.env` file will be loaded automatically

## Then Test Checkout

1. Go to **http://localhost:8888** (not 5173!)
2. Add items to cart
3. Go to checkout
4. Click "Proceed to Payment"
5. Use test card: `4242 4242 4242 4242`

## If It Still Serves Static Files

If Netlify Dev serves the `dist` folder instead of proxying Vite, just:

1. Stop Netlify Dev (Ctrl+C)
2. Delete the dist folder temporarily:
   ```bash
   rm -rf frontend/dist
   ```
3. Run `netlify dev` again

It will then detect the Vite server!

## Alternative: Deploy and Test Online

If local testing is tricky, just:

1. Push to GitHub
2. Add `STRIPE_SECRET_KEY` to Netlify Dashboard
3. Test on your live site

Both methods work! Choose whichever is easier for you. 🚀
