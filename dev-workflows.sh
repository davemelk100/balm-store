#!/bin/bash

# 🚀 Development Workflow Scripts - Balm Store
# Collection of useful scripts for common development tasks

set -e  # Exit on error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored messages
print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}!${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Show menu
show_menu() {
    echo ""
    echo "🛠️  Balm Store - Development Workflows"
    echo "====================================="
    echo ""
    echo "Local Development:"
    echo "  1) Start full local environment (backend + frontend)"
    echo "  2) Start backend only"
    echo "  3) Start frontend only (Netlify Dev)"
    echo "  4) Start Stripe webhook listener"
    echo ""
    echo "Testing:"
    echo "  5) Test Stripe checkout flow"
    echo "  6) Run backend tests"
    echo "  7) Run frontend tests"
    echo ""
    echo "Deployment:"
    echo "  8) Deploy backend to Railway"
    echo "  9) Deploy frontend to Netlify"
    echo "  10) Deploy everything (backend + frontend)"
    echo ""
    echo "Status & Logs:"
    echo "  11) Check all deployment statuses"
    echo "  12) View backend logs (Railway)"
    echo "  13) View frontend logs (Netlify)"
    echo ""
    echo "Authentication:"
    echo "  14) Login to all services"
    echo "  15) Check authentication status"
    echo ""
    echo "Database:"
    echo "  16) Initialize/reset database"
    echo "  17) Connect to Railway PostgreSQL"
    echo ""
    echo "Git & GitHub:"
    echo "  18) Quick commit and push"
    echo "  19) Create pull request"
    echo "  20) View recent commits"
    echo ""
    echo "Utilities:"
    echo "  21) Install/update all dependencies"
    echo "  22) Check for updates"
    echo "  23) Generate secret key"
    echo "  24) View environment variables"
    echo ""
    echo "  0) Exit"
    echo ""
}

# 1. Start full local environment
start_full_dev() {
    print_info "Starting full development environment..."
    
    # Check if tmux is available for splitting terminals
    if command -v tmux &> /dev/null; then
        print_info "Starting in tmux session..."
        tmux new-session -d -s balm-store
        tmux split-window -h
        tmux split-window -v
        
        # Backend
        tmux select-pane -t 0
        tmux send-keys "cd $PROJECT_ROOT/backend && source venv/bin/activate && uvicorn app.main:app --reload" C-m
        
        # Frontend (Netlify Dev)
        tmux select-pane -t 1
        tmux send-keys "cd $PROJECT_ROOT && netlify dev" C-m
        
        # Stripe webhook listener
        tmux select-pane -t 2
        tmux send-keys "stripe listen --forward-to http://localhost:8888/.netlify/functions/create-checkout-session" C-m
        
        tmux attach-session -t balm-store
    else
        print_warning "tmux not installed. Starting backend only..."
        print_info "In separate terminals, run:"
        print_info "  Terminal 2: cd $PROJECT_ROOT && netlify dev"
        print_info "  Terminal 3: stripe listen --forward-to http://localhost:8888/.netlify/functions/create-checkout-session"
        
        cd "$PROJECT_ROOT/backend"
        source venv/bin/activate
        uvicorn app.main:app --reload
    fi
}

# 2. Start backend only
start_backend() {
    print_info "Starting backend server..."
    cd "$PROJECT_ROOT/backend"
    
    if [ ! -d "venv" ]; then
        print_error "Virtual environment not found. Creating..."
        python3 -m venv venv
    fi
    
    source venv/bin/activate
    print_success "Backend starting at http://localhost:8000"
    uvicorn app.main:app --reload
}

# 3. Start frontend only
start_frontend() {
    print_info "Starting frontend with Netlify Dev..."
    cd "$PROJECT_ROOT"
    print_success "Frontend will start at http://localhost:8888"
    netlify dev
}

# 4. Start Stripe webhook listener
start_stripe_listener() {
    print_info "Starting Stripe webhook listener..."
    stripe listen --forward-to http://localhost:8888/.netlify/functions/create-checkout-session
}

# 5. Test Stripe checkout
test_stripe() {
    print_info "Testing Stripe checkout flow..."
    print_info "Make sure Netlify Dev is running!"
    echo ""
    print_info "Opening browser to http://localhost:8888"
    open "http://localhost:8888" 2>/dev/null || xdg-open "http://localhost:8888" 2>/dev/null || echo "Please open http://localhost:8888 in your browser"
    echo ""
    print_info "Test cards:"
    echo "  Success: 4242 4242 4242 4242"
    echo "  Decline: 4000 0000 0000 0002"
    echo "  3D Secure: 4000 0025 0000 3155"
}

# 8. Deploy backend
deploy_backend() {
    print_info "Deploying backend to Railway..."
    cd "$PROJECT_ROOT/backend"
    railway up
    print_success "Backend deployed!"
    print_info "URL: $(railway domain 2>/dev/null || echo 'Run railway domain to get URL')"
}

# 9. Deploy frontend
deploy_frontend() {
    print_info "Deploying frontend to Netlify..."
    cd "$PROJECT_ROOT"
    netlify deploy --prod
    print_success "Frontend deployed!"
}

# 10. Deploy everything
deploy_all() {
    print_info "Deploying entire application..."
    
    # Deploy backend
    print_info "1/2: Deploying backend to Railway..."
    cd "$PROJECT_ROOT/backend"
    railway up
    
    # Deploy frontend
    print_info "2/2: Deploying frontend to Netlify..."
    cd "$PROJECT_ROOT"
    netlify deploy --prod
    
    print_success "Full deployment complete!"
    echo ""
    print_info "Backend URL: $(cd backend && railway domain 2>/dev/null || echo 'Unknown')"
    print_info "Frontend URL: $(netlify status 2>/dev/null | grep "URL:" | head -n1 || echo 'Unknown')"
}

# 11. Check all statuses
check_status() {
    print_info "Checking deployment statuses..."
    echo ""
    
    print_info "Backend (Railway):"
    cd "$PROJECT_ROOT/backend"
    railway status 2>/dev/null || print_warning "Not linked to Railway project"
    
    echo ""
    print_info "Frontend (Netlify):"
    cd "$PROJECT_ROOT"
    netlify status 2>/dev/null || print_warning "Not linked to Netlify site"
    
    echo ""
    print_info "Git status:"
    git status -sb
}

# 12. View backend logs
view_backend_logs() {
    print_info "Viewing backend logs (Railway)..."
    cd "$PROJECT_ROOT/backend"
    railway logs --tail
}

# 13. View frontend logs
view_frontend_logs() {
    print_info "Viewing frontend logs (Netlify)..."
    cd "$PROJECT_ROOT"
    netlify logs:deploy
}

# 14. Login to all services
login_all() {
    print_info "Logging in to all services..."
    
    echo ""
    print_info "1/4: Railway"
    railway login
    
    echo ""
    print_info "2/4: Netlify"
    netlify login
    
    echo ""
    print_info "3/4: Stripe"
    stripe login
    
    echo ""
    print_info "4/4: GitHub"
    gh auth login
    
    print_success "All logins complete!"
}

# 15. Check auth status
check_auth() {
    print_info "Checking authentication status..."
    echo ""
    
    print_info "Railway:"
    railway whoami 2>/dev/null || print_warning "Not authenticated"
    
    echo ""
    print_info "Netlify:"
    netlify status 2>/dev/null | grep "Logged in" || print_warning "Not authenticated"
    
    echo ""
    print_info "GitHub:"
    gh auth status 2>/dev/null || print_warning "Not authenticated"
    
    echo ""
    print_info "Stripe:"
    stripe config --list 2>/dev/null | grep "account" || print_warning "Not authenticated"
}

# 16. Initialize database
init_database() {
    print_info "Initializing database..."
    cd "$PROJECT_ROOT/backend"
    
    if [ -f "venv/bin/activate" ]; then
        source venv/bin/activate
        python scripts/init_db.py
        print_success "Database initialized!"
    else
        print_error "Virtual environment not found"
    fi
}

# 18. Quick commit and push
quick_commit() {
    print_info "Quick commit and push..."
    
    git status
    echo ""
    read -p "Commit message: " message
    
    if [ -z "$message" ]; then
        print_error "Commit message required"
        return 1
    fi
    
    git add .
    git commit -m "$message"
    git push
    
    print_success "Changes committed and pushed!"
}

# 19. Create PR
create_pr() {
    print_info "Creating pull request..."
    gh pr create
}

# 20. View recent commits
view_commits() {
    print_info "Recent commits:"
    git log --oneline --graph -10
}

# 21. Install dependencies
install_deps() {
    print_info "Installing all dependencies..."
    
    # Backend
    print_info "Installing backend dependencies..."
    cd "$PROJECT_ROOT/backend"
    if [ ! -d "venv" ]; then
        python3 -m venv venv
    fi
    source venv/bin/activate
    pip install -r requirements.txt
    
    # Frontend
    print_info "Installing frontend dependencies..."
    cd "$PROJECT_ROOT/frontend"
    npm install
    
    # Netlify Functions
    print_info "Installing Netlify function dependencies..."
    cd "$PROJECT_ROOT/netlify/functions"
    npm install
    
    print_success "All dependencies installed!"
}

# 23. Generate secret key
generate_secret() {
    print_info "Generating new secret key..."
    python3 -c 'import secrets; print(secrets.token_urlsafe(32))'
}

# 24. View environment variables
view_env() {
    print_info "Environment variables..."
    echo ""
    print_info "Railway (Backend):"
    cd "$PROJECT_ROOT/backend"
    railway variables 2>/dev/null || print_warning "Not linked to Railway"
    
    echo ""
    print_info "Netlify (Frontend):"
    cd "$PROJECT_ROOT"
    netlify env:list 2>/dev/null || print_warning "Not linked to Netlify"
}

# Main script
main() {
    if [ "$1" ]; then
        # Command-line argument provided
        case "$1" in
            start) start_full_dev ;;
            backend) start_backend ;;
            frontend) start_frontend ;;
            deploy) deploy_all ;;
            status) check_status ;;
            logs) view_backend_logs ;;
            commit) quick_commit ;;
            *) print_error "Unknown command: $1" ;;
        esac
    else
        # Interactive menu
        while true; do
            show_menu
            read -p "Select option (0-24): " choice
            
            case $choice in
                1) start_full_dev ;;
                2) start_backend ;;
                3) start_frontend ;;
                4) start_stripe_listener ;;
                5) test_stripe ;;
                6) print_warning "Backend tests not yet configured" ;;
                7) print_warning "Frontend tests not yet configured" ;;
                8) deploy_backend ;;
                9) deploy_frontend ;;
                10) deploy_all ;;
                11) check_status ;;
                12) view_backend_logs ;;
                13) view_frontend_logs ;;
                14) login_all ;;
                15) check_auth ;;
                16) init_database ;;
                17) print_info "Run: railway connect postgres" ;;
                18) quick_commit ;;
                19) create_pr ;;
                20) view_commits ;;
                21) install_deps ;;
                22) print_info "Run: npm outdated && pip list --outdated" ;;
                23) generate_secret ;;
                24) view_env ;;
                0) print_success "Goodbye!"; exit 0 ;;
                *) print_error "Invalid option" ;;
            esac
            
            echo ""
            read -p "Press Enter to continue..."
        done
    fi
}

# Run main function
main "$@"

