# Setup Guide

This guide provides detailed instructions for setting up the BALM Store repository locally.

## Prerequisite Checklist

- [ ] **Python 3.11 or 3.12** (Python 3.14 is currently NOT supported)
- [ ] **Node.js 18+**
- [ ] **npm** or **yarn**
- [ ] **Git**
- [ ] [Stripe Account](https://stripe.com/) (for payment testing)

## 1. Initial Setup

### Clone the Repository
```bash
git clone https://github.com/davemelk100/balm-store.git
cd balm-store
```

### Environment Variables
```bash
cp .env.example .env
```
Edit `.env` and configure the following:
- `VITE_STRIPE_PUBLIC_KEY`: Your Stripe publishable key
- `STRIPE_SECRET_KEY`: Your Stripe secret key (for cart checkout)
- `SECRET_KEY`: Long random string for JWT auth
- `ADMIN_PASSWORD`: Secure password for the admin panel

---

## 2. Backend Setup (FastAPI)

```bash
cd backend

# Create and activate virtual environment
python3.12 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Initialize database (creates tables and admin user)
python scripts/init_db.py

# Start backend server
python -m uvicorn app.main:app --reload
```
- **Backend URL**: [http://localhost:8000](http://localhost:8000)
- **API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 3. Frontend Setup (React + Vite)

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
- **Storefront URL**: [http://localhost:5173](http://localhost:5173)

---

## 4. Admin Access

Access the admin panel to manage products and inventory:
- **URL**: [http://localhost:8000/admin/store](http://localhost:8000/admin/store)
- **Default Username**: `admin`
- **Default Password**: `admin123` (or what you set in `.env`)

---

## 5. Verification Checklist

- [ ] Backend starts on port 8000
- [ ] Frontend starts on port 5173
- [ ] Can access store homepage
- [ ] Can view product details
- [ ] Admin panel loads at /admin/store
- [ ] API docs accessible at /docs

---

## Next Steps
- [Configure Stripe](STRIPE.md)
- [Explore CLI Tools](CLI.md)
- [Deployment Guide](DEPLOYMENT.md)
