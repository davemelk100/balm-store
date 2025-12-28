# 🚀 Quick Reference - BALM Store

## 🔧 Fixed Issues (Today)

1. ✅ **Google OAuth button** - Hidden when not configured
2. ✅ **Stripe checkout error** - Fixed product data format issue

---

## 💻 Local Development

### Quick Start

```bash
# If you've made changes to the frontend:
./rebuild-and-test.sh

# Or manually:
cd frontend && npm run build && cd ..
netlify dev
```

Visit: **http://localhost:8888**

### Live Development (no functions)

```bash
cd frontend
npm run dev
```

Visit: **http://localhost:5173** (Stripe won't work here)

---

## 🧪 Testing Stripe Checkout

1. ✅ Add product to cart
2. ✅ Click checkout
3. ✅ Click "Proceed to Payment"
4. ✅ Use test card: **4242 4242 4242 4242**
   - Expiry: Any future date (12/25)
   - CVC: Any 3 digits (123)
   - ZIP: Any postal code (12345)

---

## 📝 Environment Setup

### Local (netlify.toml)

```toml
[context.dev.environment]
  STRIPE_SECRET_KEY = "sk_test_51Sfa..." ✅ Already configured
```

### Production (Netlify Dashboard)

```
STRIPE_SECRET_KEY = sk_test_51Sfa... ⚠️ Need to add
```

See: **`STRIPE_FIX.md`** for step-by-step instructions

---

## 📚 Documentation

| File                      | Purpose                        |
| ------------------------- | ------------------------------ |
| `FIXES_APPLIED.md`        | Summary of today's fixes       |
| `STRIPE_FIX.md`           | Setup Stripe in production     |
| `STRIPE_LOCAL_TESTING.md` | Test Stripe locally            |
| `GOOGLE_OAUTH_SETUP.md`   | Enable Google OAuth (optional) |
| `rebuild-and-test.sh`     | Quick rebuild script           |

---

## 🎯 Current Status

| Feature           | Local    | Production       |
| ----------------- | -------- | ---------------- |
| Store & Products  | ✅       | ✅               |
| Cart              | ✅       | ✅               |
| User Auth (Email) | ✅       | ✅               |
| Google OAuth      | Hidden   | Hidden           |
| Stripe Checkout   | ✅ Fixed | ⚠️ Needs env var |

---

## 🚢 Deploy to Production

### 1. Netlify (Frontend)

```bash
cd frontend
npm run build
git add .
git commit -m "Fix: Stripe checkout and Google OAuth button"
git push
```

Or use Netlify CLI:

```bash
netlify deploy --prod
```

### 2. Add Stripe Key

- Go to Netlify Dashboard
- Site configuration → Environment variables
- Add: `STRIPE_SECRET_KEY = sk_test_51Sfa...`
- Trigger redeploy

### 3. Railway (Backend)

- No changes needed
- Already deployed ✅

---

## 🐛 Troubleshooting

### Stripe checkout fails

- Check browser console
- Look at netlify dev logs
- Verify product has price > 0

### Google button still shows

- Hard refresh: Cmd+Shift+R
- Clear browser cache
- Check backend is running

### Changes don't appear

- Rebuild: `./rebuild-and-test.sh`
- Hard refresh browser
- Check terminal for build errors

---

## 💡 Quick Commands

```bash
# Rebuild frontend
cd frontend && npm run build && cd ..

# Start local dev
netlify dev

# Deploy to production
netlify deploy --prod

# Check Stripe secret key (local)
echo $STRIPE_SECRET_KEY

# View netlify functions
netlify functions:list
```

---

## 📞 Need Help?

Check the documentation files or:

- Review browser console for errors
- Check terminal logs for details
- Verify environment variables are set
- Make sure you rebuilt after code changes

---

**Last Updated:** Dec 28, 2025  
**Status:** Ready for testing locally, needs Stripe key for production
