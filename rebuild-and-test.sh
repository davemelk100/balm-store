#!/bin/bash

# Quick rebuild script for testing changes
# This script rebuilds the frontend and reminds you to restart netlify dev

echo "🔨 Rebuilding frontend..."
cd frontend
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "📝 Next steps:"
    echo "1. Stop your current netlify dev (press Ctrl+C)"
    echo "2. Run: netlify dev"
    echo "3. Visit: http://localhost:8888"
    echo ""
    echo "🧪 Test checklist:"
    echo "  ✓ Login page - Google button should be hidden"
    echo "  ✓ Add product to cart"
    echo "  ✓ Go to checkout"
    echo "  ✓ Click 'Proceed to Payment'"
    echo "  ✓ Should redirect to Stripe (use card: 4242 4242 4242 4242)"
else
    echo "❌ Build failed! Check errors above."
    exit 1
fi

