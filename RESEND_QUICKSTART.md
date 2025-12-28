# 📧 Resend Quick Start

**5-minute setup to get email working!**

---

## ⚡ Super Quick Setup

### 1. Sign Up (1 min)

```
→ Go to: https://resend.com
→ Click "Get Started"
→ Sign up (no credit card!)
```

### 2. Get API Key (1 min)

```
→ Dashboard → API Keys
→ Create API Key → Name: "BALM Store"
→ Copy key (starts with re_...)
```

### 3. Install Package (1 min)

```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

### 4. Configure (1 min)

**Local (.env):**

```bash
RESEND_API_KEY=re_your_key_here
EMAIL_FROM=noreply@balmsoothes.com
```

**Production (Railway):**

```bash
railway variables set RESEND_API_KEY="re_your_key"
```

### 5. Test (1 min)

```bash
# Start backend
uvicorn app.main:app --reload

# Try sign up or password reset
# Check your email!
```

---

## 📊 What You Get

✅ **3,000 free emails/month**  
✅ **Simple API** (easier than SendGrid)  
✅ **Great deliverability**  
✅ **Beautiful dashboard**  
✅ **No credit card needed**

---

## 📖 Need More Details?

Read: `RESEND_EMAIL_SETUP.md` - Complete guide with troubleshooting

---

## 🧪 Test Email Address

Use for testing: `delivered@resend.dev`

---

**That's it! Your email is ready to go!** 🎉
