# Quick Stripe Setup

## What's Missing?

Your Stripe Secret Key! The payment system needs this to create checkout sessions.

## 3-Step Setup (5 minutes)

### 1️⃣ Get Your Stripe Secret Key

1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy the **Secret key** (starts with `sk_test_`)

### 2️⃣ Add to Netlify

1. Go to your site in Netlify Dashboard
2. Site configuration → Environment variables → Add
3. Key: `STRIPE_SECRET_KEY`
4. Value: Paste your secret key

### 3️⃣ Redeploy

Click "Trigger deploy" in Netlify or push a new commit.

## Test It

Use test card: `4242 4242 4242 4242`
Any future date, any CVC, any ZIP.

---

**Full setup guide:** See `STRIPE_SETUP.md` for detailed instructions.

