# 🚀 BALM Store Deployment Guide

Complete guide for deploying your BALM Store to production.

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All features tested locally
- [ ] Database initialized and working
- [ ] `.env` configured with production values
- [ ] Admin password changed from default
- [ ] Stripe keys configured (production keys for live store)
- [ ] CORS origins updated for your domains
- [ ] Code committed to Git repository
- [ ] Repository pushed to GitHub

## 🎯 Recommended Setup

- **Frontend**: Netlify (free tier available)
- **Backend**: Railway (free tier available)
- **Database**: PostgreSQL (included with Railway)

## 🌐 Frontend Deployment (Netlify)

### Option 1: Deploy via GitHub (Recommended)

1. **Push code to GitHub**:

```bash
cd /path/to/balm-store
git remote add origin https://github.com/YOUR-USERNAME/balm-store.git
git push -u origin main
```

2. **Connect to Netlify**:

   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and select your repository
   - Configure build settings:
     - **Base directory**: `frontend`
     - **Build command**: `npm run build`
     - **Publish directory**: `frontend/dist`

3. **Set Environment Variables** in Netlify:

   - Go to Site settings → Environment variables
   - Add:
     ```
     VITE_API_URL=https://your-backend.railway.app
     VITE_STRIPE_PUBLIC_KEY=pk_live_your_stripe_key
     ```

4. **Deploy**: Click "Deploy site"

### Option 2: Deploy via CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd frontend
npm run build
netlify deploy --prod
```

### Custom Domain Setup

1. In Netlify: Site settings → Domain management
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificate will be auto-generated

## 🖥️ Backend Deployment (Railway)

### Step 1: Create Railway Account

1. Go to https://railway.app
2. Sign up with GitHub
3. Create a new project

### Step 2: Deploy Backend

1. **Click "Deploy from GitHub repo"**
2. **Select your repository**
3. **Configure service**:
   - Root directory: `/backend`
   - Railway will auto-detect Python

### Step 3: Add PostgreSQL Database

1. In your Railway project, click "+ New"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically create database
4. Get database URL from variables

### Step 4: Set Environment Variables

In Railway project → Variables, add:

```env
# Database (Railway provides this automatically)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Security
SECRET_KEY=generate-a-long-random-string-here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password-here

# CORS (add your Netlify domain)
CORS_ORIGINS=https://your-store.netlify.app,https://yourdomain.com

# Stripe
STRIPE_PUBLIC_KEY=pk_live_your_key
STRIPE_SECRET_KEY=sk_live_your_key
```

### Step 5: Initialize Database

1. In Railway, go to your backend service
2. Open the terminal (or use Railway CLI)
3. Run:

```bash
python scripts/init_db.py
```

### Step 6: Deploy

Railway will automatically deploy when you push to GitHub.

## 🔐 Security Configuration

### Generate Secure Keys

```python
# Generate SECRET_KEY
import secrets
print(secrets.token_urlsafe(32))
```

### Update Environment Variables

**Backend (Railway)**:

```env
SECRET_KEY=<generated-key>
ADMIN_PASSWORD=<strong-password>
DATABASE_URL=${{Postgres.DATABASE_URL}}
CORS_ORIGINS=https://your-frontend.netlify.app
```

**Frontend (Netlify)**:

```env
VITE_API_URL=https://your-backend.railway.app
VITE_STRIPE_PUBLIC_KEY=pk_live_...
```

## 💳 Stripe Configuration

### Development (Test Mode)

1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy test keys:
   - `pk_test_...` (publishable key)
   - `sk_test_...` (secret key)

### Production (Live Mode)

1. Activate your Stripe account
2. Go to https://dashboard.stripe.com/apikeys
3. Copy live keys:
   - `pk_live_...` (publishable key)
   - `sk_live_...` (secret key)
4. Update environment variables in both Netlify and Railway

### Webhook Setup

1. In Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-backend.railway.app/api/webhooks/stripe`
3. Select events: `checkout.session.completed`, `payment_intent.succeeded`
4. Copy webhook secret and add to Railway as `STRIPE_WEBHOOK_SECRET`

## 🗄️ Database Migration

### Switch from SQLite to PostgreSQL

Railway automatically provides PostgreSQL. No code changes needed!

The `DATABASE_URL` from Railway will be in this format:

```
postgresql://user:password@host:port/database
```

SQLAlchemy will automatically use PostgreSQL when this URL is set.

### Backup and Restore

