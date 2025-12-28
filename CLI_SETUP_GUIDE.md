# 🚀 Complete CLI Setup Guide - Balm Store

This guide covers all command-line tools used in the Balm Store project, from installation to advanced usage.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Authentication](#authentication)
4. [Configuration](#configuration)
5. [Common Workflows](#common-workflows)
6. [Troubleshooting](#troubleshooting)

---

## Overview

### CLIs Used in This Project

| CLI             | Purpose                         | Required?   | Status           |
| --------------- | ------------------------------- | ----------- | ---------------- |
| **Railway CLI** | Backend deployment              | ✅ Yes      | ✅ Installed     |
| **Netlify CLI** | Frontend deployment & functions | ✅ Yes      | ✅ Installed     |
| **Stripe CLI**  | Payment testing & webhooks      | ⚠️ Dev only | ✅ Installed     |
| **GitHub CLI**  | Repository management           | 📝 Optional | ✅ Installed     |
| **npm**         | Node.js packages                | ✅ Yes      | ✅ Pre-installed |
| **pip**         | Python packages                 | ✅ Yes      | ✅ Pre-installed |
| **Git**         | Version control                 | ✅ Yes      | ✅ Pre-installed |
| **Docker**      | Containerization                | 📝 Optional | ✅ Available     |

---

## Installation

### Quick Install (All CLIs)

Run the automated installation script:

```bash
./install-all-clis.sh
```

This will install/update:

- Railway CLI (npm)
- Netlify CLI (npm)
- Stripe CLI (Homebrew)
- GitHub CLI (Homebrew)

### Manual Installation

<details>
<summary><b>Railway CLI</b></summary>

```bash
# Using npm (recommended)
npm install -g @railway/cli

# Using Homebrew
brew install railway

# Verify installation
railway --version
```

</details>

<details>
<summary><b>Netlify CLI</b></summary>

```bash
# Using npm (recommended)
npm install -g netlify-cli

# Verify installation
netlify --version
```

</details>

<details>
<summary><b>Stripe CLI</b></summary>

```bash
# Using Homebrew (macOS)
brew install stripe/stripe-cli/stripe

# Using Scoop (Windows)
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe

# Using apt (Linux)
wget https://github.com/stripe/stripe-cli/releases/latest/download/stripe_linux_x86_64.tar.gz
tar -xvf stripe_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin/

# Verify installation
stripe --version
```

</details>

<details>
<summary><b>GitHub CLI</b></summary>

```bash
# Using Homebrew (macOS)
brew install gh

# Using apt (Ubuntu/Debian)
sudo apt install gh

# Using winget (Windows)
winget install --id GitHub.cli

# Verify installation
gh --version
```

</details>

---

## Authentication

### One-Command Login (All Services)

```bash
./dev-workflows.sh
# Then select option 14: "Login to all services"
```

### Manual Authentication

#### Railway CLI

```bash
railway login
# Opens browser for authentication
# Automatically saves token
```

#### Netlify CLI

```bash
netlify login
# Opens browser for authentication
# Saves token to ~/.netlify
```

#### Stripe CLI

```bash
stripe login
# Opens browser for authentication
# OR use API key directly:
stripe login --api-key sk_test_...
```

#### GitHub CLI

```bash
gh auth login
# Interactive prompts:
# 1. Select GitHub.com
# 2. Select HTTPS or SSH
# 3. Authenticate via browser
```

### Check Authentication Status

```bash
./dev-workflows.sh
# Select option 15: "Check authentication status"

# Or manually:
railway whoami
netlify status
gh auth status
stripe config --list
```

---

## Configuration

### Project Linking

#### Railway (Backend)

```bash
cd backend
railway init    # Create new project
# OR
railway link    # Link to existing project
```

#### Netlify (Frontend)

```bash
cd /path/to/balm-store
netlify init    # Create new site
# OR
netlify link    # Link to existing site
```

### Environment Variables

#### Railway

```bash
# Set variables
railway variables set SECRET_KEY="your-secret-key"
railway variables set ADMIN_PASSWORD="secure-password"
railway variables set FRONTEND_URL="https://your-site.netlify.app"

# Or use the helper script
cd backend
./railway-env-setup.sh

# View all variables
railway variables
```

#### Netlify

```bash
# Set variables
netlify env:set VITE_API_URL "https://your-backend.railway.app"
netlify env:set VITE_STRIPE_PUBLIC_KEY "pk_test_..."

# View variables
netlify env:list

# Import from .env file
netlify env:import .env
```

### Database Setup

#### Railway PostgreSQL

```bash
cd backend
railway add postgresql
# Automatically sets DATABASE_URL

# Run migrations
railway run python scripts/init_db.py

# Connect to database
railway connect postgres
```

---

## Common Workflows

### Daily Development

#### Start Everything Locally

```bash
./dev-workflows.sh
# Select option 1: "Start full local environment"

# Or manually in separate terminals:

# Terminal 1: Backend
cd backend
source venv/bin/activate
uvicorn app.main:app --reload

# Terminal 2: Frontend (with functions)
netlify dev

# Terminal 3: Stripe webhooks (optional)
stripe listen --forward-to http://localhost:8888/.netlify/functions/create-checkout-session
```

#### Quick Status Check

```bash
./dev-workflows.sh
# Select option 11: "Check all deployment statuses"

# Or manually:
railway status          # Backend
netlify status          # Frontend
git status              # Git
```

### Deployment

#### Deploy Everything

```bash
./dev-workflows.sh
# Select option 10: "Deploy everything"

# Or manually:
cd backend && railway up
cd .. && netlify deploy --prod
```

#### Deploy Backend Only

```bash
cd backend
railway up

# View deployment
railway status
railway logs --tail
```

#### Deploy Frontend Only

```bash
netlify deploy --prod

# Or deploy to draft first
netlify deploy
# Check draft URL, then deploy to prod
netlify deploy --prod
```

### Testing & Debugging

#### Test Stripe Payments Locally

```bash
# Terminal 1: Start Stripe listener
stripe listen --forward-to http://localhost:8888/.netlify/functions/create-checkout-session

# Terminal 2: Start Netlify Dev
netlify dev

# Terminal 3: Trigger test event
stripe trigger checkout.session.completed

# Use test cards in browser:
# Success: 4242 4242 4242 4242
# Decline: 4000 0000 0000 0002
```

#### View Logs

```bash
# Backend logs (Railway)
railway logs --tail

# Frontend logs (Netlify)
netlify logs:deploy

# Function logs (Netlify)
netlify logs:function create-checkout-session

# Git logs
git log --oneline --graph -10
```

### Git & GitHub Workflows

#### Quick Commit & Push

```bash
./dev-workflows.sh
# Select option 18: "Quick commit and push"

# Or manually:
git add .
git commit -m "Your message"
git push
```

#### Create Pull Request

```bash
# Create PR with GitHub CLI
gh pr create

# Or use the workflow script
./dev-workflows.sh
# Select option 19: "Create pull request"
```

#### View Repository

```bash
gh repo view
gh browse
gh pr list
gh issue list
```

### Database Management

#### Initialize Database

```bash
./dev-workflows.sh
# Select option 16: "Initialize/reset database"

# Or manually:
cd backend
source venv/bin/activate
python scripts/init_db.py
```

#### Connect to Production Database

```bash
cd backend
railway connect postgres
# Opens psql connection
```

### Maintenance

#### Update Dependencies

```bash
./dev-workflows.sh
# Select option 21: "Install/update all dependencies"

# Or manually:

# Backend
cd backend
pip install --upgrade -r requirements.txt
pip freeze > requirements.txt

# Frontend
cd frontend
npm update
npm outdated

# Netlify Functions
cd netlify/functions
npm update
```

#### Generate Secret Key

```bash
./dev-workflows.sh
# Select option 23: "Generate secret key"

# Or manually:
python3 -c 'import secrets; print(secrets.token_urlsafe(32))'
```

---

## Troubleshooting

### Railway CLI Issues

<details>
<summary><b>Issue: "Cannot login in non-interactive mode"</b></summary>

**Solution:** Railway login requires interactive mode. Run directly in terminal:

```bash
railway login
```

</details>

<details>
<summary><b>Issue: "No project linked"</b></summary>

**Solution:** Link your project:

```bash
cd backend
railway link
# Or create new project:
railway init
```

</details>

<details>
<summary><b>Issue: Deployment failed</b></summary>

**Solution:** Check logs and status:

```bash
railway status
railway logs
# Verify railway.json configuration
cat railway.json
```

</details>

### Netlify CLI Issues

<details>
<summary><b>Issue: Module not found error</b></summary>

**Solution:** Clear npm cache and reinstall:

```bash
npm cache clean --force
npm install -g netlify-cli@latest
netlify --version
```

</details>

<details>
<summary><b>Issue: Functions not working locally</b></summary>

**Solution:** Install function dependencies:

```bash
cd netlify/functions
npm install
cd ../..
netlify dev
```

</details>

<details>
<summary><b>Issue: Environment variables not loading</b></summary>

**Solution:** Check Netlify configuration:

```bash
# View variables
netlify env:list

# Restart Netlify Dev
netlify dev
```

</details>

### Stripe CLI Issues

<details>
<summary><b>Issue: Webhooks not receiving events</b></summary>

**Solution:** Verify forward URL:

```bash
# Make sure Netlify Dev is running first
netlify dev

# Then start listener with correct URL
stripe listen --forward-to http://localhost:8888/.netlify/functions/create-checkout-session

# Check webhook signing secret
stripe listen --print-secret
```

</details>

<details>
<summary><b>Issue: "API key not configured"</b></summary>

**Solution:** Login or set API key:

```bash
stripe login
# OR
stripe login --api-key sk_test_...
```

</details>

### GitHub CLI Issues

<details>
<summary><b>Issue: "Not authenticated"</b></summary>

**Solution:** Re-authenticate:

```bash
gh auth login
# Or refresh token:
gh auth refresh
```

</details>

<details>
<summary><b>Issue: PR creation fails</b></summary>

**Solution:** Check remote and branch:

```bash
git remote -v
git branch
gh pr create --web  # Use web interface
```

</details>

### General Issues

<details>
<summary><b>Issue: Command not found</b></summary>

**Solution:** Verify installation and PATH:

```bash
# Check if installed
which railway
which netlify
which stripe
which gh

# Reinstall if needed
./install-all-clis.sh

# Check PATH
echo $PATH
```

</details>

<details>
<summary><b>Issue: Permission denied</b></summary>

**Solution:** Check file permissions:

```bash
# Make scripts executable
chmod +x install-all-clis.sh
chmod +x dev-workflows.sh
chmod +x backend/railway-env-setup.sh
chmod +x railway-deploy-commands.sh
```

</details>

---

## Advanced Usage

### Running Commands in Production Context

```bash
# Run command with Railway environment
railway run python scripts/seed_data.py

# Run with Netlify environment
netlify dev:exec "npm test"

# Run in Docker container
docker run --env-file .env myapp
```

### Multiple Environments

```bash
# Railway environments
railway environment production
railway environment staging

# Netlify contexts
netlify deploy              # Deploy preview
netlify deploy --alias staging  # Deploy to staging
netlify deploy --prod       # Deploy to production
```

### CI/CD Integration

```bash
# GitHub Actions can use these CLIs:
# - railway CLI (with API token)
# - netlify CLI (with auth token)
# - stripe CLI (with API key)
# - gh CLI (with GITHUB_TOKEN)

# Example: Deploy in CI
railway deploy --service backend
netlify deploy --prod --auth $NETLIFY_AUTH_TOKEN
```

---

## Quick Reference

### One-Liner Commands

```bash
# Full dev environment
./dev-workflows.sh start

# Deploy everything
./dev-workflows.sh deploy

# Check status
./dev-workflows.sh status

# View logs
./dev-workflows.sh logs

# Quick commit
./dev-workflows.sh commit

# Generate secret key
python3 -c 'import secrets; print(secrets.token_urlsafe(32))'
```

### Essential Commands Summary

| Task          | Command                                     |
| ------------- | ------------------------------------------- |
| Start dev     | `./dev-workflows.sh start`                  |
| Deploy all    | `./dev-workflows.sh deploy`                 |
| Backend logs  | `railway logs --tail`                       |
| Frontend logs | `netlify logs:deploy`                       |
| Test Stripe   | `stripe trigger checkout.session.completed` |
| Create PR     | `gh pr create`                              |
| Check status  | `./dev-workflows.sh status`                 |
| Generate key  | `./dev-workflows.sh` → option 23            |

---

## Resources

- [CLI Cheatsheet](./CLI_CHEATSHEET.md) - All commands in one place
- [Railway CLI Setup](./RAILWAY_CLI_SETUP.md) - Detailed Railway guide
- [Railway Quickstart](./RAILWAY_QUICKSTART.md) - Railway quick reference
- [Development Workflows](./dev-workflows.sh) - Interactive workflow menu

### Official Documentation

- [Railway Docs](https://docs.railway.app/develop/cli)
- [Netlify CLI Docs](https://docs.netlify.com/cli/get-started/)
- [Stripe CLI Docs](https://stripe.com/docs/stripe-cli)
- [GitHub CLI Docs](https://cli.github.com/manual/)

---

**Need Help?** Run `./dev-workflows.sh` for an interactive menu of common tasks!
