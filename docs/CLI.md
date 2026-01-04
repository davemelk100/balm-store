# CLI & Automation Guide

The BALM Store is equipped with a powerful suite of CLI tools and interactive scripts to streamline development and deployment.

## 🛠️ Interactive Tools

### Main Workflow Menu
The primary way to interact with the project is through the interactive workflow script:
```bash
./dev-workflows.sh
```
**Available Actions:**
1. Start full local environment (Backend + Frontend)
2. Individual service control
3. Deployment to Production (Railway & Netlify)
4. Log viewing and status checks
5. Database initialization and migrations
6. Git & GitHub operations

### Installation Script
Ensure all required CLIs are installed and up to date:
```bash
./install-all-clis.sh
```

---

## 📦 Installed CLIs

| CLI | Purpose |
| :--- | :--- |
| **Railway** | Backend deployment and infrastructure management |
| **Netlify** | Frontend hosting and serverless functions |
| **Stripe** | Payment testing and webhook development |
| **GitHub** | Repository, PR, and Issue management |
| **npm/pip** | Node.js and Python package management |

---

## 🚀 Quick Reference (Cheatsheet)

### Development
- `netlify dev`: Start frontend + functions locally (Port 8888).
- `cd backend && source venv/bin/activate && uvicorn app.main:app --reload`: Start backend with hot reload.
- `stripe listen --forward-to localhost:8888`: Listen for webhooks.

### Deployment
- `railway up`: Deploy backend to Railway.
- `netlify deploy --prod`: Deploy frontend to Netlify.

### Status & Logs
- `railway status` / `netlify status`: Check cloud status.
- `railway logs --tail`: Real-time backend logs.
- `netlify logs:deploy`: Frontend deployment logs.

### Database
- `railway run python scripts/init_db.py`: Run initialization in production environment.

---

## 🔐 Authentication
To link your local environment to these services, run option **14** in `./dev-workflows.sh` or log in manually:
```bash
railway login
netlify login
stripe login
gh auth login
```

---

## 💡 Pro Tips
- **Aliases**: Add `alias dev="./dev-workflows.sh"` to your shell profile.
- **Multi-pane**: The start workflow supports `tmux` for automatically split terminal windows.
- **Status Check**: Run `./dev-workflows.sh status` for a quick health check of all services.
