# 🎯 CLI Master Index - Balm Store

**Quick access to all CLI documentation and tools.**

---

## ✅ Installation Status

All CLIs have been successfully installed! See [`CLI_VERSIONS.txt`](./CLI_VERSIONS.txt) for details.

- ✅ **Railway CLI** v4.16.1
- ✅ **Netlify CLI** v23.13.0
- ✅ **Stripe CLI** v1.34.0
- ✅ **GitHub CLI** v2.83.2
- ✅ **Node.js** v22.12.0 & npm v10.9.0
- ✅ **Python** 3.14.0 & pip 25.3
- ✅ **Git** v2.50.1
- ✅ **Docker** v29.0.1

---

## 📚 Documentation Hub

### Quick Start
- **[CLI_CHEATSHEET.md](./CLI_CHEATSHEET.md)** - Complete command reference for all CLIs
  - All commands organized by CLI
  - Common workflows
  - Quick examples

### Detailed Guides
- **[CLI_SETUP_GUIDE.md](./CLI_SETUP_GUIDE.md)** - Complete setup and configuration
  - Installation instructions
  - Authentication steps
  - Configuration details
  - Troubleshooting

### Platform-Specific
- **[RAILWAY_QUICKSTART.md](./RAILWAY_QUICKSTART.md)** - Railway CLI quick reference
- **[RAILWAY_CLI_SETUP.md](./RAILWAY_CLI_SETUP.md)** - Detailed Railway guide
- **[RAILWAY_COMPARISON.md](./RAILWAY_COMPARISON.md)** - Railway vs other platforms

---

## 🛠️ Interactive Tools

### Installation & Setup
```bash
./install-all-clis.sh          # Install/update all CLIs
```

### Development Workflows (Interactive Menu)
```bash
./dev-workflows.sh             # Main workflow menu
```

Available workflows:
1. Start full local environment
2. Start backend/frontend separately
3. Deploy to production
4. View logs and status
5. Manage authentication
6. Database operations
7. Git operations
8. And more...

### Quick Commands
```bash
./dev-workflows.sh start       # Start development
./dev-workflows.sh deploy      # Deploy everything
./dev-workflows.sh status      # Check status
./dev-workflows.sh logs        # View logs
./dev-workflows.sh commit      # Quick commit & push
```

### Railway Specific
```bash
./railway-deploy-commands.sh   # Railway deployment guide
backend/railway-env-setup.sh   # Interactive env setup
```

---

## 🚀 Quick Command Reference

### Development
```bash
# Start everything locally
./dev-workflows.sh start

# Or start services individually
cd backend && source venv/bin/activate && uvicorn app.main:app --reload  # Backend
netlify dev                                                                # Frontend
stripe listen --forward-to http://localhost:8888/.netlify/functions/...  # Webhooks
```

### Deployment
```bash
# Deploy everything
./dev-workflows.sh deploy

# Or deploy individually
cd backend && railway up         # Backend to Railway
netlify deploy --prod            # Frontend to Netlify
```

### Status & Monitoring
```bash
railway status                   # Backend status
netlify status                   # Frontend status
railway logs --tail              # Backend logs
netlify logs:deploy              # Frontend logs
git status                       # Git status
```

### Authentication
```bash
railway login                    # Railway
netlify login                    # Netlify
stripe login                     # Stripe
gh auth login                    # GitHub
```

---

## 📖 Documentation by Topic

### Getting Started
1. Read [CLI_SETUP_GUIDE.md](./CLI_SETUP_GUIDE.md) for installation
2. Run `./install-all-clis.sh` to install all CLIs
3. Authenticate with services (see guide)
4. Use `./dev-workflows.sh` for interactive workflows

### Daily Development
- Use [CLI_CHEATSHEET.md](./CLI_CHEATSHEET.md) for command reference
- Run `./dev-workflows.sh start` to begin development
- Check [dev-workflows.sh](./dev-workflows.sh) for automation

### Deployment
- Backend: [RAILWAY_QUICKSTART.md](./RAILWAY_QUICKSTART.md)
- Frontend: [CLI_CHEATSHEET.md](./CLI_CHEATSHEET.md) (Netlify section)
- Full deployment: `./dev-workflows.sh deploy`

### Testing
- Stripe testing: [CLI_CHEATSHEET.md](./CLI_CHEATSHEET.md) (Stripe section)
- Local testing: `netlify dev` + `stripe listen`

### Troubleshooting
- [CLI_SETUP_GUIDE.md](./CLI_SETUP_GUIDE.md) has troubleshooting section
- Check logs: `railway logs --tail` or `netlify logs:deploy`
- Verify auth: `./dev-workflows.sh` → option 15

