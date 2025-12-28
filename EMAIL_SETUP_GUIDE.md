# Email System Setup Guide

## Overview

Complete email functionality for password resets, email verification, and transactional emails using SendGrid.

## Features Implemented

✅ **Password Reset** - Users can request password reset via email
✅ **Email Verification** - New users verify their email address (optional)
✅ **Welcome Emails** - Sent after successful registration
✅ **Secure Tokens** - Time-limited, signed tokens for security
✅ **Email Templates** - Professional HTML and text versions

## Setup Instructions

### 1. Get SendGrid API Key

1. Go to [SendGrid](https://sendgrid.com/) and sign up (free tier: 100 emails/day)
2. Verify your sender email: Settings → Sender Authentication
3. Create API Key:
   - Settings → API Keys → Create API Key
   - Name it: "BALM Store Production"
   - Give it "Full Access" or "Mail Send" permission
   - **Copy the key immediately** (you won't see it again!)

### 2. Configure Environment Variables

Add these to your **Railway** environment variables:

```bash
# SendGrid Configuration
SENDGRID_API_KEY=SG.your-sendgrid-api-key-here
EMAIL_FROM=noreply@balmsoothes.com
EMAIL_FROM_NAME=BALM Store

# Token expiry times
PASSWORD_RESET_TOKEN_EXPIRE_MINUTES=30
EMAIL_VERIFICATION_TOKEN_EXPIRE_MINUTES=1440

# Frontend URL (for email links)
FRONTEND_URL=https://balmsoothes.com
```

### 3. Verify Sender Domain (Important!)

**Option A: Single Sender Verification** (Quick, Free)
- In SendGrid: Settings → Sender Authentication → Verify Single Sender
- Use: `noreply@balmsoothes.com`
- Check your inbox and click verification link

**Option B: Domain Authentication** (Professional, Recommended)
- In SendGrid: Settings → Sender Authentication → Authenticate Domain
- Add DNS records to your domain (Netlify DNS if using balmsoothes.com)
- Better deliverability, looks more professional

### 4. Add Password Reset Endpoints

Create `/Users/davemelkonian/Movies/repos/balm-store/backend/app/api/routes/password_reset.py`:

```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

from app.db.database import get_db
from app.models.user import User
from app.core.security import (
    get_password_hash,
    generate_password_reset_token,
    verify_password_reset_token
)
from app.core.email import email_service

router = APIRouter(prefix="/api/auth", tags=["password-reset"])


class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str


@router.post("/forgot-password")
def request_password_reset(
    data: PasswordResetRequest,
    db: Session = Depends(get_db)
):
    """Request password reset email"""
    user = db.query(User).filter(User.email == data.email).first()
    
    # Always return success (don't leak user existence)
    # But only send email if user exists
    if user:
        token = generate_password_reset_token(user.email)
        email_service.send_password_reset_email(user.email, token)
    
    return {
        "message": "If that email exists, we sent a password reset link"
    }


@router.post("/reset-password")
def reset_password(
    data: PasswordResetConfirm,
    db: Session = Depends(get_db)
):
    """Reset password with token"""
    email = verify_password_reset_token(data.token)
    
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired token"
        )
    
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update password
    user.hashed_password = get_password_hash(data.new_password)
    db.commit()
    
    return {"message": "Password reset successful"}
```

### 5. Register the New Route

In `/Users/davemelkonian/Movies/repos/balm-store/backend/app/main.py`, add:

```python
from app.api.routes import auth, products, password_reset

# ... existing code ...

app.include_router(auth.router)
app.include_router(products.router)
app.include_router(password_reset.router)  # Add this line
```

### 6. Create Frontend Pages

#### Forgot Password Page (`frontend/src/store/pages/ForgotPassword.tsx`):

```typescript
import { useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../config/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setMessage(data.message);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-8">
        <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
        
        {message && (
          <div className="p-4 mb-4 bg-green-100 text-green-800 rounded">
            {message}
          </div>
        )}
        
        {error && (
          <div className="p-4 mb-4 bg-red-100 text-red-800 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full p-3 border rounded mb-4"
            required
          />
          
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-black text-white rounded"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="mt-4 text-center">
          <Link to="/login" className="text-blue-600">Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
```

#### Reset Password Page (`frontend/src/store/pages/ResetPassword.tsx`):

```typescript
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config/api";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: password }),
      });

      if (response.ok) {
        alert("Password reset successful!");
        navigate("/login");
      } else {
        const data = await response.json();
        setError(data.detail || "Failed to reset password");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return <div>Invalid reset link</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-8">
        <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
        
        {error && (
          <div className="p-4 mb-4 bg-red-100 text-red-800 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            className="w-full p-3 border rounded mb-4"
            required
          />
          
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            className="w-full p-3 border rounded mb-4"
            required
          />
          
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-black text-white rounded"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
```

### 7. Add Routes to App.tsx

```typescript
import ForgotPassword from "./store/pages/ForgotPassword";
import ResetPassword from "./store/pages/ResetPassword";

// In your Routes:
<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password" element={<ResetPassword />} />
```

### 8. Add "Forgot Password" Link to Login Page

In your Login.tsx form, add below the password field:

```tsx
<p className="text-right text-sm mt-2">
  <Link to="/forgot-password" className="text-blue-600 hover:underline">
    Forgot password?
  </Link>
</p>
```

## Testing Locally

1. Install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

2. Set environment variable:
```bash
export SENDGRID_API_KEY="your-key-here"
```

3. Test password reset:
- Go to `/forgot-password`
- Enter your email
- Check your inbox
- Click the reset link
- Set new password

## Production Deployment

1. Add all environment variables to Railway
2. Deploy backend
3. Deploy frontend with new routes
4. Test the complete flow

## Email Templates Customization

Edit `/Users/davemelkonian/Movies/repos/balm-store/backend/app/core/email.py` to customize:
- Email styling (change colors, fonts)
- Button styles
- Footer content
- Add logo images

## Alternative Email Providers

### AWS SES (Cheapest at scale)
Replace SendGrid code with boto3:
```python
pip install boto3
# Use SES client instead of SendGrid
```

### Resend (Modern, Simple)
```python
pip install resend
# Use Resend API
```

## Troubleshooting

**Emails not sending?**
1. Check `SENDGRID_API_KEY` is set
2. Verify sender email in SendGrid dashboard
3. Check spam folder
4. Look at Railway logs for errors

**Tokens expiring too fast?**
- Increase `PASSWORD_RESET_TOKEN_EXPIRE_MINUTES`

**Emails going to spam?**
- Complete domain authentication in SendGrid
- Add SPF, DKIM records
- Use your actual domain, not generic email

## Security Best Practices

✅ Tokens are time-limited
✅ Tokens are signed (can't be forged)
✅ Don't leak user existence ("If email exists...")
✅ Passwords hashed with bcrypt
✅ HTTPS only in production

## Next Steps

- [ ] Set up SendGrid account
- [ ] Add environment variables
- [ ] Create password reset endpoints
- [ ] Create frontend pages
- [ ] Test locally
- [ ] Deploy to production
- [ ] Add email verification (optional)
- [ ] Customize email templates

---

Your users can now reset passwords and you have a complete email system ready to expand!

