# How to Run the BALM Store Locally

## ⚠️ IMPORTANT: Use `netlify dev`, NOT `npm run dev`

Since we're using Stripe inventory via Netlify functions, you **must** run the Netlify dev server to have access to the functions.

## Quick Start

### 1. Install Netlify CLI (One Time Only)
```bash
npm install -g netlify-cli
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
cd frontend
npm install

# Install Netlify function dependencies
cd ../netlify/functions
npm install

# Return to project root
cd ../..
```

### 3. Start the Development Server
```bash
# From project root
netlify dev
```

### 4. Open Your Browser
```
http://localhost:8888
```

**NOT** `http://localhost:5173` - that's just Vite without the functions!

## What `netlify dev` Does

```
┌─────────────────────────────────────────┐
│         netlify dev (port 8888)         │
├─────────────────────────────────────────┤
│  ┌─────────────────┐  ┌──────────────┐ │
│  │  Vite Frontend  │  │   Netlify    │ │
│  │   (port 5173)   │  │  Functions   │ │
│  └─────────────────┘  └──────────────┘ │
└─────────────────────────────────────────┘
```

- Starts Vite dev server (frontend)
- Starts Netlify functions server
- Proxies everything through port 8888
- Makes `/.netlify/functions/*` available

## Why NOT `npm run dev`?

Running `npm run dev` in the frontend folder:
- ❌ Only starts Vite on port 5173
- ❌ No Netlify functions available
- ❌ Fetch to `/.netlify/functions/get-products` returns 404
- ❌ Products won't load from Stripe
- ❌ You'll see: `Error: Unexpected token '<', "<!DOCTYPE "...`

## Development Workflow

### Normal Development
```bash
# Start dev server
netlify dev

# Open browser to http://localhost:8888
# Make changes to frontend code
# Hot reload works automatically
```

### Backend Development (if needed)
```bash
# In another terminal
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python -m uvicorn app.main:app --reload
```

Backend runs on port 8000 (for auth endpoints).

## Troubleshooting

### Issue: `netlify: command not found`

**Solution:**
```bash
npm install -g netlify-cli
```

### Issue: Functions not working

**Solution:**
```bash
# Install function dependencies
cd netlify/functions
npm install
cd ../..

# Restart netlify dev
netlify dev
```

### Issue: Port 8888 already in use

**Solution:**
```bash
# Kill process on port 8888
lsof -ti:8888 | xargs kill -9

# Or specify different port
netlify dev --port 8889
```

### Issue: STRIPE_SECRET_KEY not found

**Solution:**

The key is already in `netlify.toml`:
```toml
[context.dev.environment]
  STRIPE_SECRET_KEY = "sk_test_..."
```

If you need to change it:
1. Update `netlify.toml`
2. Or set environment variable:
   ```bash
   export STRIPE_SECRET_KEY=sk_test_your_key
   netlify dev
   ```

## Testing Functions Directly

```bash
# While netlify dev is running, in another terminal:
curl http://localhost:8888/.netlify/functions/get-products
```

Should return JSON with products.

## Production Build

```bash
# Build frontend
cd frontend
npm run build

# Deploy to Netlify
netlify deploy --prod
```

## Scripts Comparison

| Command | What It Does | Use When |
|---------|--------------|----------|
| `npm run dev` | Starts Vite only (port 5173) | ❌ Don't use (no functions) |
| `netlify dev` | Starts everything (port 8888) | ✅ Always use for development |
| `npm run build` | Builds for production | Before deploying |
| `netlify deploy` | Deploys to Netlify | Publishing changes |

## Environment Variables

### Local Development
Defined in `netlify.toml`:
```toml
[context.dev.environment]
  STRIPE_SECRET_KEY = "sk_test_..."
```

### Production
Set in Netlify Dashboard:
1. Site settings → Environment variables
2. Add `STRIPE_SECRET_KEY` with your live or test key

## Verification Checklist

Before starting development, verify:

- [ ] Netlify CLI installed: `netlify --version`
- [ ] Frontend dependencies: `cd frontend && npm install`
- [ ] Function dependencies: `cd netlify/functions && npm install`
- [ ] Stripe key in `netlify.toml`
- [ ] Start with: `netlify dev`
- [ ] Visit: `http://localhost:8888`
- [ ] Test function: `curl http://localhost:8888/.netlify/functions/get-products`

## Quick Reference

```bash
# Install everything (first time)
npm install -g netlify-cli
cd frontend && npm install
cd ../netlify/functions && npm install
cd ../..

# Start development
netlify dev

# Visit in browser
open http://localhost:8888
```

---

**Always use `netlify dev` for local development!**

This ensures Netlify functions work and products load from Stripe correctly.

