#!/bin/bash
# Setup script for balmsoothes.com production domain

echo "🚀 Setting up production domain for balmsoothes.com"
echo "=================================================="
echo ""

# Get Railway backend URL
echo "📡 Getting Railway backend URL..."
RAILWAY_URL=$(railway domain 2>/dev/null | head -n 1)

if [ -n "$RAILWAY_URL" ]; then
    echo "✅ Railway URL: https://$RAILWAY_URL"
    echo ""
    
    # Set Railway environment variables
    echo "🔧 Setting Railway environment variables..."
    railway variables set FRONTEND_URL="https://balmsoothes.com"
    railway variables set CORS_ORIGINS="https://balmsoothes.com,https://www.balmsoothes.com,http://localhost:8888,http://localhost:5173"
    
    # If Google OAuth is configured, set the redirect URI
    GOOGLE_CLIENT_ID=$(railway variables get GOOGLE_CLIENT_ID 2>/dev/null)
    if [ -n "$GOOGLE_CLIENT_ID" ]; then
        echo "🔑 Google OAuth detected, updating redirect URI..."
        railway variables set GOOGLE_REDIRECT_URI="https://$RAILWAY_URL/api/auth/google/callback"
    fi
    
    echo ""
    echo "✅ Railway configuration complete!"
    echo ""
    echo "📋 NEXT STEPS:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "1. Update Google OAuth Console (if using Google login):"
    echo "   https://console.cloud.google.com/apis/credentials"
    echo ""
    echo "   Add these Authorized JavaScript origins:"
    echo "   • https://balmsoothes.com"
    echo "   • https://www.balmsoothes.com"
    echo ""
    echo "   Add this Authorized redirect URI:"
    echo "   • https://$RAILWAY_URL/api/auth/google/callback"
    echo ""
    echo "2. Update Netlify Environment Variables:"
    echo "   https://app.netlify.com"
    echo ""
    echo "   Set VITE_API_BASE to:"
    echo "   • https://$RAILWAY_URL"
    echo ""
    echo "3. Configure custom domain in Netlify:"
    echo "   • Site Settings → Domain Management"
    echo "   • Add balmsoothes.com as primary domain"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
else
    echo "❌ Could not detect Railway URL"
    echo "Please make sure you're logged in to Railway CLI"
    echo ""
    echo "Run: railway login"
fi