**Export from local SQLite**:

```bash
# Dump products
python scripts/export_products.py > products.json
```

**Import to production**:

```bash
# SSH into Railway or use Railway CLI
railway run python scripts/import_products.py products.json
```

## 📊 Monitoring

### Railway Monitoring

- View logs: Railway dashboard → Service → Logs
- Monitor metrics: CPU, Memory, Network usage
- Set up alerts for downtime

### Netlify Monitoring

- Analytics: Netlify dashboard → Analytics
- Deploy logs: Check build and deploy logs
- Form submissions (if using Netlify Forms)

## 🔄 Continuous Deployment

Both Netlify and Railway support automatic deployments:

1. **Push to GitHub**:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

2. **Automatic deployment**:
   - Netlify rebuilds frontend automatically
   - Railway redeploys backend automatically

## 🐛 Troubleshooting

### Frontend Issues

**Build fails on Netlify**:

- Check Node version (should be 18+)
- Verify all dependencies in `package.json`
- Check build logs for specific errors

**API connection fails**:

- Verify `VITE_API_URL` is set correctly
- Check CORS settings on backend
- Ensure backend is running

### Backend Issues

**Database connection fails**:

- Verify `DATABASE_URL` is set
- Check PostgreSQL is running (Railway dashboard)
- Review connection string format

**Import errors**:

- Ensure all dependencies in `requirements.txt`
- Check Python version (should be 3.11+)
- Verify file paths are correct

**Admin panel not loading**:

- Check static file serving in `main.py`
- Verify `store_admin.html` is in correct location
- Check browser console for errors

## 🎯 Post-Deployment Tasks

1. **Test all functionality**:

   - [ ] Browse products
   - [ ] Add to cart
   - [ ] Checkout flow
   - [ ] Admin login
   - [ ] Create/edit products

2. **Set up monitoring**:

   - [ ] Configure error tracking (Sentry, etc.)
   - [ ] Set up uptime monitoring
   - [ ] Enable logging

3. **Security**:

   - [ ] Enable HTTPS (auto with Netlify/Railway)
   - [ ] Review CORS settings
   - [ ] Audit admin access
   - [ ] Set up rate limiting

4. **Performance**:
   - [ ] Enable CDN (auto with Netlify)
   - [ ] Optimize images
   - [ ] Enable caching
   - [ ] Monitor load times

## 💰 Cost Estimates

### Free Tier (Development/Testing)

- **Netlify**: 100 GB bandwidth, 300 build minutes/month
- **Railway**: $5 credit/month, ~500 hours runtime
- **Total**: Free for low-traffic sites

### Paid Tier (Production)

- **Netlify Pro**: $19/month (more bandwidth & features)
- **Railway**: $5/month + usage ($0.000231/GB-hour)
- **PostgreSQL**: Included with Railway
- **Total**: ~$25-50/month depending on traffic

## 🔗 Useful Links

- **Netlify Docs**: https://docs.netlify.com
- **Railway Docs**: https://docs.railway.app
- **Stripe Docs**: https://stripe.com/docs
- **FastAPI Deployment**: https://fastapi.tiangolo.com/deployment/

## 📝 Deployment Checklist

### Before First Deploy

- [ ] Test locally with production settings
- [ ] Change all default passwords
- [ ] Generate secure SECRET_KEY
- [ ] Configure Stripe (test mode first)
- [ ] Set up PostgreSQL database
- [ ] Configure CORS for your domains

### Deploy Frontend

- [ ] Push code to GitHub
- [ ] Connect repository to Netlify
- [ ] Set environment variables
- [ ] Configure custom domain (optional)
- [ ] Test deployment

### Deploy Backend

- [ ] Connect repository to Railway
- [ ] Add PostgreSQL database
- [ ] Set environment variables
- [ ] Initialize database
- [ ] Test API endpoints

### Post-Deploy

- [ ] Test full application flow
- [ ] Set up monitoring
- [ ] Configure Stripe webhooks
- [ ] Enable backups
- [ ] Document deployment process

## 🆘 Getting Help

If you encounter issues:

1. Check the logs (Netlify/Railway dashboards)
2. Review this guide
3. Check the main README.md
4. Search GitHub issues
5. Create a new issue with:
   - Error messages
   - Steps to reproduce
   - Environment details

---

**Ready to Deploy?** Start with the Pre-Deployment Checklist above!

For local development instructions, see [SETUP.md](SETUP.md)
