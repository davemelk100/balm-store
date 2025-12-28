# 📧 Resend Email Setup Guide

## Why Resend?

✅ **3,000 free emails/month** - More than enough to start  
✅ **$20/month for 50,000** - Affordable scaling  
✅ **Modern, simple API** - Easier than SendGrid  
✅ **Great deliverability** - Emails actually reach inboxes  
✅ **No credit card needed** - For free tier  
✅ **Instant setup** - No verification wait

---

## 📋 What Emails Does Your App Send?

Your BALM Store uses email for:

- 🔐 **Password Reset** - When users forget their password
- ✉️ **Email Verification** - When users sign up
- 👋 **Welcome Emails** - After successful registration

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Sign Up for Resend

1. Go to [resend.com](https://resend.com)
2. Click "Get Started"
3. Sign up with GitHub or email (no credit card needed!)
4. Verify your email

### Step 2: Get Your API Key

1. In Resend dashboard, go to **API Keys**
2. Click **Create API Key**
3. Name it: `BALM Store`
4. Select permissions: **Sending access**
5. Click **Add**
6. Copy your API key (starts with `re_...`)
   - ⚠️ Save it now! You won't see it again

### Step 3: Add Domain (Optional but Recommended)

**For Development/Testing:**

- ✅ Skip this - use Resend's test domain
- Emails will come from: `onboarding@resend.dev`

**For Production:**

1. Go to **Domains** in Resend dashboard
2. Click **Add Domain**
3. Enter your domain: `balmsoothes.com`
4. Add the DNS records Resend provides:
   - SPF record
   - DKIM record
   - DMARC record (optional but recommended)
5. Wait 5-10 minutes for DNS propagation
6. Verify domain in Resend

### Step 4: Configure Your App

#### Local Development

Add to your `.env` file:

```bash
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=noreply@balmsoothes.com
EMAIL_FROM_NAME=BALM Store
```

#### Production (Railway)

```bash
# Option 1: Using Railway CLI
cd backend
railway variables set RESEND_API_KEY="re_your_api_key_here"
railway variables set EMAIL_FROM="noreply@balmsoothes.com"
railway variables set EMAIL_FROM_NAME="BALM Store"

# Option 2: Using the helper script
./railway-env-setup.sh
# Select "y" for email configuration

# Option 3: Railway Dashboard
# Go to your project → Variables → Add variables
```

### Step 5: Install Dependencies

```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

This will install `resend==2.5.0` (already added to requirements.txt)

### Step 6: Test It!

#### Test Email Sending

Create a test script:

```python
# backend/test_email.py
from app.core.email import email_service

# Test sending an email
result = email_service.send_email(
    to_email="your-email@example.com",
    subject="Test from BALM Store",
    html_content="<h1>It works!</h1><p>Resend is configured correctly.</p>",
    text_content="It works! Resend is configured correctly."
)

if result:
    print("✅ Email sent successfully!")
else:
    print("❌ Email failed to send. Check your API key.")
```

Run it:

```bash
cd backend
source venv/bin/activate
python test_email.py
```

---

## 🎯 Environment Variables Reference

| Variable          | Required?   | Example                        | Description          |
| ----------------- | ----------- | ------------------------------ | -------------------- |
| `RESEND_API_KEY`  | ✅ Yes      | `re_123abc...`                 | Your Resend API key  |
| `EMAIL_FROM`      | ✅ Yes      | `noreply@balmsoothes.com`      | Sender email address |
| `EMAIL_FROM_NAME` | ⚠️ Optional | `BALM Store`                   | Sender display name  |
| `FRONTEND_URL`    | ✅ Yes      | `https://yoursite.netlify.app` | For email links      |

---

## 📧 Email Templates

Your app includes these pre-configured email templates:

### 1. Password Reset Email

**When sent:** User clicks "Forgot Password"  
**Contains:** Reset link with token  
**Expires:** 30 minutes (configurable)

### 2. Email Verification

**When sent:** User signs up  
**Contains:** Verification link  
**Expires:** 24 hours

### 3. Welcome Email

**When sent:** After successful verification  
**Contains:** Link to start shopping

All templates use:

- ✅ Responsive HTML design
- ✅ Plain text fallback
- ✅ Branded with BALM Store colors

---

## 🧪 Testing

### Test Cards (For Full Checkout Flow)

When testing with Stripe + Resend together:

1. Add items to cart
2. Checkout with test card: `4242 4242 4242 4242`
3. Complete payment
4. Check your email for order confirmation (if implemented)

### Test Email Addresses

Resend provides test email addresses for development:

- ✅ `delivered@resend.dev` - Always delivers
- ✅ `bounced@resend.dev` - Simulates bounce
- ✅ `complained@resend.dev` - Simulates spam complaint

### Check Logs

```bash
# Backend logs (local)
# Check terminal where uvicorn is running

# Backend logs (Railway)
railway logs --tail

# Look for:
# ✅ "Email sent successfully: [subject] to [email]"
# ❌ "Error sending email: [error]"
```

---

## 🔧 Troubleshooting

### Issue: "Email not sent (Resend not configured)"

**Cause:** `RESEND_API_KEY` not set

**Solution:**

```bash
# Check if set
echo $RESEND_API_KEY  # Local
railway variables | grep RESEND  # Railway

# Set it
export RESEND_API_KEY="re_xxx"  # Local
railway variables set RESEND_API_KEY="re_xxx"  # Railway
```

### Issue: "Error sending email: 401 Unauthorized"

**Cause:** Invalid API key

**Solution:**

1. Get a new API key from Resend dashboard
2. Update environment variable
3. Restart your app

### Issue: "Email sent but not received"

**Possible causes:**

1. ✅ Check spam folder
2. ✅ Verify `EMAIL_FROM` is correct
3. ✅ Check Resend dashboard → **Emails** for delivery status
4. ✅ For production: verify your domain is configured

**Solution:**

```bash
# Test with a known-good address
delivered@resend.dev
```

### Issue: "Domain not verified"

**For production only:**

**Solution:**

1. Go to Resend dashboard → **Domains**
2. Check DNS records are added correctly
3. Wait 5-10 minutes for propagation
4. Click **Verify** in Resend dashboard

### Issue: ModuleNotFoundError: No module named 'resend'

**Cause:** Package not installed

**Solution:**

```bash
cd backend
source venv/bin/activate
pip install resend
# Or reinstall all
pip install -r requirements.txt
```

---

## 📊 Monitoring & Analytics

### Resend Dashboard

View in real-time:

- 📨 Emails sent
- ✅ Delivery rate
- 🚫 Bounces
- 📈 Opens (if tracking enabled)
- 🔗 Clicks (if tracking enabled)

### Access Dashboard

```bash
# Open Resend dashboard
open https://resend.com/emails
# Or from CLI:
echo "View your emails at: https://resend.com/emails"
```

---

## 💰 Pricing & Limits

### Free Tier

- ✅ **3,000 emails/month**
- ✅ **100 emails/day**
- ✅ All features included
- ✅ No credit card needed
- ✅ Forever free

### Paid Plans (When You Need More)

- 💰 **$20/month** - 50,000 emails
- 💰 **$80/month** - 250,000 emails
- 💰 **$200/month** - 1,000,000 emails

### What Counts as an Email?

- ✅ Each recipient = 1 email
- ✅ BCC'd emails count separately
- ✅ Failed sends don't count

---

## 🚀 Production Checklist

Before going live:

- [ ] Resend API key added to Railway
- [ ] Domain verified in Resend (for branded emails)
- [ ] `EMAIL_FROM` uses your domain
- [ ] Test all email types:
  - [ ] Password reset
  - [ ] Email verification
  - [ ] Welcome email
- [ ] Check spam folder (shouldn't be there with verified domain)
- [ ] Set up email monitoring in Resend dashboard

---

## 🔒 Security Best Practices

### API Key Security

✅ **DO:**

- Store API key in environment variables
- Use different keys for dev/production
- Rotate keys periodically
- Keep keys in Railway/Netlify (not in code)

❌ **DON'T:**

- Commit API keys to Git
- Share keys publicly
- Use production key in development
- Store in frontend code

### Email Security

✅ **DO:**

- Use HTTPS for all reset/verification links
- Set token expiration (already configured)
- Rate limit email sends
- Validate email addresses before sending

---

## 📚 API Documentation

### Basic Usage

```python
import resend

resend.api_key = "re_your_key"

params = {
    "from": "BALM Store <noreply@balmsoothes.com>",
    "to": ["user@example.com"],
    "subject": "Hello!",
    "html": "<p>Welcome!</p>",
    "text": "Welcome!"  # Optional fallback
}

email = resend.Emails.send(params)
print(email)  # {'id': 're_xxx'}
```

### Your Wrapper (Already Configured)

```python
from app.core.email import email_service

# Send password reset
email_service.send_password_reset_email(
    to_email="user@example.com",
    reset_token="abc123"
)

# Send verification
email_service.send_verification_email(
    to_email="user@example.com",
    verification_token="xyz789"
)

# Send welcome
email_service.send_welcome_email(
    to_email="user@example.com",
    name="John"
)
```

---

## 🆚 Resend vs SendGrid

| Feature            | Resend       | SendGrid               |
| ------------------ | ------------ | ---------------------- |
| **Free Tier**      | 3,000/month  | 100/day (~3,000/month) |
| **Pricing**        | $20/50k      | $20/50k (similar)      |
| **Setup**          | ⚡ Instant   | ⏳ Slower              |
| **API**            | 🎯 Simple    | 📚 Complex             |
| **Dashboard**      | 🎨 Modern    | 🗂️ Older               |
| **Deliverability** | ✅ Excellent | ✅ Excellent           |
| **Support**        | ✅ Great     | ✅ Good                |

**Winner:** Resend (simpler, more modern)

---

## 🔗 Useful Links

- [Resend Dashboard](https://resend.com)
- [Resend Docs](https://resend.com/docs)
- [Resend Python SDK](https://github.com/resendlabs/resend-python)
- [Domain Setup Guide](https://resend.com/docs/send-with-domains)
- [Email Best Practices](https://resend.com/docs/best-practices)

---

## 💡 Pro Tips

### 1. Use React Email (Future Enhancement)

Resend works great with React Email for better templates:

```bash
# Future improvement
npm install react-email @react-email/components
```

### 2. Add Email Tracking (Optional)

```python
# Add tracking to params
params = {
    "from": "...",
    "to": ["..."],
    "subject": "...",
    "html": "...",
    "tags": [{"name": "category", "value": "password_reset"}],
}
```

### 3. Batch Emails (If Needed)

```python
# Send to multiple recipients efficiently
params = {
    "from": "...",
    "to": ["user1@example.com", "user2@example.com"],
    "subject": "...",
    "html": "..."
}
```

---

## ✅ Migration Complete!

You've successfully switched from SendGrid to Resend! 🎉

**What changed:**

- ✅ `email.py` - Now uses Resend API
- ✅ `config.py` - Uses `RESEND_API_KEY`
- ✅ `requirements.txt` - Replaced sendgrid with resend
- ✅ Railway setup script - Updated for Resend

**What stayed the same:**

- ✅ All your email templates
- ✅ All your email functions
- ✅ How you call email functions in your code

**Next steps:**

1. Sign up at resend.com
2. Get API key
3. Add to environment variables
4. Test it!

---

**Need help?** Check the troubleshooting section or [Resend's docs](https://resend.com/docs).
