# 🛠️ Complete CLI Cheatsheet - Balm Store

All command-line tools used in this project, organized by category.

---

## 📦 Installed CLIs

✅ **Railway CLI** - Backend deployment  
✅ **Netlify CLI** - Frontend deployment & functions  
✅ **Stripe CLI** - Payment testing & webhooks  
✅ **GitHub CLI** - Repository management  
✅ **npm** - Node.js package manager  
✅ **pip** - Python package manager  
✅ **Git** - Version control  
✅ **Docker** - Containerization (optional)

---

## 🚂 Railway CLI

### Authentication & Setup

```bash
railway login                           # Login to Railway (opens browser)
railway logout                          # Logout from Railway
railway whoami                          # Check current user
```

### Project Management

```bash
railway init                            # Create new project
railway link                            # Link to existing project
railway unlink                          # Unlink current project
railway open                            # Open project in browser
railway status                          # Check deployment status
```

### Deployment

```bash
railway up                              # Deploy current directory
railway up --detach                     # Deploy in background
railway up --service backend            # Deploy specific service
```

### Environment Variables

```bash
railway variables                       # List all variables
railway variables set KEY=value         # Set variable
railway variables set KEY1=val1 KEY2=val2  # Set multiple
railway variables delete KEY            # Delete variable
```

### Database

```bash
railway add postgresql                  # Add PostgreSQL database
railway add redis                       # Add Redis
railway add mongodb                     # Add MongoDB
railway connect postgres                # Connect to database
```

### Logs & Debugging

```bash
railway logs                            # View logs
railway logs --tail                     # Follow logs in real-time
railway logs --service backend          # Logs for specific service
railway logs --deployment <id>          # Logs for specific deployment
```

### Running Commands

```bash
railway run <command>                   # Run command with Railway env
railway run python scripts/init_db.py   # Example: Run migration
railway run uvicorn app.main:app --reload  # Example: Run app locally
railway run env                         # View all environment variables
```

### Domain & URLs

```bash
railway domain                          # Get deployment URL
railway domain add custom.com           # Add custom domain
```

### Other Commands

```bash
railway list                            # List all projects
railway environment                     # List environments
railway environment production          # Switch to production
railway help                            # Show help
railway <command> --help                # Help for specific command
```

---

## 🌐 Netlify CLI

### Authentication & Setup

```bash
netlify login                           # Login to Netlify
netlify logout                          # Logout from Netlify
netlify status                          # Show current status
```

### Site Management

```bash
netlify init                            # Initialize new site
netlify link                            # Link to existing site
netlify unlink                          # Unlink current site
netlify sites:list                      # List all sites
netlify open                            # Open site in browser
netlify open:admin                      # Open Netlify dashboard
```

### Local Development

```bash
netlify dev                             # Start local dev server (port 8888)
netlify dev --port 3000                 # Start on custom port
netlify dev --live                      # Share local dev with live URL
netlify functions:serve                 # Run functions locally
```

### Deployment

```bash
netlify deploy                          # Deploy to draft URL
netlify deploy --prod                   # Deploy to production
netlify deploy --build                  # Build then deploy
netlify deploy --dir=dist               # Deploy specific directory
netlify deploy --functions=netlify/functions  # Specify functions dir
```

### Functions

```bash
netlify functions:list                  # List all functions
netlify functions:create <name>         # Create new function
netlify functions:invoke <name>         # Test function locally
netlify functions:build                 # Build functions
```

### Environment Variables

```bash
netlify env:list                        # List environment variables
netlify env:set KEY value               # Set environment variable
netlify env:get KEY                     # Get variable value
netlify env:unset KEY                   # Remove variable
netlify env:import .env                 # Import from .env file
```

### Build & CI

```bash
netlify build                           # Run build locally
netlify build --dry                     # Dry run build
netlify plugins:list                    # List installed plugins
```

### Other Commands

```bash
netlify logs:deploy                     # View deploy logs
netlify logs:function <name>            # View function logs
netlify watch                           # Watch for changes and deploy
netlify help                            # Show help
```

---

## 💳 Stripe CLI

### Authentication

```bash
stripe login                            # Login to Stripe
stripe login --api-key sk_test_...     # Login with API key
stripe logout                           # Logout from Stripe
```

### Webhook Testing

