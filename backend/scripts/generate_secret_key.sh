#!/bin/bash
# Generate a secure SECRET_KEY for your Render deployment

echo "=== Generate SECRET_KEY for Render ==="
echo ""
echo "Run this command and copy the output:"
echo ""
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
echo ""
echo "Use this value for the SECRET_KEY environment variable in Render"

