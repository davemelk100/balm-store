# Backend Deployment Options

You have multiple choices for deploying the BALM Store backend. Railway is just one option!

## 🎯 Recommended Options (Easy + Free Tier)

### 1. **Render** (Recommended Alternative to Railway)

**Pros**: Free tier, easy setup, PostgreSQL included, similar to Railway
**Free Tier**: 750 hours/month, PostgreSQL database included

**Setup**:
1. Go to https://render.com
2. Sign up with GitHub
3. New → Web Service
4. Connect your repository
5. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Environment**: Python 3

**Environment Variables** (in Render dashboard):
```env
DATABASE_URL=<provided by Render PostgreSQL>
SECRET_KEY=<generate secure key>
ADMIN_PASSWORD=<your secure password>
CORS_ORIGINS=https://your-netlify-site.netlify.app
```

**Add Database**:
- In Render dashboard: New → PostgreSQL
- Link to your web service
- Copy `DATABASE_URL` to environment variables

---

### 2. **Fly.io**

**Pros**: Free tier, modern platform, edge deployment
**Free Tier**: 3 shared VMs, 3GB storage

**Setup**:
```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Deploy (from backend directory)
cd backend
fly launch
```

Create `fly.toml` in backend directory:
```toml
app = "balm-store"

[build]
  builder = "paketobuildpacks/builder:base"

[env]
  PORT = "8000"

[[services]]
  http_checks = []
  internal_port = 8000
  protocol = "tcp"
```

**Environment Variables**:
```bash
fly secrets set SECRET_KEY="your-secret-key"
fly secrets set ADMIN_PASSWORD="your-password"
fly secrets set CORS_ORIGINS="https://your-site.netlify.app"
```

---

### 3. **Heroku** (Classic Choice)

**Pros**: Very mature platform, lots of documentation
**Note**: No longer has free tier (starts at $5/month)

**Setup**:
```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login
heroku login

# Create app
cd backend
heroku create balm-store-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Deploy
git push heroku main
```

Create `Procfile` in backend directory:
```
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

**Environment Variables**:
```bash
heroku config:set SECRET_KEY="your-secret-key"
heroku config:set ADMIN_PASSWORD="your-password"
heroku config:set CORS_ORIGINS="https://your-site.netlify.app"
```

---

### 4. **DigitalOcean App Platform**

**Pros**: Simple, scalable, $5/month pricing
**Free Tier**: $200 credit for 60 days

**Setup**:
1. Go to https://cloud.digitalocean.com/apps
2. Create → App
3. Connect GitHub repository
4. Configure:
   - **Source Directory**: `/backend`
   - **Type**: Web Service
   - **Build Command**: `pip install -r requirements.txt`
   - **Run Command**: `uvicorn app.main:app --host 0.0.0.0 --port 8080`

**Add Database**: Dev Database (free) or Managed PostgreSQL ($15/month)

---

### 5. **Vercel** (Serverless)

**Pros**: Same platform as frontend, serverless
**Note**: Requires serverless adaptation, SQLite won't work

**Setup**: Requires converting to serverless functions (more complex)

Not recommended for this FastAPI app unless you want to refactor.

---

### 6. **Self-Hosted VPS** (Most Control)

**Providers**: DigitalOcean, Linode, Vultr, AWS EC2
**Cost**: ~$5-10/month
**Pros**: Full control, can run anything
**Cons**: Need to manage server yourself

**Quick Setup** (Ubuntu server):
```bash
# SSH into server
ssh root@your-server-ip

# Install Python & dependencies
apt update
apt install python3-pip postgresql nginx -y

# Clone repo
git clone https://github.com/yourusername/balm-store.git
cd balm-store/backend

# Setup virtual environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Setup systemd service
cat > /etc/systemd/system/balm-store.service << EOF
[Unit]
Description=BALM Store API
After=network.target

[Service]
User=www-data
WorkingDirectory=/root/balm-store/backend
Environment="PATH=/root/balm-store/backend/venv/bin"
ExecStart=/root/balm-store/backend/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000

[Install]
WantedBy=multi-user.target
EOF

# Start service
systemctl enable balm-store
systemctl start balm-store