```bash
stripe listen                           # Listen for webhooks
stripe listen --forward-to localhost:8000/webhook  # Forward to local server
stripe listen --events payment_intent.succeeded    # Listen for specific events
stripe listen --print-json              # Print full JSON
```

### Triggering Events

```bash
stripe trigger payment_intent.succeeded  # Trigger test event
stripe trigger customer.created          # Trigger customer creation
stripe trigger checkout.session.completed  # Trigger checkout completion
```

### Resource Management

```bash
stripe customers list                   # List customers
stripe products list                    # List products
stripe prices list                      # List prices
stripe payment_intents list             # List payment intents
```

### Creating Resources

```bash
stripe customers create --email test@example.com  # Create customer
stripe products create --name "Test Product"      # Create product
stripe prices create --product prod_xxx --unit-amount 1000 --currency usd  # Create price
```

### Testing

```bash
stripe samples list                     # List sample integrations
stripe samples create checkout          # Create sample checkout
```

### Configuration

```bash
stripe config --list                    # Show configuration
stripe --version                        # Show version
```

---

## 🐙 GitHub CLI

### Authentication

```bash
gh auth login                           # Login to GitHub
gh auth logout                          # Logout
gh auth status                          # Check auth status
gh auth refresh                         # Refresh auth token
```

### Repository Management

```bash
gh repo view                            # View current repo
gh repo view owner/repo                 # View specific repo
gh repo clone owner/repo                # Clone repository
gh repo create                          # Create new repo
gh repo fork                            # Fork repository
gh repo sync                            # Sync fork with upstream
```

### Pull Requests

```bash
gh pr list                              # List PRs
gh pr view <number>                     # View PR details
gh pr create                            # Create PR
gh pr checkout <number>                 # Checkout PR locally
gh pr merge <number>                    # Merge PR
gh pr close <number>                    # Close PR
gh pr review --approve <number>         # Approve PR
```

### Issues

```bash
gh issue list                           # List issues
gh issue view <number>                  # View issue
gh issue create                         # Create issue
gh issue close <number>                 # Close issue
gh issue reopen <number>                # Reopen issue
```

### Actions (CI/CD)

```bash
gh workflow list                        # List workflows
gh workflow view <name>                 # View workflow
gh run list                             # List workflow runs
gh run view <id>                        # View run details
gh run watch                            # Watch current run
```

### Releases

```bash
gh release list                         # List releases
gh release view <tag>                   # View release
gh release create v1.0.0                # Create release
gh release download <tag>               # Download release assets
```

### Other Commands

```bash
gh browse                               # Open repo in browser
gh gist create <file>                   # Create gist
gh api /repos/owner/repo                # Make API call
```

---

## 📦 npm (Node Package Manager)

### Package Management

```bash
npm install                             # Install all dependencies
npm install <package>                   # Install package
npm install -g <package>                # Install globally
npm install --save-dev <package>        # Install as dev dependency
npm uninstall <package>                 # Remove package
npm update                              # Update packages
npm outdated                            # Check for outdated packages
```

### Scripts (from package.json)

```bash
npm run dev                             # Start development server
npm run build                           # Build for production
npm run test                            # Run tests
npm run lint                            # Run linter
npm start                               # Start application
```

### Project Management

```bash
npm init                                # Create new package.json
npm init -y                             # Create with defaults
npm list                                # List installed packages
npm list --depth=0                      # List top-level packages
npm search <package>                    # Search npm registry
```

### Other Commands

```bash
npm cache clean --force                 # Clear npm cache
npm audit                               # Check for vulnerabilities
npm audit fix                           # Fix vulnerabilities
npm version patch                       # Bump patch version
npm publish                             # Publish to npm registry
```

---

## 🐍 pip (Python Package Manager)

### Package Management

```bash
pip install <package>                   # Install package
pip install -r requirements.txt         # Install from requirements file
pip uninstall <package>                 # Uninstall package
pip list                                # List installed packages
pip show <package>                      # Show package details
pip search <query>                      # Search for packages
```

### Requirements

```bash
pip freeze                              # List all packages with versions
pip freeze > requirements.txt           # Save to requirements file
pip install --upgrade <package>         # Upgrade package
pip install --upgrade pip               # Upgrade pip itself
```

### Virtual Environments

