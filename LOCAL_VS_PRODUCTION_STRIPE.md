# Testing Stripe Locally vs Production

## ✅ Your Current Setup

Your `.env` file has:

```
STRIPE_SECRET_KEY=sk_test_51SfaUuFKiaEr26Zc...
STRIPE_PUBLISHABLE_KEY=pk_test_51SfaUuFKiaEr26Zc...
```

## 🏠 Testing Locally (Two Options)

### Option 1: Use Netlify CLI (Recommended)

This tests the actual Netlify function locally:

```bash
# Stop your current dev server (Ctrl+C in terminal 19)

# Run with Netlify CLI
netlify dev
```

This will:

- Start frontend at `http://localhost:8888` (not 5173)
- Read your `.env` file automatically
- Make functions available at `/.netlify/functions/...`
- Everything works as it will in production

### Option 2: Keep Using Vite Dev Server

If you want to keep using `npm run dev` on port 5173:

The function won't work locally, but that's okay! You can:

1. Test everything else locally
2. Deploy to Netlify to test payments
3. Use Netlify's test cards on the deployed site

## 🌐 For Your Deployed Site (Required)

Your `.env` file does NOT get deployed (it's gitignored for security).

**You MUST add the key to Netlify Dashboard:**

1. Go to https://app.netlify.com/
2. Select your BALM Store site
3. Go to: **Site configuration** → **Environment variables**
4. Click **Add a variable**
5. Add:
   - Key: `STRIPE_SECRET_KEY`
   - Value: `sk_test_51SfaUuFKiaEr26ZcfbvuMzvhEppaDktng2q6i698rXtsdlwdquLFpPfJzczUbTkYCxnVzSdGlG3XGFU5FdyM3nbI00WebWCSeO`
6. Click **Save**
7. **Redeploy** your site

## 🧪 Quick Test Commands

### Test with Netlify CLI:

```bash
cd /Users/davemelkonian/Movies/repos/balm-store
netlify dev
```

Then visit `http://localhost:8888` and try checkout.

### Just deploy and test on live site:

```bash
# Make sure changes are committed
git add .
git commit -m "Add Stripe checkout function"
git push

# Or manually trigger deploy in Netlify Dashboard
```

## 🎯 Which Should You Use?

**For quick testing right now:**

- Just deploy to Netlify and test there (fastest)
- Use test card: `4242 4242 4242 4242`

**For ongoing development:**

- Use `netlify dev` for full testing
- Automatically reads `.env`
- Tests functions + frontend together

## ⚡ Quick Deploy Instructions

Since your keys are ready, just:

1. **Add to Netlify Dashboard** (one-time setup):

   - Netlify Dashboard → Site → Environment variables
   - Add `STRIPE_SECRET_KEY` = your key from `.env`

2. **Push to GitHub** (if not already):

   ```bash
   git add .
   git commit -m "Add Stripe checkout function"
   git push
   ```

3. **Test** on your deployed site with test card!

---

**Bottom Line:** Your `.env` is perfect for local dev, but Netlify's deployed site needs the key in its Dashboard! 🎯
