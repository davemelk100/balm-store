# URGENT FIX: Netlify Functions Not Running

## The Problem

You're getting:
```
Error fetching product from Stripe: SyntaxError: Unexpected token '<', "<!DOCTYPE "...
```

This means the fetch to `/.netlify/functions/get-products` is returning HTML (a 404 page) instead of JSON.

## Root Cause

You're running **`npm run dev`** which only starts Vite (port 5173).

**Vite alone doesn't run Netlify functions!**

## Solution: Use `netlify dev` Instead

### Step 1: Stop Current Dev Server
In your terminal, press `Ctrl+C` to stop the current Vite server.

### Step 2: Start Netlify Dev Server
```bash
# In the project root directory (balm-store/)
netlify dev
```

**This will:**
- Start Vite on port 5173
- Start Netlify functions on port 8888
- Proxy everything together so functions work

### Step 3: Visit the Netlify Dev URL
Open your browser to:
```
http://localhost:8888
```

**NOT** `http://localhost:5173` (that's just Vite without functions)

## If `netlify` Command Not Found

Install the Netlify CLI:
```bash
npm install -g netlify-cli
```

Then authenticate:
```bash
netlify login
```

## Alternative: Temporary Workaround (For Testing Only)

If you can't use `netlify dev` right now, you can temporarily disable the Stripe fetch to use only local products:

### Option 1: Comment Out Stripe Fetch

In `Store.tsx` and `ProductDetail.tsx`, comment out the fetch:

```typescript
// Temporarily disable Stripe fetch for local testing
useEffect(() => {
  // const fetchProducts = async () => { ... };
  // fetchProducts();
  
  // Use local products only
  setProducts(storeProducts); // For Store.tsx
  setLoading(false);
}, []);
```

### Option 2: Use Deployed Function URL

If you've deployed to Netlify, you can use the production function URL:

```typescript
// In Store.tsx and ProductDetail.tsx
const response = await fetch("https://your-site.netlify.app/.netlify/functions/get-products");
```

But this requires your site to be deployed first.

## Recommended: Use `netlify dev`

This is the proper way to develop with Netlify functions locally.

### Full Steps:

```bash
# 1. Stop current server (Ctrl+C in terminal)

# 2. In project root
cd /Users/davemelkonian/Movies/repos/balm-store

# 3. Install Netlify CLI if needed
npm install -g netlify-cli

# 4. Start Netlify dev server
netlify dev

# 5. Visit http://localhost:8888 in browser
```

### What You Should See:

```
◈ Netlify Dev ◈
◈ Starting Netlify Dev with Vite
◈ Functions server is listening on 8888
◈ 
◈ Server now ready on http://localhost:8888
```

## Verification

Once `netlify dev` is running, test the function:

```bash
# In another terminal
curl http://localhost:8888/.netlify/functions/get-products
```

Should return JSON:
```json
{
  "products": [...]
}
```

## If Still Not Working

### Check netlify.toml
The functions directory should be correctly set:
```toml
[build]
  functions = "../netlify/functions"
```

✅ This is correct in your config

### Check Function File Exists
```bash
ls -la netlify/functions/get-products.js
```

Should show the file exists.

### Check Node Modules in Functions
```bash
cd netlify/functions
npm install
```

This installs the `stripe` package needed by the function.

## Current Status

❌ **Running:** Vite only (port 5173)
✅ **Need:** Netlify Dev (port 8888 with functions)

## Action Required

**Stop current dev server and run:**
```bash
netlify dev
```

Then visit: `http://localhost:8888`

---

**The product page will work once you use `netlify dev` instead of `npm run dev`!**

