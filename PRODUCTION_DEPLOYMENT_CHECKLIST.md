# Production Deployment Checklist for balmsoothes.com

Use this checklist to ensure everything is properly configured before going live.

---

## 🎯 Pre-Deployment Overview

- **Frontend:** Netlify → balmsoothes.com
- **Backend:** Railway → your-backend.railway.app
- **Payment:** Stripe (Test mode first, then Live mode)
- **Email:** Resend
- **Auth:** Email/Password + Google OAuth (optional)

---

## ✅ Phase 1: Domain & DNS Setup

### Netlify Domain Configuration

- [ ] Log into [Netlify Dashboard](https://app.netlify.com)
- [ ] Navigate to: **Site Settings → Domain Management**
- [ ] Add custom domain: `balmsoothes.com`
- [ ] Add domain alias: `www.balmsoothes.com`
- [ ] Enable HTTPS (Netlify handles automatically)
- [ ] Verify SSL certificate is active (green padlock)
- [ ] Test: Visit https://balmsoothes.com and verify it loads

**Expected result:** Site loads on balmsoothes.com with HTTPS ✅

---

## ✅ Phase 2: Backend Environment Variables (Railway)

### Railway Dashboard Setup

- [ ] Log into [Railway Dashboard](https://railway.app)
- [ ] Select your backend project
- [ ] Navigate to: **Variables** tab

### Required Variables:

#### Security & Database

```bash
SECRET_KEY = "your-production-secret-key-make-it-long-and-random-minimum-32-chars"
DATABASE_URL = "sqlite:///./store.db"  # or PostgreSQL URL for production
```

- [ ] `SECRET_KEY` - Generate a secure random key (32+ characters)
- [ ] `DATABASE_URL` - Set database connection string

#### Frontend Communication

```bash
FRONTEND_URL = "https://balmsoothes.com"
CORS_ORIGINS = "https://balmsoothes.com,https://www.balmsoothes.com,http://localhost:8888,http://localhost:5173"
```

- [ ] `FRONTEND_URL` - Set to `https://balmsoothes.com`
- [ ] `CORS_ORIGINS` - Include both production and local URLs

#### Stripe (Start with TEST mode)

```bash
STRIPE_SECRET_KEY = "sk_test_..."  # Use test key initially
```

- [ ] `STRIPE_SECRET_KEY` - Set to **test key** (`sk_test_...`) for initial deployment
- [ ] Get key from: [Stripe Dashboard → Developers → API Keys](https://dashboard.stripe.com/test/apikeys)

#### Email (Resend)

```bash
RESEND_API_KEY = "re_..."
EMAIL_FROM = "noreply@balmsoothes.com"
EMAIL_FROM_NAME = "BALM Store"
```

- [ ] `RESEND_API_KEY` - Get from [Resend Dashboard](https://resend.com/api-keys)
- [ ] `EMAIL_FROM` - Verify domain in Resend first
- [ ] `EMAIL_FROM_NAME` - Set sender name

#### Google OAuth (Optional)

```bash
GOOGLE_CLIENT_ID = "your_client_id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET = "your_client_secret"
GOOGLE_REDIRECT_URI = "https://your-backend.railway.app/api/auth/google/callback"
```

- [ ] `GOOGLE_CLIENT_ID` - From Google Cloud Console
- [ ] `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
- [ ] `GOOGLE_REDIRECT_URI` - Replace with your Railway backend URL

### Get Your Railway Backend URL:

```bash
railway domain
```

- [ ] Note your Railway URL: `https://____________.railway.app`

---

## ✅ Phase 3: Frontend Environment Variables (Netlify)

### Netlify Environment Variables Setup

- [ ] Log into [Netlify Dashboard](https://app.netlify.com)
- [ ] Navigate to: **Site Settings → Environment Variables**
- [ ] Click **"Add a variable"** for each below

### Required Variables:

#### Backend Connection

```bash
VITE_API_BASE = "https://your-backend.railway.app"
```

- [ ] `VITE_API_BASE` - Your Railway backend URL from above
- [ ] **Important:** Use `VITE_API_BASE` not `VITE_API_URL` (Netlify blocks "URL")

#### Stripe Keys (Start with TEST mode)

```bash
VITE_STRIPE_PUBLISHABLE_KEY_TEST = "pk_test_..."
VITE_STRIPE_PUBLISHABLE_KEY_LIVE = "pk_live_..."
```

- [ ] `VITE_STRIPE_PUBLISHABLE_KEY_TEST` - Stripe test publishable key
- [ ] `VITE_STRIPE_PUBLISHABLE_KEY_LIVE` - Stripe live publishable key
- [ ] Get both from: [Stripe Dashboard → API Keys](https://dashboard.stripe.com/test/apikeys)
- [ ] **Note:** Initially, site will use TEST key (safe for testing)

#### Google OAuth (Optional)

```bash
VITE_GOOGLE_CLIENT_ID = "your_client_id.apps.googleusercontent.com"
VITE_GOOGLE_REDIRECT_URI = "https://your-backend.railway.app/api/auth/google/callback"
```

- [ ] `VITE_GOOGLE_CLIENT_ID` - Same as backend (from Google Cloud Console)
- [ ] `VITE_GOOGLE_REDIRECT_URI` - Same as backend redirect URI

---

## ✅ Phase 4: Google OAuth Configuration (If Using)

### Google Cloud Console Setup

- [ ] Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
- [ ] Select your OAuth 2.0 Client ID
- [ ] Click **"Edit"**

### Add Authorized JavaScript Origins:

```
https://balmsoothes.com
https://www.balmsoothes.com
http://localhost:8888
```

- [ ] Add all three origins above

### Add Authorized Redirect URIs:

```
https://your-backend.railway.app/api/auth/google/callback
http://localhost:8000/api/auth/google/callback
```

- [ ] Replace `your-backend` with your actual Railway URL
- [ ] Add both production and local redirect URIs
- [ ] Click **"Save"**

---

## ✅ Phase 5: Stripe Configuration

### Stripe Dashboard Setup

- [ ] Log into [Stripe Dashboard](https://dashboard.stripe.com)

### Test Mode Configuration (Do This First)

- [ ] Switch to **"Test Mode"** (toggle in top right)
- [ ] Navigate to: **Developers → API Keys**
- [ ] Copy **"Publishable key"** → Set as `VITE_STRIPE_PUBLISHABLE_KEY_TEST` (Netlify)
- [ ] Copy **"Secret key"** → Set as `STRIPE_SECRET_KEY` (Railway)

### Test Mode Webhooks

- [ ] Navigate to: **Developers → Webhooks**
- [ ] Click **"Add endpoint"**
- [ ] Set endpoint URL: `https://balmsoothes.com/.netlify/functions/stripe-webhook`
- [ ] Select events to listen for:
  - [ ] `checkout.session.completed`
  - [ ] `product.created`
  - [ ] `product.updated`
  - [ ] `price.created`
  - [ ] `price.updated`
- [ ] Click **"Add endpoint"**
- [ ] Copy **"Signing secret"** → Set as `STRIPE_WEBHOOK_SECRET` (Netlify)

### Create Test Products

- [ ] Navigate to: **Products** (test mode)
- [ ] Click **"+ Add product"**
- [ ] Create your products with:
  - Name
  - Description
  - Price
  - Images
- [ ] Note product IDs for inventory sync

---

## ✅ Phase 6: Email Configuration (Resend)

### Resend Dashboard Setup

- [ ] Log into [Resend Dashboard](https://resend.com)
- [ ] Navigate to: **Domains**
- [ ] Click **"+ Add Domain"**
- [ ] Enter: `balmsoothes.com`
- [ ] Follow DNS configuration instructions
- [ ] Verify domain (status should show "Verified")

### Test Email Sending

- [ ] Navigate to: **API Keys**
- [ ] Create new API key
- [ ] Copy key → Set as `RESEND_API_KEY` (Railway)
- [ ] Send test email to verify configuration

---

## ✅ Phase 7: Deploy & Test (TEST MODE)

### Trigger Deployments

- [ ] Push code to GitHub (triggers Netlify deploy)
- [ ] Railway should auto-deploy on push
- [ ] Wait for both deployments to complete

### Monitor Deployments

**Netlify:**

```bash
netlify open:site
```

- [ ] Check deploy status (should be "Published")
- [ ] Review build logs for errors

**Railway:**

```bash
railway logs
```

- [ ] Check for startup errors
- [ ] Verify environment variables loaded

### Test Site Functionality

- [ ] Visit https://balmsoothes.com
- [ ] **Test User Registration:**
  - [ ] Click "Sign Up"
  - [ ] Create account with email/password
  - [ ] Verify email sent (check inbox)
  - [ ] Confirm email verification
- [ ] **Test Login:**
  - [ ] Log in with created account
  - [ ] Test Google OAuth login (if enabled)
- [ ] **Test Shopping Cart:**
  - [ ] Browse products
  - [ ] Add items to cart
  - [ ] View cart
  - [ ] Update quantities
  - [ ] Remove items
- [ ] **Test Checkout (TEST MODE):**
  - [ ] Click "Proceed to Payment"
  - [ ] Redirected to Stripe Checkout
  - [ ] Use Stripe test card: `4242 4242 4242 4242`
  - [ ] Complete test purchase
  - [ ] Verify order confirmation
  - [ ] Check webhook received in Stripe Dashboard

### Test Inventory Sync

- [ ] Update product inventory in Stripe
- [ ] Wait for webhook
- [ ] Verify inventory updated on site
- [ ] Test "Out of Stock" behavior

---

## ✅ Phase 8: Go Live (PRODUCTION MODE)

**⚠️ ONLY DO THIS WHEN READY FOR REAL TRANSACTIONS ⚠️**

### Switch to Live Stripe Keys

#### Railway Backend:

- [ ] Change `STRIPE_SECRET_KEY` from `sk_test_...` to `sk_live_...`

#### Netlify Frontend:

- [ ] Verify `VITE_STRIPE_PUBLISHABLE_KEY_LIVE` is set to `pk_live_...`
- [ ] Code automatically uses live key in production builds

### Live Mode Webhooks

- [ ] Switch to **"Live Mode"** in Stripe Dashboard
- [ ] Navigate to: **Developers → Webhooks**
- [ ] Click **"Add endpoint"**
- [ ] Set endpoint URL: `https://balmsoothes.com/.netlify/functions/stripe-webhook`
- [ ] Select same events as test mode
- [ ] Copy **"Signing secret"** → Update `STRIPE_WEBHOOK_SECRET` (Netlify)

### Create Live Products

- [ ] Recreate products in Live Mode (or use Stripe CLI to copy)
- [ ] Verify prices are correct
- [ ] Upload images
- [ ] Set inventory quantities

### Final Testing (with real card)

- [ ] Test complete purchase flow with real payment method
- [ ] Verify funds arrive in Stripe
- [ ] Test refund process
- [ ] Monitor for errors

---

## ✅ Phase 9: Monitoring & Maintenance

### Set Up Monitoring

- [ ] Enable Netlify deployment notifications
- [ ] Set up Railway deployment notifications
- [ ] Monitor Stripe Dashboard for transactions
- [ ] Check error logs regularly

### Regular Checks

- [ ] Weekly: Review Stripe transactions
- [ ] Weekly: Check error logs (Railway + Netlify)
- [ ] Monthly: Update dependencies
- [ ] Monthly: Review SSL certificate status

### Backup Strategy

- [ ] Export database regularly (if using SQLite)
- [ ] Back up product images
- [ ] Keep copy of all environment variables (securely)

---

## 🔐 Security Checklist

- [ ] All environment variables are set (not hardcoded)
- [ ] `.env` files are in `.gitignore`
- [ ] No secrets committed to GitHub
- [ ] HTTPS enabled on domain
- [ ] CORS properly configured
- [ ] Strong `SECRET_KEY` set (32+ random characters)
- [ ] Google OAuth credentials secured
- [ ] Stripe webhook secrets configured
- [ ] Email domain verified

---

## 🚨 Troubleshooting

### Site won't load

- Check Netlify deployment status
- Verify DNS settings
- Check SSL certificate

### Can't connect to backend

- Verify `VITE_API_BASE` is correct
- Check Railway deployment status
- Review CORS settings
- Check Railway logs: `railway logs`

### Payment not working

- Verify Stripe keys are correct (test vs live)
- Check webhook is configured
- Review Netlify function logs
- Test with Stripe test card first

### Email not sending

- Verify domain in Resend
- Check `RESEND_API_KEY`
- Review Railway logs for errors
- Test email sending manually

### Google OAuth not working

- Verify redirect URIs in Google Console
- Check `GOOGLE_CLIENT_ID` matches
- Ensure `GOOGLE_REDIRECT_URI` is correct
- Review Railway logs

---

## 📞 Support Resources

- **Netlify Docs:** https://docs.netlify.com
- **Railway Docs:** https://docs.railway.app
- **Stripe Docs:** https://stripe.com/docs
- **Resend Docs:** https://resend.com/docs
- **Google OAuth:** https://developers.google.com/identity/protocols/oauth2

---

## ✨ Post-Launch

### Announce Launch

- [ ] Update social media
- [ ] Send announcement email
- [ ] Update any marketing materials

### Monitor First Week

- [ ] Check analytics daily
- [ ] Monitor for errors
- [ ] Respond to customer issues quickly
- [ ] Gather feedback

### Iterate

- [ ] Review user feedback
- [ ] Plan improvements
- [ ] Update documentation
- [ ] Celebrate! 🎉

---

**Last Updated:** December 29, 2025
**Status:** Ready for Deployment

---

## Quick Commands Reference

```bash
# Check Netlify status
netlify status
netlify open:site

# Check Railway status
railway status
railway logs
railway domain

# Deploy manually (if needed)
netlify deploy --prod
railway up

# Check environment variables
netlify env:list
railway variables
```

---

**Need help?** Review the specific guide documents:

- `STRIPE_CONFIGURATION_GUIDE.md` - Stripe setup
- `GOOGLE_OAUTH_SETUP.md` - Google OAuth setup
- `RESEND_EMAIL_SETUP.md` - Email configuration
- `setup-production-domain.sh` - Automated Railway setup
