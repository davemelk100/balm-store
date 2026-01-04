# Deployment Guide

This guide covers deploying the BALM Store to production across various platforms.

## 📋 Recommended Stack
- **Frontend**: [Netlify](https://www.netlify.com/) (React + Serverless Functions)
- **Backend**: [Railway](https://railway.app/) or [Render](https://render.com/) (FastAPI)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (Managed)

---

## 🌐 Frontend Deployment (Netlify)

1. **GitHub Import**: Connect your GitHub repo to Netlify.
2. **Build Settings**:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
3. **Environment Variables**:
   - Add `VITE_API_URL` (your deployed backend URL).
   - Add `VITE_STRIPE_PUBLIC_KEY`.
   - Add `STRIPE_SECRET_KEY` (if using cart checkout).

---

## 🖥️ Backend Deployment (Railway)

1. **New Project**: Select "Deploy from GitHub repo".
2. **Root Directory**: Set to `/backend`.
3. **Add Database**: Add a PostgreSQL instance to the project.
4. **Environment Variables**:
   - `DATABASE_URL`: `${{Postgres.DATABASE_URL}}`
   - `SECRET_KEY`: Long random string (JWT auth).
   - `ADMIN_PASSWORD`: Secure password.
   - `CORS_ORIGINS`: Your Netlify URL (e.g., `https://your-store.netlify.app`).

---

## 🚀 Deployment Checklist

### Security
- [ ] Change default admin password.
- [ ] Generate a fresh `SECRET_KEY`.
- [ ] Ensure `CORS_ORIGINS` is restricted to your production domain.
- [ ] Use HTTPS (automatic on Netlify/Railway/Render).

### Stripe
- [ ] Switch to production Stripe keys (`pk_live_`, `sk_live_`).
- [ ] Configure Stripe Webhooks in the Stripe Dashboard.
- [ ] Add `STRIPE_WEBHOOK_SECRET` to your backend environment.

### Database
- [ ] Initialize the production database:
  ```bash
  railway run python scripts/init_db.py
  ```

---

## 🔍 Troubleshooting
- **CORS Errors**: Double-check the `CORS_ORIGINS` variable in your backend. It should NOT have a trailing slash.
- **API 404/500**: Check backend logs using `railway logs` or `netlify logs:function`.
- **Database Connection**: Ensure your PostgreSQL instance is fully provisioned and the URL is correct.
