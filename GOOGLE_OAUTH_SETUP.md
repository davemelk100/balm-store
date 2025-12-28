# Google OAuth Setup Guide

## Current Status

✅ **Google OAuth button is now properly hidden when not configured**

The login page was showing the "Continue with Google" button even though Google OAuth wasn't set up. This has been fixed - the button will only appear when Google OAuth is properly configured with valid credentials.

---

## How to Enable Google OAuth (Optional)

If you want to allow users to sign in with Google:

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing one)
3. Navigate to **APIs & Services** → **Credentials**
4. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
5. Choose **"Web application"**
6. Set up:
   - **Name:** BALM Store (or any name)
   - **Authorized JavaScript origins:**
     - `http://localhost:8888` (for local testing)
     - `https://your-frontend-domain.netlify.app` (for production)
   - **Authorized redirect URIs:**
     - `http://localhost:8000/api/auth/google/callback` (for local)
     - `https://your-backend-domain.railway.app/api/auth/google/callback` (for production)
7. Click **"Create"**
8. Copy your **Client ID** and **Client Secret**

### Step 2: Configure Backend Environment Variables

#### For Local Development:

Create a `.env` file in the `backend/` directory:

```env
GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback
FRONTEND_URL=http://localhost:8888
```

#### For Production (Railway):

Set these environment variables in Railway:

```bash
# Using Railway CLI
railway variables set GOOGLE_CLIENT_ID="your_client_id"
railway variables set GOOGLE_CLIENT_SECRET="your_client_secret"
railway variables set GOOGLE_REDIRECT_URI="https://your-backend.railway.app/api/auth/google/callback"
railway variables set FRONTEND_URL="https://your-frontend.netlify.app"
```

Or via Railway Dashboard:

1. Go to your project
2. Select your backend service
3. Go to **Variables** tab
4. Add each variable

### Step 3: Update Frontend URL in Backend Config

Make sure your `FRONTEND_URL` matches your actual frontend URL:

- **Local:** `http://localhost:8888`
- **Production:** `https://your-site.netlify.app`

### Step 4: Restart Your Servers

**Local:**

```bash
# Stop current server (Ctrl+C)
cd backend
source venv/bin/activate
python -m uvicorn app.main:app --reload

# In another terminal
cd /path/to/balm-store
netlify dev
```

**Production:**

- Railway will auto-redeploy when you set new variables
- Or manually trigger a redeploy

### Step 5: Test It

1. Go to your login page
2. You should now see "Continue with Google" button
3. Click it and sign in with Google
4. You'll be redirected back and logged in automatically

---

## How It Works

### Frontend Check (Login.tsx)

The frontend checks if Google OAuth is available:

```typescript
const response = await fetch(`${API_BASE_URL}/api/auth/google`);
if (response.ok && response.status === 200) {
  const data = await response.json();
  if (data.url) {
    setGoogleOAuthEnabled(true); // Show button
  }
}
```

### Backend Check (auth.py)

The backend only returns a valid URL if configured:

```python
@router.get("/google")
def google_login():
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Google OAuth is not configured"
        )
    # Return Google OAuth URL
    return {"url": google_auth_url}
```

---

## Troubleshooting

### Button still not appearing after setup

1. **Check environment variables are set:**

   ```bash
   # Local
   cd backend
   python -c "from app.core.config import settings; print(f'Client ID: {settings.GOOGLE_CLIENT_ID}')"
   ```

2. **Restart both servers** (backend and frontend)

3. **Clear browser cache** or use incognito mode

4. **Check backend logs** for any errors

### "Redirect URI mismatch" error

- Make sure the redirect URI in Google Console exactly matches your backend URL
- Format: `https://your-backend.railway.app/api/auth/google/callback`
- No trailing slash!

### "Origin not allowed" error

- Add your frontend URL to "Authorized JavaScript origins" in Google Console
- Format: `https://your-site.netlify.app` (no trailing slash)

### Users can't sign in after Google auth

- Check that `FRONTEND_URL` is correctly set in backend
- The callback redirects to `${FRONTEND_URL}/auth-callback?token=...`
- Make sure this route exists in your frontend

---

## Security Notes

⚠️ **Never commit your `.env` file!**

Add to `.gitignore`:

```
.env
.env.local
.env.*.local
```

⚠️ **Use different credentials for production and development**

⚠️ **Keep your Client Secret secure**

- Only set it in environment variables
- Never put it in code or commit it to git

---

## Alternative: Keep Google OAuth Disabled

If you don't want to use Google OAuth:

✅ **Nothing to do!** The button is already hidden when not configured.

Users can still:

- Sign up with email/password
- Log in with email/password
- Reset their password via email

---

## What Changed in This Fix

### Before:

- Google OAuth button was always visible
- Frontend only checked `response.ok`
- This could be true even when returning an error

### After:

- Button only shows when properly configured
- Frontend checks:
  1. Response status is 200
  2. Response contains a valid URL
- Backend returns 501 error when not configured
- Frontend hides button on any non-200 response

---

## Summary

**Current state:** Google OAuth is disabled and the button is hidden ✅

**To enable:** Follow steps above to get Google credentials and set environment variables

**To keep disabled:** No action needed - it's already properly hidden