---

## 🎓 Learning Path

### Beginner
1. ✅ Install CLIs: `./install-all-clis.sh`
2. 📖 Read: [CLI_SETUP_GUIDE.md](./CLI_SETUP_GUIDE.md)
3. 🔐 Authenticate with all services
4. 🚀 Start development: `./dev-workflows.sh start`

### Intermediate
1. 📚 Study: [CLI_CHEATSHEET.md](./CLI_CHEATSHEET.md)
2. 🔄 Practice workflows: `./dev-workflows.sh`
3. 🚢 Deploy: [RAILWAY_QUICKSTART.md](./RAILWAY_QUICKSTART.md)
4. 🧪 Test Stripe: Follow Stripe CLI section

### Advanced
1. 🛠️ Customize: Edit [dev-workflows.sh](./dev-workflows.sh)
2. 📊 Monitor: Use logs and status commands
3. 🔧 Configure: Set up CI/CD with CLIs
4. 📦 Compare: Read [RAILWAY_COMPARISON.md](./RAILWAY_COMPARISON.md)

---

## 🔗 External Resources

- [Railway CLI Docs](https://docs.railway.app/develop/cli)
- [Netlify CLI Docs](https://docs.netlify.com/cli/get-started/)
- [Stripe CLI Docs](https://stripe.com/docs/stripe-cli)
- [GitHub CLI Docs](https://cli.github.com/manual/)
- [npm Docs](https://docs.npmjs.com)
- [pip Docs](https://pip.pypa.io)
- [Git Docs](https://git-scm.com/doc)
- [Docker Docs](https://docs.docker.com)

---

## 📋 File Reference

| File | Purpose | When to Use |
|------|---------|-------------|
| `CLI_CHEATSHEET.md` | Command reference | Daily development |
| `CLI_SETUP_GUIDE.md` | Setup & config | Initial setup, troubleshooting |
| `CLI_VERSIONS.txt` | Version info | Check installations |
| `RAILWAY_QUICKSTART.md` | Railway quick ref | Railway deployment |
| `RAILWAY_CLI_SETUP.md` | Railway detailed | Railway deep dive |
| `RAILWAY_COMPARISON.md` | Platform comparison | Choosing platform |
| `install-all-clis.sh` | Install script | Setup, updates |
| `dev-workflows.sh` | Workflow automation | Daily tasks |
| `railway-deploy-commands.sh` | Railway commands | Railway deployment |
| `backend/railway-env-setup.sh` | Railway env setup | Railway configuration |

---

## 💡 Pro Tips

### Productivity Boosters

1. **Use the interactive menu:**
   ```bash
   ./dev-workflows.sh
   ```
   No need to remember commands!

2. **Create aliases:**
   ```bash
   # Add to ~/.zshrc or ~/.bashrc
   alias devstart="cd ~/Movies/repos/balm-store && ./dev-workflows.sh start"
   alias deploy="cd ~/Movies/repos/balm-store && ./dev-workflows.sh deploy"
   alias rlogs="cd ~/Movies/repos/balm-store/backend && railway logs --tail"
   ```

3. **Use tmux for multi-pane development:**
   ```bash
   # Start workflow with tmux
   ./dev-workflows.sh start
   # Automatically creates split panes
   ```

4. **Quick status check:**
   ```bash
   ./dev-workflows.sh status
   ```

5. **Environment variable management:**
   ```bash
   railway run env | grep KEY     # Check Railway env
   netlify env:list | grep KEY    # Check Netlify env
   ```

---

## 🆘 Getting Help

### Quick Help
```bash
railway --help
netlify help
stripe help
gh help
./dev-workflows.sh
```

### Documentation
- Check [CLI_SETUP_GUIDE.md](./CLI_SETUP_GUIDE.md) troubleshooting section
- Read [CLI_CHEATSHEET.md](./CLI_CHEATSHEET.md) for examples

### Interactive Support
```bash
./dev-workflows.sh
# Select option 15: Check authentication status
# Helps diagnose auth issues
```

---

## ✨ What's New

### Recently Added (2025-12-28)
- ✅ Complete CLI installation automation
- ✅ Interactive workflow menu (`dev-workflows.sh`)
- ✅ Comprehensive documentation suite
- ✅ Railway CLI full integration
- ✅ Netlify CLI full integration
- ✅ Stripe CLI for webhook testing
- ✅ GitHub CLI for repo management
- ✅ Version tracking system

---

**🎉 All CLIs are installed and ready to use!**

Start with: `./dev-workflows.sh` for an interactive menu of everything you can do.