# Setup Nginx reverse proxy
# (configure Nginx to proxy to localhost:8000)
```

---

## 📊 Comparison Table

| Platform | Free Tier | Ease of Use | Database | Cost (Paid) | Best For |
|----------|-----------|-------------|----------|-------------|----------|
| **Render** | ✅ 750hrs | ⭐⭐⭐⭐⭐ Easy | PostgreSQL | $7/month | Beginners |
| **Railway** | ✅ $5 credit | ⭐⭐⭐⭐⭐ Easy | PostgreSQL | Usage-based | Quick deploys |
| **Fly.io** | ✅ 3 VMs | ⭐⭐⭐⭐ Medium | PostgreSQL | Usage-based | Edge/Global |
| **Heroku** | ❌ None | ⭐⭐⭐⭐⭐ Easy | PostgreSQL | $5/month | Classic/Stable |
| **DigitalOcean** | ⚠️ $200 credit | ⭐⭐⭐⭐ Medium | PostgreSQL | $5/month | Scalable |
| **VPS** | ❌ None | ⭐⭐ Hard | Self-managed | $5-10/month | Full control |

---

## 🎯 My Recommendation by Use Case

### For Beginners → **Render**
- Free tier
- Easiest setup
- Good documentation
- Similar to Railway but more generous free tier

### For Production → **Fly.io or Heroku**
- Reliable
- Good scaling options
- Enterprise-ready

### For Learning/Control → **VPS (DigitalOcean, Linode)**
- Learn deployment from scratch
- Full control
- Transferable skills

### For Quick Prototype → **Railway or Render**
- Fast setup
- GitHub integration
- Auto-deployments

---

## 🚀 Render Step-by-Step (Recommended)

Since Render is the best free alternative to Railway:

### 1. Create Account
- Go to https://render.com
- Sign up with GitHub

### 2. Create PostgreSQL Database
- Dashboard → New → PostgreSQL
- Name: `balm-store-db`
- Plan: Free
- Create Database
- **Copy** the "Internal Database URL"

### 3. Create Web Service
- Dashboard → New → Web Service
- Connect your GitHub repository
- Configure:
  - **Name**: `balm-store-api`
  - **Root Directory**: `backend`
  - **Environment**: Python 3
  - **Build Command**: `pip install -r requirements.txt`
  - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
  - **Plan**: Free

### 4. Add Environment Variables
In Render dashboard → Environment:
```env
DATABASE_URL=<paste internal database URL>
SECRET_KEY=<generate with: python -c "import secrets; print(secrets.token_urlsafe(32))">
ADMIN_PASSWORD=your-secure-password
CORS_ORIGINS=https://your-netlify-site.netlify.app
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 5. Deploy
- Click "Create Web Service"
- Wait for deployment
- Your API will be at: `https://your-app-name.onrender.com`

### 6. Update Netlify
- Go to Netlify → Environment Variables
- Set `VITE_API_URL=https://your-app-name.onrender.com`
- Redeploy

---

## 🆓 Free Tier Comparison

All of these have working free tiers:

1. **Render**: 750 hours/month + free PostgreSQL (Best for this project)
2. **Railway**: $5/month credit (~500 hours)
3. **Fly.io**: 3 shared VMs + 3GB PostgreSQL
4. **Vercel**: Unlimited serverless (but complex setup for FastAPI)

---

## ⚡ Fastest Setup

**Render** wins for fastest + easiest + free:
```bash
# Total time: ~5 minutes
1. Sign up at render.com with GitHub (30 seconds)
2. Create PostgreSQL database (1 minute)
3. Create Web Service from repo (2 minutes)
4. Add environment variables (1 minute)
5. Deploy (automatic)
```

---

## 💡 Don't Want to Use Any Platform?

### Option: Run Backend Locally, Deploy Frontend Only

If you don't want to deploy the backend yet:

1. **Keep backend running locally** (`localhost:8000`)
2. **Deploy frontend to Netlify**
3. **Problem**: Netlify can't access your localhost

**Solution**: Use a tunnel service temporarily:

```bash
# Install ngrok
brew install ngrok  # or download from ngrok.com

# Start your backend locally
cd backend
python -m uvicorn app.main:app --reload

# In another terminal, create tunnel
ngrok http 8000

# Use the ngrok URL in Netlify
VITE_API_URL=https://abc123.ngrok.io
```

⚠️ **Note**: This is for testing only, not for production!

---

## Summary

**Answer**: No, Railway is NOT required!

**Best alternatives**:
1. ✅ **Render** - Easiest + most generous free tier
2. ✅ **Fly.io** - Modern + edge deployment
3. ✅ **Heroku** - Most mature (but costs $5/month)

**My recommendation**: Use **Render** - it's free, easy, and perfect for this project.

Would you like detailed instructions for any specific platform?

