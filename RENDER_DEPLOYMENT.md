# Render Deployment Guide for BALM Store

Follow these steps to deploy your backend on Render.

## 📋 Prerequisites

- [x] GitHub account with balm-store repository
- [x] Render account (free) - https://render.com
- [x] Your Netlify frontend URL (or note to add later)

## 🚀 Step-by-Step Deployment

### Step 1: Create Render Account

1. Go to https://render.com
2. Click **"Get Started"** or **"Sign Up"**
3. Choose **"Sign up with GitHub"** (recommended)
4. Authorize Render to access your repositories

---

### Step 2: Create PostgreSQL Database

1. From Render Dashboard, click **"New +"** (top right)
2. Select **"PostgreSQL"**
3. Configure database:
   - **Name**: `balm-store-db`
   - **Database**: `balm_store`
   - **User**: `balm_store_user` (auto-generated)
   - **Region**: Oregon (or closest to you)
   - **PostgreSQL Version**: 16 (latest)
   - **Plan**: **Free** (select this!)
4. Click **"Create Database"**
5. Wait ~2 minutes for database to provision
6. Once ready, go to database page and find **"Internal Database URL"**
7. **Copy this URL** - you'll need it in Step 4

📝 The URL looks like: `postgresql://user:password@hostname/database`

---

### Step 3: Create Web Service

1. From Dashboard, click **"New +"** again
2. Select **"Web Service"**
3. Connect your repository:
   - Click **"Connect account"** if needed
   - Find and select **"balm-store"** repository
   - Click **"Connect"**
4. Configure the web service:

   **Basic Settings:**
   - **Name**: `balm-store-api`
   - **Region**: Oregon (same as database)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Python 3

   **Build & Deploy:**
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

   **Plan:**
   - Select **"Free"** (important!)

5. **Don't click Create yet!** - We need to add environment variables first

---

### Step 4: Add Environment Variables

Still in the web service setup, scroll down to **"Environment Variables"** section.

Click **"Add Environment Variable"** for each of these:

#### Required Variables:

1. **DATABASE_URL**
   - **Value**: Paste the Internal Database URL from Step 2
   - Example: `postgresql://balm_store_user:password@dpg-xxx.oregon-postgres.render.com/balm_store`

2. **SECRET_KEY**
   - **Value**: Generate a secure key
   - Run this command in your terminal to generate:
     ```bash
     python3 -c "import secrets; print(secrets.token_urlsafe(32))"
     ```
   - Copy the output and paste as the value

3. **ADMIN_PASSWORD**
   - **Value**: Your secure admin password
   - Example: `MySecurePassword123!` (use your own!)
   - ⚠️ Don't use `admin123` in production!

