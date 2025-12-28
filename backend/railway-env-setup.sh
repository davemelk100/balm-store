#!/bin/bash

# Railway Environment Variables Setup Script
# Run this after 'railway login' and 'railway link/init'

echo "🚂 Setting up Railway environment variables..."
echo ""
echo "⚠️  Make sure you've run 'railway login' and 'railway link' first!"
echo ""

# Function to prompt for variable
set_var() {
    local var_name=$1
    local default_value=$2
    local description=$3
    
    echo ""
    echo "📝 $description"
    echo "Variable: $var_name"
    
    if [ -n "$default_value" ]; then
        echo "Default: $default_value"
        read -p "Enter value (press Enter for default): " value
        value=${value:-$default_value}
    else
        read -p "Enter value: " value
    fi
    
    railway variables set "$var_name=$value"
}

# Required Variables
echo "🔐 REQUIRED VARIABLES"
echo "===================="

set_var "SECRET_KEY" "" "JWT secret key for authentication (generate a strong random string)"
set_var "ADMIN_USERNAME" "admin" "Admin username"
set_var "ADMIN_PASSWORD" "" "Admin password (choose a strong password)"

# Frontend Configuration
echo ""
echo "🌐 FRONTEND CONFIGURATION"
echo "========================="

set_var "FRONTEND_URL" "" "Your Netlify frontend URL (e.g., https://your-site.netlify.app)"
set_var "CORS_ORIGINS" "" "Comma-separated list of allowed origins (e.g., https://your-site.netlify.app,https://www.your-site.com)"

# Database (Railway will provide this if you add PostgreSQL)
echo ""
echo "🗄️  DATABASE"
echo "==========="
echo "If you're using Railway PostgreSQL, skip this (it's auto-configured)"
read -p "Are you using Railway PostgreSQL? (y/n): " use_railway_db

if [ "$use_railway_db" != "y" ]; then
    set_var "DATABASE_URL" "sqlite:///./store.db" "Database URL"
fi

# Email Configuration (Optional but recommended)
echo ""
echo "📧 EMAIL CONFIGURATION (Optional - for password reset/verification)"
echo "===================================================================="
read -p "Do you want to configure Resend email? (y/n): " setup_email

if [ "$setup_email" = "y" ]; then
    set_var "RESEND_API_KEY" "" "Resend API Key (from resend.com)"
    set_var "EMAIL_FROM" "noreply@balmsoothes.com" "From email address"
    set_var "EMAIL_FROM_NAME" "BALM Store" "From name"
fi

# Google OAuth (Optional)
echo ""
echo "🔑 GOOGLE OAUTH (Optional - for Google Sign-In)"
echo "================================================"
read -p "Do you want to configure Google OAuth? (y/n): " setup_oauth

if [ "$setup_oauth" = "y" ]; then
    set_var "GOOGLE_CLIENT_ID" "" "Google OAuth Client ID"
    set_var "GOOGLE_CLIENT_SECRET" "" "Google OAuth Client Secret"
    
    # Get Railway URL for redirect URI
    echo ""
    echo "Getting your Railway URL..."
    RAILWAY_URL=$(railway domain 2>/dev/null | head -n 1)
    
    if [ -n "$RAILWAY_URL" ]; then
        REDIRECT_URI="https://$RAILWAY_URL/api/auth/google/callback"
        set_var "GOOGLE_REDIRECT_URI" "$REDIRECT_URI" "Google OAuth Redirect URI"
    else
        set_var "GOOGLE_REDIRECT_URI" "" "Google OAuth Redirect URI (format: https://your-app.railway.app/api/auth/google/callback)"
    fi
fi

echo ""
echo "✅ Environment variables setup complete!"
echo ""
echo "📋 View all variables: railway variables"
echo "🚀 Deploy your app: railway up"
echo "📊 View logs: railway logs"
echo "🌐 Open dashboard: railway open"
echo ""

