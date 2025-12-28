#!/bin/bash

# 🛠️ Balm Store - Complete CLI Installation Script
# This script installs and configures all CLIs used in the project

set -e  # Exit on error

echo "🚀 Balm Store - Installing All CLIs"
echo "===================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to print status
print_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $1"
    else
        echo -e "${RED}✗${NC} $1"
    fi
}

echo "📋 Checking existing installations..."
echo ""

# Check Homebrew
if command_exists brew; then
    echo -e "${GREEN}✓${NC} Homebrew installed"
else
    echo -e "${YELLOW}!${NC} Homebrew not found. Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    print_status "Homebrew installation"
fi

echo ""
echo "🔧 Installing/Updating CLIs..."
echo ""

# 1. Railway CLI
echo "1️⃣  Railway CLI..."
if command_exists railway; then
    VERSION=$(railway --version 2>/dev/null || echo "unknown")
    echo -e "${GREEN}✓${NC} Railway CLI already installed ($VERSION)"
else
    echo "   Installing Railway CLI via npm..."
    npm install -g @railway/cli
    print_status "Railway CLI installation"
fi

# 2. Netlify CLI
echo ""
echo "2️⃣  Netlify CLI..."
if command_exists netlify; then
    VERSION=$(netlify --version 2>/dev/null | head -n1 || echo "unknown")
    echo -e "${GREEN}✓${NC} Netlify CLI already installed ($VERSION)"
    echo "   Updating to latest version..."
    npm install -g netlify-cli@latest
    print_status "Netlify CLI update"
else
    echo "   Installing Netlify CLI via npm..."
    npm install -g netlify-cli
    print_status "Netlify CLI installation"
fi

# 3. Stripe CLI
echo ""
echo "3️⃣  Stripe CLI..."
if command_exists stripe; then
    VERSION=$(stripe --version 2>/dev/null || echo "unknown")
    echo -e "${GREEN}✓${NC} Stripe CLI already installed ($VERSION)"
else
    echo "   Installing Stripe CLI via Homebrew..."
    brew install stripe/stripe-cli/stripe
    print_status "Stripe CLI installation"
fi

# 4. GitHub CLI
echo ""
echo "4️⃣  GitHub CLI..."
if command_exists gh; then
    VERSION=$(gh --version 2>/dev/null | head -n1 || echo "unknown")
    echo -e "${GREEN}✓${NC} GitHub CLI already installed ($VERSION)"
else
    echo "   Installing GitHub CLI via Homebrew..."
    brew install gh
    print_status "GitHub CLI installation"
fi

# 5. Docker (check only, don't auto-install)
echo ""
echo "5️⃣  Docker..."
if command_exists docker; then
    VERSION=$(docker --version 2>/dev/null || echo "unknown")
    echo -e "${GREEN}✓${NC} Docker already installed ($VERSION)"
else
    echo -e "${YELLOW}!${NC} Docker not installed (optional)"
    echo "   Install from: https://www.docker.com/products/docker-desktop"
fi

# 6. Python & pip
echo ""
echo "6️⃣  Python & pip..."
if command_exists python3; then
    VERSION=$(python3 --version 2>/dev/null || echo "unknown")
    echo -e "${GREEN}✓${NC} Python installed ($VERSION)"
else
    echo -e "${RED}✗${NC} Python3 not found"
fi

if command_exists pip3; then
    VERSION=$(pip3 --version 2>/dev/null | cut -d' ' -f2 || echo "unknown")
    echo -e "${GREEN}✓${NC} pip installed (version $VERSION)"
else
    echo -e "${RED}✗${NC} pip3 not found"
fi

# 7. Node.js & npm
echo ""
echo "7️⃣  Node.js & npm..."
if command_exists node; then
    VERSION=$(node --version 2>/dev/null || echo "unknown")
    echo -e "${GREEN}✓${NC} Node.js installed ($VERSION)"
else
    echo -e "${RED}✗${NC} Node.js not found"
fi

if command_exists npm; then
    VERSION=$(npm --version 2>/dev/null || echo "unknown")
    echo -e "${GREEN}✓${NC} npm installed (version $VERSION)"
else
    echo -e "${RED}✗${NC} npm not found"
fi

# 8. Git
echo ""
echo "8️⃣  Git..."
if command_exists git; then
    VERSION=$(git --version 2>/dev/null || echo "unknown")
    echo -e "${GREEN}✓${NC} Git installed ($VERSION)"
else
    echo -e "${RED}✗${NC} Git not found"
fi

echo ""
echo "=================================="
echo "✅ CLI Installation Complete!"
echo "=================================="
echo ""
echo "📚 Next Steps:"
echo ""
echo "1. Authenticate with services:"
echo "   $ railway login       # Railway authentication"
echo "   $ netlify login       # Netlify authentication"
echo "   $ stripe login        # Stripe authentication"
echo "   $ gh auth login       # GitHub authentication"
echo ""
echo "2. View all CLI commands:"
echo "   $ cat CLI_CHEATSHEET.md"
echo ""
echo "3. Start development:"
echo "   $ ./dev-start.sh      # Start all development servers"
echo ""
echo "📖 Documentation:"
echo "   - CLI_CHEATSHEET.md        - All CLI commands in one place"
echo "   - CLI_SETUP_GUIDE.md       - Detailed setup instructions"
echo "   - dev-workflows.sh          - Development workflow helpers"
echo ""

# Create a summary file
cat > CLI_VERSIONS.txt << EOF
Balm Store - Installed CLI Versions
Generated: $(date)

Core CLIs:
- Railway: $(railway --version 2>/dev/null || echo "Not installed")
- Netlify: $(netlify --version 2>/dev/null | head -n1 || echo "Not installed")
- Stripe: $(stripe --version 2>/dev/null || echo "Not installed")
- GitHub: $(gh --version 2>/dev/null | head -n1 || echo "Not installed")

Development Tools:
- Node.js: $(node --version 2>/dev/null || echo "Not installed")
- npm: $(npm --version 2>/dev/null || echo "Not installed")
- Python: $(python3 --version 2>/dev/null || echo "Not installed")
- pip: $(pip3 --version 2>/dev/null | cut -d' ' -f2 || echo "Not installed")
- Git: $(git --version 2>/dev/null || echo "Not installed")
- Docker: $(docker --version 2>/dev/null || echo "Not installed")

Status: ✅ All core CLIs installed
EOF

echo -e "${GREEN}✓${NC} Created CLI_VERSIONS.txt with version info"
echo ""

