# 🔐 Environment Setup Instructions

## ⚠️ SECURITY ALERT

**Your Resend API key was shared in chat and should be regenerated!**

Current key: `re_9261uA4y_FrznSjKp98zk33kEd3sDD77q`

### Why Regenerate?

- API keys shared in chat/logs should be considered compromised
- Always regenerate keys that have been exposed
- Takes 30 seconds to get a new one

### How to Regenerate:

1. Go to [Resend Dashboard](https://resend.com/api-keys)
2. Delete the current key
3. Create a new one
4. Use the new key below

---

## 🚀 Quick Setup

### 1. Create Local `.env` File

```bash
cd backend
cat > .env << 'EOF'
# Resend Email
RESEND_API_KEY=re_9261uA4y_FrznSjKp98zk33kEd3sDD77q
EMAIL_FROM=noreply@balmsoothes.com
EMAIL_FROM_NAME=BALM Store

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Database
DATABASE_URL=sqlite:///./store.db

# Security - CHANGE THIS!
SECRET_KEY=your-secret-key-change-this

# Admin - CHANGE THESE!
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,http://localhost:8080,http://localhost:8888
EOF
```

### 2. Install Dependencies

```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Test Email

```bash
# Start backend
uvicorn app.main:app --reload

# Try password reset or sign up
# Check your email!
```

---

## 🌐 Production Setup (Railway)

### Option 1: Using Railway CLI

```bash
cd backend

# Resend Email
railway variables set RESEND_API_KEY="re_9261uA4y_FrznSjKp98zk33kEd3sDD77q"
railway variables set EMAIL_FROM="noreply@balmsoothes.com"
railway variables set EMAIL_FROM_NAME="BALM Store"

# Frontend URL (update with your Netlify URL)
railway variables set FRONTEND_URL="https://your-site.netlify.app"

# Security (generate with: python -c 'import secrets; print(secrets.token_urlsafe(32))')
railway variables set SECRET_KEY="your-generated-secret"

# Admin credentials
railway variables set ADMIN_USERNAME="admin"
railway variables set ADMIN_PASSWORD="your-secure-password"

# CORS (update with your Netlify URL)
railway variables set CORS_ORIGINS="https://your-site.netlify.app"
```

### Option 2: Using Helper Script

```bash
cd backend
./railway-env-setup.sh
```

Follow the prompts and it will set everything up!

### Option 3: Railway Dashboard

1. Go to your Railway project
2. Click on your service
3. Go to "Variables" tab
4. Add each variable manually

---

## ✅ Verification Checklist

After setup:

- [ ] `.env` file created in `backend/`
- [ ] Dependencies installed (`pip install -r requirements.txt`)
- [ ] Backend starts without errors
- [ ] Can trigger password reset (sends email)
- [ ] Can sign up new user (sends verification email)
- [ ] Emails appear in inbox (check spam if not)

---

## 🔒 Security Reminders

### Before Going Live:

1. **Regenerate Resend API key** (since it was shared)
2. **Change SECRET_KEY** - Generate a strong one:
   ```bash
   python -c 'import secrets; print(secrets.token_urlsafe(32))'
   ```
3. **Change ADMIN_PASSWORD** - Use a strong password
4. **Update FRONTEND_URL** - Use your actual Netlify URL
5. **Update CORS_ORIGINS** - Only allow your Netlify domain

### Never Commit:

- ❌ `.env` files
- ❌ API keys
- ❌ Passwords
- ❌ Secret keys

These should only be in environment variables!

---

## 🧪 Test Commands

### Test Email Locally

```bash
cd backend
source venv/bin/activate
python -c "
from app.core.email import email_service
result = email_service.send_email(
    to_email='your-email@example.com',
    subject='Test',
    html_content='<h1>Works!</h1>',
    text_content='Works!'
)
print('✅ Success!' if result else '❌ Failed')
"
```

### Check Railway Variables

```bash
cd backend
railway variables | grep RESEND
```

### View Logs

```bash
# Local
# Check terminal where uvicorn is running

# Production
railway logs --tail | grep "Email sent"
```

---

## 📖 More Information

- Complete guide: `RESEND_EMAIL_SETUP.md`
- Quick start: `RESEND_QUICKSTART.md`
- Resend dashboard: [resend.com/emails](https://resend.com/emails)

---

## 🎉 You're Ready!

Your Resend API key is configured. Just:

1. Create the `.env` file (see command above)
2. Install dependencies
3. Start coding!

**Remember to regenerate your API key for security!**
