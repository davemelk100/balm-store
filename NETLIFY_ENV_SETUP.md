# Netlify Environment Variables Setup

This guide shows exactly what environment variables you need to configure in Netlify for the BALM Store frontend.

## Required Environment Variables

### 1. VITE_API_URL (Required)
**Purpose**: Backend API endpoint URL

**Development**: `http://localhost:8000`
**Production**: `https://your-backend.railway.app` or your backend URL

**Where to find**:
- If using Railway: Go to your Railway project → Backend service → Settings → Public Domain
- Copy the full URL (e.g., `https://balm-store-production.up.railway.app`)

**Example**:
```
VITE_API_URL=https://balm-store-production.up.railway.app
```

---

## Optional Environment Variables

### 2. VITE_STRIPE_PUBLIC_KEY (Optional - for payments)
**Purpose**: Stripe publishable key for payment processing

**Test Mode**: `pk_test_...`
**Live Mode**: `pk_live_...`

**Where to find**:
1. Go to https://dashboard.stripe.com/apikeys
2. Copy the "Publishable key"
3. Use test key for testing, live key for production

**Example**:
```
VITE_STRIPE_PUBLIC_KEY=pk_live_51234567890abcdef
```

---

## How to Add Variables in Netlify

### Method 1: Via Netlify Dashboard (Recommended)

1. **Log in to Netlify**: https://app.netlify.com
2. **Select your site**
3. **Go to Site configuration** (or Site settings)
4. **Navigate to**: Environment variables
5. **Click**: "Add a variable" or "Add environment variable"
6. **Add each variable**:
   - **Key**: `VITE_API_URL`
   - **Value**: Your backend URL
   - **Scopes**: Select "All" (or "Production" and "Deploy previews")
7. **Save**
8. **Redeploy** your site (Deploys → Trigger deploy → Deploy site)

### Method 2: Via Netlify CLI

```bash
# Install Netlify CLI if you haven't
npm install -g netlify-cli

# Login
netlify login

# Link to your site (run in your project root)
netlify link

# Set environment variables
netlify env:set VITE_API_URL "https://your-backend.railway.app"
netlify env:set VITE_STRIPE_PUBLIC_KEY "pk_live_your_key"

# Trigger a new deploy
netlify deploy --prod
```

### Method 3: Via netlify.toml (Not Recommended for Secrets)

⚠️ **Warning**: Don't put sensitive values directly in `netlify.toml` as it's committed to git.

For non-sensitive defaults only:

```toml
# netlify.toml
[context.production.environment]
  VITE_API_URL = "https://your-backend.railway.app"
```

---

## Environment Variable Reference

| Variable | Required | Default | Example |
|----------|----------|---------|---------|
| `VITE_API_URL` | ✅ Yes | `http://localhost:8000` | `https://api.balmstore.com` |
| `VITE_STRIPE_PUBLIC_KEY` | ⚪ Optional | none | `pk_live_51abc...` |

---

## Deployment Checklist

### Before Deploying to Netlify

- [ ] Backend is deployed and accessible (test the URL)
- [ ] You have the backend URL ready
- [ ] Stripe account is set up (if using payments)
- [ ] You have your Stripe publishable key (if using payments)

### In Netlify Dashboard

1. **Set Build Settings**:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`

2. **Set Environment Variables**:
   - [ ] `VITE_API_URL` = Your backend URL
   - [ ] `VITE_STRIPE_PUBLIC_KEY` = Your Stripe key (if using)

3. **Deploy**:
   - [ ] Click "Deploy site"
   - [ ] Wait for build to complete
   - [ ] Test your site

---

## Troubleshooting

### Site builds but API calls fail

**Symptom**: Frontend loads but can't fetch data

**Solution**:
1. Check `VITE_API_URL` is set correctly in Netlify
2. Verify backend is running (visit the URL in browser)
3. Check browser console for CORS errors
4. Ensure backend CORS_ORIGINS includes your Netlify URL

### Environment variables not working

**Symptom**: Variables show as `undefined`

**Solutions**:
1. **Verify variable names start with `VITE_`** (Vite requirement)
2. **Redeploy** after adding variables (changes require rebuild)
3. **Check scopes** are set to "All" or include your deploy context
4. **Clear cache** and redeploy: Deploys → Trigger deploy → Clear cache and deploy site

### Backend URL changes

**When**: You redeploy backend or change Railway settings

**Fix**:
1. Update `VITE_API_URL` in Netlify
2. Redeploy your site
3. Also update backend `CORS_ORIGINS` to include your Netlify URL

---

## Testing Before Production

### Deploy Preview URLs

Netlify creates preview URLs for each branch/PR. To test:

1. Push to a branch (not main)
2. Check the preview URL
3. Test all functionality
4. Merge when ready

### Environment Variable Scopes

You can set different values for different contexts:

- **Production**: `main` branch deploys
- **Deploy Previews**: PR/branch previews
- **Branch deploys**: Specific branch deploys

Example:
```
Context: Production
VITE_API_URL=https://api.balmstore.com

Context: Deploy Previews
VITE_API_URL=https://staging-api.balmstore.com
```

---

## Quick Setup Commands

```bash
# Full setup via CLI
netlify login
netlify link
netlify env:set VITE_API_URL "https://your-backend.railway.app"

# Optional: Add Stripe
netlify env:set VITE_STRIPE_PUBLIC_KEY "pk_live_your_key"

# Deploy
cd frontend
npm run build
netlify deploy --prod
```

---

## Backend Configuration (Don't Forget!)

Your **backend** also needs environment variables. Make sure you've set these in Railway:

```env
# Backend environment variables (in Railway)
SECRET_KEY=<generate-secure-key>
ADMIN_PASSWORD=<change-from-default>
CORS_ORIGINS=https://your-netlify-site.netlify.app,https://yourdomain.com
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

---

## Summary

**Minimum required for Netlify**:
```
VITE_API_URL=https://your-backend.railway.app
```

**With Stripe payments**:
```
VITE_API_URL=https://your-backend.railway.app
VITE_STRIPE_PUBLIC_KEY=pk_live_your_stripe_key
```

That's it! These are the only frontend environment variables you need to configure in Netlify.

---

## Next Steps

1. ✅ Set environment variables in Netlify (above)
2. 🔄 Deploy your site
3. 🧪 Test the deployment
4. 🎉 Go live!

For backend deployment, see [DEPLOYMENT.md](../DEPLOYMENT.md)

