#!/bin/bash

# Helper script to check inventory
# Usage: ./check-inventory.sh [--csv|--json]

# Try to load from .env file if STRIPE_SECRET_KEY is not already set
if [ -z "$STRIPE_SECRET_KEY" ] && [ -f .env ]; then
  echo "📝 Loading STRIPE_SECRET_KEY from .env file..."
  export $(cat .env | grep STRIPE_SECRET_KEY | xargs)
fi

# Check if STRIPE_SECRET_KEY is set
if [ -z "$STRIPE_SECRET_KEY" ]; then
  echo "❌ Error: STRIPE_SECRET_KEY not set and not found in .env"
  echo ""
  echo "Please either:"
  echo "  1. Add STRIPE_SECRET_KEY to .env file, OR"
  echo "  2. Export it: export STRIPE_SECRET_KEY=sk_test_your_key_here"
  echo ""
  echo "Get your key from: https://dashboard.stripe.com/test/apikeys"
  exit 1
fi

# Use stripe from netlify/functions/node_modules
NODE_PATH=./netlify/functions/node_modules node scripts/verify-inventory.js "$@"

