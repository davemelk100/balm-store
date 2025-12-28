# 🚂 Railway CLI - Quick Reference Card

## 📦 Installation Complete ✅

Railway CLI v4.16.1 is installed and ready to use!

---

## 🚀 Quick Deploy (3 Steps)

### 1. Login to Railway

```bash
railway login
```

→ Opens browser for authentication

### 2. Link Your Project

```bash
cd backend
railway init
# OR if you have an existing project:
railway link
```

### 3. Deploy!

```bash
railway up
```

---

## ⚙️ Environment Variables (Easy Mode)

We've created a helper script for you!

```bash
cd backend
./railway-env-setup.sh
```

This will interactively guide you through setting all required variables.

### Manual Setup (Alternative)

```bash
# Essential
railway variables set SECRET_KEY="your-secret-key"
railway variables set ADMIN_USERNAME="admin"
railway variables set ADMIN_PASSWORD="secure-password"
railway variables set FRONTEND_URL="https://your-netlify-site.app"
railway variables set CORS_ORIGINS="https://your-netlify-site.app"

# Email (Optional but recommended)
railway variables set SENDGRID_API_KEY="your-sendgrid-key"
railway variables set EMAIL_FROM="noreply@balmsoothes.com"

# View all
railway variables
```

---

## 🗄️ Database Options

### Option A: SQLite (Quick Start)

Already configured! Just deploy.
⚠️ Note: Data persists only with Railway volumes

### Option B: PostgreSQL (Production Ready)

```bash
railway add postgresql
```

Railway auto-configures `DATABASE_URL` for you!

Then run migrations:

```bash
railway run python scripts/init_db.py
```

---

## 📊 Essential Commands

| Command               | What It Does                 |
| --------------------- | ---------------------------- |
| `railway login`       | Authenticate                 |
| `railway link`        | Connect to existing project  |
| `railway init`        | Create new project           |
| `railway up`          | Deploy now                   |
| `railway logs`        | View logs (live)             |
| `railway logs --tail` | Follow logs                  |
| `railway status`      | Check deployment status      |
| `railway open`        | Open dashboard in browser    |
| `railway variables`   | List all env vars            |
| `railway domain`      | Get your app URL             |
| `railway run <cmd>`   | Run command with Railway env |

---

## 🔗 After Deployment

### 1. Get Your Railway URL

```bash
railway domain
```

### 2. Update Frontend API URL

Edit `frontend/src/config/api.ts`:

```typescript
const API_URL = import.meta.env.PROD
  ? "https://your-app.railway.app" // ← Your Railway URL
  : "http://localhost:8000";
```

### 3. Update Netlify Environment Variables

Add to Netlify:

```
VITE_API_URL=https://your-app.railway.app
```

### 4. Test It!

Visit your Netlify site and test:

- Login/Register
- Product viewing
- Shopping cart
- Checkout

---

## 🐛 Troubleshooting

### View Logs

```bash
railway logs --tail
```

### Check Environment Variables

```bash
railway variables
```

### Test Locally with Railway Env

```bash
railway run uvicorn app.main:app --reload
```

### Deployment Failed?

```bash
railway status
railway logs
```

### Get Help

```bash
railway help
railway <command> --help
```

---

## 🎯 Your Deployment Checklist

- [ ] Run `railway login`
- [ ] Run `cd backend && railway init`
- [ ] Run `./railway-env-setup.sh` or set variables manually
- [ ] (Optional) Run `railway add postgresql` for production DB
- [ ] Run `railway up` to deploy
- [ ] Run `railway domain` to get your URL
- [ ] Update frontend API URL
- [ ] Add Railway URL to Netlify env vars
- [ ] Test your live site!

---

## 📚 Documentation

- Full Guide: `RAILWAY_CLI_SETUP.md`
- Email Setup: `EMAIL_SETUP_GUIDE.md`
- Deployment: `DEPLOYMENT.md`
- Railway Docs: https://docs.railway.app

---

**Ready?** Start with `railway login` 🚀
