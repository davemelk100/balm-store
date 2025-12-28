#!/bin/bash

# Quick test script for BALM Store with Netlify functions

echo "🚀 Starting BALM Store with Netlify Dev"
echo ""
echo "This will:"
echo "  ✓ Start frontend on http://localhost:8888"
echo "  ✓ Load .env automatically"
echo "  ✓ Enable Netlify functions"
echo "  ✓ Allow testing Stripe checkout locally"
echo ""
echo "Press Ctrl+C to stop"
echo ""

cd "$(dirname "$0")"
netlify dev

