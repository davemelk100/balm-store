# 🚀 Deployment Checklist for BALM Store

Use this checklist to ensure everything is properly configured before going live.

## Pre-Deployment Checklist

### 🔐 Environment Variables (Netlify)

Go to Netlify Dashboard → Site Configuration → Environment Variables

- [ ] `STRIPE_SECRET_KEY` - Your Stripe secret key (required for payments)
  - Test: `sk_test_...`
  - Live: `sk_live_...`
- [ ] `VITE_STRIPE_PUBLIC_KEY` - Your Stripe public key (optional, if used)
  - Test: `pk_test_...`
  - Live: `pk_live_...`
- [ ] `VITE_API_URL` - Your backend API URL
  - Example: `https://your-backend.railway.app`

### 🔧 Backend Configuration (Railway/Render)

- [ ] Environment variables set:
  - [ ] `SECRET_KEY` - Random secret key (generate with `openssl rand -hex 32`)
  - [ ] `ADMIN_USERNAME` - Admin username
  - [ ] `ADMIN_PASSWORD` - Strong admin password
  - [ ] `DATABASE_URL` - PostgreSQL connection string (auto-set by Railway/Render)
  - [ ] `CORS_ORIGINS` - Your frontend URL(s), comma-separated
    - Example: `https://balmstore.netlify.app,https://www.yourdomain.com`
  - [ ] `GOOGLE_CLIENT_ID` - (Optional) For Google OAuth
  - [ ] `GOOGLE_CLIENT_SECRET` - (Optional) For Google OAuth

### 📦 Code Changes

- [ ] Updated product images in `frontend/src/store/data/storeProducts.ts`
- [ ] Changed default admin credentials
- [ ] Verified API URL configuration
- [ ] Tested checkout flow locally

### 🔒 Security

- [ ] Changed default `ADMIN_PASSWORD`
- [ ] Generated strong `SECRET_KEY`
- [ ] Using environment variables (not hardcoded values)
- [ ] CORS origins properly configured
- [ ] `.env` files are in `.gitignore`

### 💳 Stripe Configuration

- [ ] Stripe account created
- [ ] **Test Mode** for staging/testing:
  - [ ] Test secret key added to Netlify
  - [ ] Test public key (if needed)
- [ ] **Live Mode** for production:
  - [ ] Business verified with Stripe
  - [ ] Live keys ready to swap
  - [ ] Tested with test cards first

### 🗄️ Database

- [ ] Using PostgreSQL in production (not SQLite)
- [ ] Database migrations run
- [ ] Initial products added
- [ ] Database backups configured

### 🌐 Deployment Steps

#### Backend (Railway/Render)
1. [ ] Connect GitHub repository
2. [ ] Configure build settings
3. [ ] Set all environment variables
4. [ ] Deploy backend
5. [ ] Test API at `/docs` endpoint
6. [ ] Verify health check endpoint

#### Frontend (Netlify)
1. [ ] Connect GitHub repository
2. [ ] Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
   - Functions directory: `netlify/functions`
3. [ ] Set all environment variables
4. [ ] Deploy frontend
5. [ ] Test all pages load correctly

#### Functions
1. [ ] Verify `netlify/functions` directory exists
2. [ ] Check `netlify.toml` has functions path
3. [ ] Dependencies installed automatically by Netlify
4. [ ] Test function at `/.netlify/functions/create-checkout-session`

### ✅ Post-Deployment Testing

- [ ] **Homepage loads** - Can view store
- [ ] **Products display** - All products show correctly
- [ ] **Product details** - Individual product pages work
- [ ] **Add to cart** - Can add items to cart
- [ ] **Cart page** - Can view cart and update quantities
- [ ] **Checkout page** - Checkout page loads
- [ ] **Stripe redirect** - "Proceed to Payment" redirects to Stripe
- [ ] **Test payment** - Complete test purchase with `4242 4242 4242 4242`
- [ ] **Success page** - Returns to success page after payment
- [ ] **Admin panel** - Can access at `/admin/store`
- [ ] **Admin login** - Can log in with credentials
- [ ] **Product management** - Can add/edit/delete products
- [ ] **Image uploads** - Can upload product images
- [ ] **Mobile responsive** - Test on mobile device
- [ ] **Different browsers** - Test on Chrome, Firefox, Safari

### 🐛 Common Issues & Solutions

#### "Stripe checkout is not yet configured"
- ✅ Add `STRIPE_SECRET_KEY` to Netlify environment variables
- ✅ Redeploy site after adding variables

#### "CORS policy error"
- ✅ Add frontend URL to `CORS_ORIGINS` in backend
- ✅ Ensure no trailing slashes in URLs

#### "Failed to fetch"
- ✅ Check backend is running
- ✅ Verify `VITE_API_URL` points to correct backend
- ✅ Check backend logs for errors

#### "404 Not Found" on function
- ✅ Verify `netlify.toml` has functions directory
- ✅ Check function file is at `netlify/functions/create-checkout-session.js`
- ✅ Redeploy site

#### Database errors
- ✅ Check `DATABASE_URL` is correct
- ✅ Verify database is accessible
- ✅ Run migrations if needed

### 📊 Monitoring (Optional but Recommended)

- [ ] Set up Sentry for error tracking
- [ ] Configure Netlify notifications
- [ ] Set up uptime monitoring (e.g., UptimeRobot)
- [ ] Enable Netlify Analytics
- [ ] Set up Stripe webhook for order notifications

### 🚦 Go-Live Checklist

Final checks before switching to production:

1. [ ] All test payments successful
2. [ ] All environment variables verified
3. [ ] Admin credentials changed
4. [ ] Database backed up
5. [ ] HTTPS working correctly
6. [ ] Custom domain configured (if applicable)
7. [ ] DNS records updated
8. [ ] All team members notified
9. [ ] Rollback plan documented
10. [ ] Support contact information ready

### 🎉 Post-Launch

- [ ] Swap Stripe test keys for live keys
- [ ] Test one real payment (small amount)
- [ ] Monitor error logs for 24 hours
- [ ] Update documentation with live URLs
- [ ] Announce launch! 🎊

---

## Quick Commands

### Generate Secret Key
```bash
openssl rand -hex 32
```

### Test Stripe Function Locally
```bash
netlify dev
```

### Check Netlify Deployment
```bash
netlify status
```

### View Backend Logs (Railway)
```bash
railway logs
```

### Redeploy Netlify
```bash
netlify deploy --prod
```

---

**Need Help?** 
- Stripe Setup: See `STRIPE_QUICKSTART.md`
- Full Docs: See `README.md`
- Create an issue on GitHub

