# Railway CLI Setup & Deployment Guide

## ✅ Railway CLI Installed

The Railway CLI (v4.16.1) has been successfully installed on your system using npm.

## 🚀 Quick Start Guide

### Step 1: Authenticate with Railway

Run this command in your terminal (it will open your browser):

```bash
railway login
```

This will:

- Open your browser
- Prompt you to sign in to Railway
- Authorize the CLI to access your Railway account
- Save your authentication token locally

### Step 2: Navigate to Backend Directory

```bash
cd /Users/davemelkonian/Movies/repos/balm-store/backend
```

### Step 3: Initialize/Link Railway Project

**Option A: Create a New Project**

```bash
railway init
```

This will create a new Railway project linked to this directory.

**Option B: Link to Existing Project**

If you already have a Railway project:

```bash
railway link
```

Then select your existing project from the list.

### Step 4: Set Environment Variables

You can set environment variables directly from the CLI:

```bash
railway variables set DATABASE_URL="sqlite:///./store.db"
railway variables set SECRET_KEY="your-secret-key-here"
railway variables set STRIPE_SECRET_KEY="your-stripe-secret-key"
railway variables set STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
railway variables set FRONTEND_URL="your-netlify-url"
railway variables set ADMIN_EMAIL="your-admin-email"
```

Or set them all at once using the Railway dashboard:

```bash
railway open
```

### Step 5: Deploy Your Backend

```bash
railway up
```

This will:

- Build your application using the configuration in `railway.json`
- Deploy it to Railway
- Provide you with a deployment URL

### Step 6: Monitor Your Deployment

```bash
# View logs
railway logs

# Check deployment status
railway status

# Open Railway dashboard
railway open
```

## 📋 Required Environment Variables

Make sure to set these in Railway:

| Variable                 | Description                       | Example                                                |
| ------------------------ | --------------------------------- | ------------------------------------------------------ |
| `DATABASE_URL`           | PostgreSQL or SQLite database URL | `sqlite:///./store.db` or PostgreSQL URL               |
| `SECRET_KEY`             | JWT secret key for authentication | Generate with `backend/scripts/generate_secret_key.sh` |
| `STRIPE_SECRET_KEY`      | Stripe secret key                 | `sk_live_...` or `sk_test_...`                         |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key            | `pk_live_...` or `pk_test_...`                         |
| `FRONTEND_URL`           | Your Netlify frontend URL         | `https://your-site.netlify.app`                        |
| `ADMIN_EMAIL`            | Admin email for notifications     | `admin@example.com`                                    |
| `ADMIN_PASSWORD`         | Initial admin password            | (secure password)                                      |

## 🗄️ Database Setup

### Option 1: SQLite (Simple, for testing)

Railway filesystem is ephemeral, so SQLite data will be lost on redeploys. For persistence:

1. Use Railway's volume feature:

```bash
railway volume add
```

2. Mount it to `/data`

3. Set `DATABASE_URL=sqlite:////data/store.db`

### Option 2: PostgreSQL (Recommended for production)

1. Add PostgreSQL to your Railway project:

```bash
railway add postgresql
```

2. Railway will automatically set `DATABASE_URL` environment variable

3. Update your `backend/app/db/database.py` to use the PostgreSQL URL

4. Run migrations:

```bash
railway run python scripts/init_db.py
```

## 📝 Useful Commands

### Local Development with Railway Environment

Run commands locally using Railway environment variables:

```bash
railway run python app/main.py
railway run uvicorn app.main:app --reload
```

### View Environment Variables

```bash
railway variables
```

### View Recent Deployments

```bash
railway status
```

### Open Project in Browser

```bash
railway open
```

### Unlink Project

```bash
railway unlink
```

## 🔧 Configuration Files

Your backend already has Railway configuration:

**`backend/railway.json`:**

```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "pip install -r requirements.txt"
  },
  "deploy": {
    "startCommand": "uvicorn app.main:app --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

This tells Railway to:

- Use Nixpacks builder (automatically detects Python)
- Install dependencies from `requirements.txt`
- Start the FastAPI server on the Railway-provided port
- Restart on failure (up to 10 times)

## 🔄 Continuous Deployment

To enable automatic deployments from GitHub:

1. Connect your GitHub repository in the Railway dashboard:

   ```bash
   railway open
   ```

2. Go to Settings → Deployments → GitHub

3. Connect your repository (`davemelk100/balm-store`)

4. Set deployment branch to `main`

5. Set root directory to `backend` (if deploying backend separately)

Now every push to `main` will automatically deploy!

## 🔗 Update Frontend API URL

After deployment, update your frontend to use the Railway backend URL:

1. Get your Railway URL:

   ```bash
   railway domain
   ```

2. Update `frontend/src/config/api.ts`:

   ```typescript
   const API_URL = import.meta.env.PROD
     ? "https://your-railway-app.railway.app"
     : "http://localhost:8000";
   ```

3. Add Railway URL to Netlify environment variables:
   ```bash
   VITE_API_URL=https://your-railway-app.railway.app
   ```

## 🐛 Troubleshooting

### Check Logs

```bash
railway logs --tail
```

### Deployment Failed

```bash
# Check status
railway status

# View full logs
railway logs
```

### Environment Variables Not Working

```bash
# List all variables
railway variables

# Test locally with Railway env
railway run env
```

### Port Issues

Railway automatically provides a `PORT` environment variable. Your app must use it:

```python
# This is already configured in your railway.json
# --port $PORT
```

## 📚 Additional Resources

- [Railway CLI Documentation](https://docs.railway.app/develop/cli)
- [Railway Python Deployment Guide](https://docs.railway.app/guides/python)
- [FastAPI on Railway](https://railway.app/template/fastapi)

## 🎯 Next Steps

1. ✅ Railway CLI installed
2. 🔲 Run `railway login`
3. 🔲 Run `cd backend && railway init`
4. 🔲 Set environment variables
5. 🔲 Run `railway up`
6. 🔲 Update frontend with Railway URL
7. 🔲 Test the deployment

---

**Ready to deploy?** Start with `railway login` in your terminal!