```bash
python3 -m venv venv                    # Create virtual environment
source venv/bin/activate                # Activate (Unix/Mac)
venv\Scripts\activate                   # Activate (Windows)
deactivate                              # Deactivate virtual environment
```

---

## 🔧 Git

### Basic Commands

```bash
git status                              # Check status
git add <file>                          # Stage file
git add .                               # Stage all changes
git commit -m "message"                 # Commit changes
git push                                # Push to remote
git pull                                # Pull from remote
git clone <url>                         # Clone repository
```

### Branching

```bash
git branch                              # List branches
git branch <name>                       # Create branch
git checkout <branch>                   # Switch branch
git checkout -b <branch>                # Create and switch
git merge <branch>                      # Merge branch
git branch -d <branch>                  # Delete branch
```

### History & Logs

```bash
git log                                 # View commit history
git log --oneline                       # Compact log
git log --graph                         # Visual graph
git diff                                # Show changes
git show <commit>                       # Show commit details
```

### Undoing Changes

```bash
git reset HEAD <file>                   # Unstage file
git checkout -- <file>                  # Discard changes
git revert <commit>                     # Revert commit
git reset --soft HEAD~1                 # Undo last commit (keep changes)
git reset --hard HEAD~1                 # Undo last commit (discard changes)
```

### Remote Management

```bash
git remote -v                           # List remotes
git remote add origin <url>             # Add remote
git remote remove origin                # Remove remote
git fetch                               # Fetch from remote
git fetch --all                         # Fetch from all remotes
```

---

## 🐳 Docker (Optional)

### Container Management

```bash
docker ps                               # List running containers
docker ps -a                            # List all containers
docker run <image>                      # Run container
docker start <container>                # Start container
docker stop <container>                 # Stop container
docker rm <container>                   # Remove container
docker logs <container>                 # View logs
docker exec -it <container> bash        # Enter container
```

### Image Management

```bash
docker images                           # List images
docker pull <image>                     # Pull image
docker build -t <name> .                # Build image
docker rmi <image>                      # Remove image
docker tag <image> <new-name>           # Tag image
```

### Docker Compose

```bash
docker-compose up                       # Start services
docker-compose up -d                    # Start in background
docker-compose down                     # Stop services
docker-compose logs                     # View logs
docker-compose ps                       # List services
docker-compose build                    # Build services
```

---

## 🚀 Common Workflows

### Starting Local Development

```bash
# Terminal 1: Start backend
cd backend
source venv/bin/activate
uvicorn app.main:app --reload

# Terminal 2: Start frontend with Netlify
cd ../
netlify dev

# Terminal 3: Listen for Stripe webhooks (if needed)
stripe listen --forward-to localhost:8000/webhook
```

### Deploying Everything

```bash
# Deploy backend to Railway
cd backend
railway up

# Deploy frontend to Netlify
cd ../
netlify deploy --prod

# Commit and push changes
git add .
git commit -m "Deploy: your message"
git push
```

### Testing Payment Flow

```bash
# Start Stripe webhook listener
stripe listen --forward-to http://localhost:8888/.netlify/functions/create-checkout-session

# In another terminal, trigger test event
stripe trigger checkout.session.completed

# Or test with Netlify dev
netlify dev
# Then test in browser at localhost:8888
```

### Quick Status Check

```bash
# Check all deployments
railway status          # Backend status
netlify status          # Frontend status
gh run list --limit 5   # Recent GitHub Actions

# View logs
railway logs --tail     # Backend logs
netlify logs:deploy     # Frontend deploy logs
```

---

## 📚 Help & Documentation

### Get Help

```bash
railway --help
netlify help
stripe help
gh help
npm help
pip help
git help
docker help
```

### Version Checks

```bash
railway --version
netlify --version
stripe --version
gh --version
node --version
npm --version
python3 --version
pip3 --version
git --version
docker --version
```

---

## 🔗 Quick Links

- [Railway Docs](https://docs.railway.app)
- [Netlify Docs](https://docs.netlify.com)
- [Stripe Docs](https://stripe.com/docs)
- [GitHub CLI Docs](https://cli.github.com/manual/)
- [npm Docs](https://docs.npmjs.com)
- [pip Docs](https://pip.pypa.io)
- [Git Docs](https://git-scm.com/doc)
- [Docker Docs](https://docs.docker.com)

---

**💡 Tip:** Use `<command> --help` or `<command> help` to see all available options for any CLI!