4. **CORS_ORIGINS**
   - **Value**: Your Netlify URL (get this later if you don't have it yet)
   - Example: `https://your-site.netlify.app`
   - 💡 You can add this later if you don't have the Netlify URL yet

#### Optional Variables (with defaults):

5. **ADMIN_USERNAME**
   - **Value**: `admin` (or change to your preference)

6. **ALGORITHM**
   - **Value**: `HS256`

7. **ACCESS_TOKEN_EXPIRE_MINUTES**
   - **Value**: `30`

---

### Step 5: Deploy!

1. Click **"Create Web Service"** (bottom of page)
2. Render will start building and deploying
3. **Watch the logs** - you'll see:
   - Installing dependencies
   - Starting the application
   - "Application startup complete"
4. Wait 3-5 minutes for first deployment
5. Once deployed, you'll see a green **"Live"** status

---

### Step 6: Get Your Backend URL

1. On your web service page, find the URL at the top
2. It will look like: `https://balm-store-api.onrender.com`
3. **Copy this URL** - you'll need it for Netlify!
4. Test it by visiting: `https://balm-store-api.onrender.com/docs`
5. You should see the FastAPI documentation page 🎉

---

### Step 7: Update CORS (if needed)

If you didn't add your Netlify URL in Step 4:

1. Deploy your frontend to Netlify first (get the URL)
2. Come back to Render → Your web service
3. Go to **"Environment"** tab (left sidebar)
4. Find **CORS_ORIGINS** (or add it)
5. Set value to your Netlify URL: `https://your-site.netlify.app`
6. Click **"Save Changes"**
7. Render will automatically redeploy

---

### Step 8: Configure Netlify

Now update your Netlify frontend:

1. Go to https://app.netlify.com
2. Select your site
3. Go to **"Site configuration"** → **"Environment variables"**
4. Add or update:
   - **Key**: `VITE_API_URL`
   - **Value**: Your Render URL from Step 6
   - Example: `https://balm-store-api.onrender.com`
5. Save
6. Go to **"Deploys"** → **"Trigger deploy"** → **"Deploy site"**

---

## ✅ Verification Checklist

After deployment, verify everything works:

- [ ] Backend URL loads: `https://your-app.onrender.com`
- [ ] API docs work: `https://your-app.onrender.com/docs`
- [ ] Database connected (check logs for any errors)
- [ ] Frontend can fetch data from backend
- [ ] No CORS errors in browser console
- [ ] Admin login works

---

## 🐛 Troubleshooting

### Build Fails

**Check logs** for errors:
- Missing dependencies? Check `requirements.txt`
- Python version issue? Render uses Python 3.7 by default
- Add environment variable: `PYTHON_VERSION=3.11.0`

### Application Won't Start

**Common issues**:
1. Wrong start command - should be: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
2. Missing `$PORT` variable - Render provides this automatically
3. Wrong root directory - should be: `backend`

### Database Connection Fails

**Check**:
1. DATABASE_URL is set correctly
2. Using **Internal Database URL** (not External)
3. Database is in same region as web service
4. Database status is "Available"

### CORS Errors in Browser

**Fix**:
1. Add your Netlify URL to `CORS_ORIGINS` in Render
2. Format: `https://your-site.netlify.app` (no trailing slash)
3. Multiple origins: `https://site1.com,https://site2.com`
4. Redeploy after changing

### "Render service sleeping"

**Free tier limitation**:
- Services sleep after 15 minutes of inactivity
- First request takes 30-60 seconds to wake up
- Upgrade to paid plan ($7/month) for always-on

---

## 💡 Tips & Best Practices

### Auto-Deploy on Push

Render automatically deploys when you push to GitHub:
```bash
git add .
git commit -m "Update feature"
git push origin main
# Render automatically deploys! 🚀
```

### View Logs

Real-time logs:
1. Render Dashboard → Your service
2. Click **"Logs"** tab
3. See all application output

### Environment Variable Management

Add or update variables:
1. Service → **"Environment"** tab
2. Edit values
3. **Save Changes** (triggers redeploy)

### Database Backups

Render Free PostgreSQL:
- No automatic backups on free tier
- Consider manual exports:
  ```bash
  # Connect to database shell in Render
  # Then export: pg_dump yourdb > backup.sql
  ```

### Performance Monitoring

1. Service → **"Metrics"** tab
2. View CPU, Memory, Response time
3. Free tier limited to 512 MB RAM

---

## 💰 Costs

### Free Tier Includes:
- ✅ 750 hours/month web service (enough for 1 always-on service)
- ✅ 1 GB RAM, shared CPU
- ✅ 90-day PostgreSQL free database (1 GB)
- ✅ Automatic HTTPS
- ✅ Custom domains

### After Free Database Expires (90 days):
- Upgrade to paid PostgreSQL: $7/month
- Or migrate to another provider
- Or start a new free database (with data migration)

### Paid Plans:
- **Starter**: $7/month (always-on, no sleep)
- **Standard**: $25/month (more resources)

---

## 🔄 Next Steps

After successful deployment:

1. ✅ Test all features thoroughly
2. 📝 Document your URLs (backend + frontend)
3. 🔒 Change admin password from default
4. 📊 Set up monitoring/alerts
5. 💾 Schedule database backups
6. 🚀 Share your live store!

---

## 📞 Getting Help

**Render Support**:
- Docs: https://render.com/docs
- Community: https://community.render.com
- Status: https://status.render.com

**Your Repository**:
- Check `/BACKEND_DEPLOYMENT_OPTIONS.md` for alternatives
- See `/DEPLOYMENT.md` for general deployment info

---

## 🎉 You're Done!

Your BALM Store backend should now be live on Render!

**Your URLs**:
- Backend API: `https://balm-store-api.onrender.com`
- API Docs: `https://balm-store-api.onrender.com/docs`
- Frontend: `https://your-site.netlify.app`

Test everything and enjoy your deployed store! 🎊

