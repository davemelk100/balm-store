# BALM Store - Setup Instructions

Your store has been successfully extracted into a standalone repository!

## 📁 Repository Structure

```
balm-store/
├── frontend/          # React + TypeScript + Vite
├── backend/           # FastAPI + SQLAlchemy
├── .env.example       # Environment variables template
└── README.md          # Project documentation
```

## 🚀 Quick Start

### 1. Set Up Environment Variables

```bash
cp .env.example .env
```

Then edit `.env` and update:

- `VITE_STRIPE_PUBLIC_KEY` with your Stripe key
- `SECRET_KEY` for JWT authentication (change in production!)
- Other settings as needed

### 2. Set Up Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Initialize database (creates tables and admin user)
python scripts/init_db.py

# Start backend server
python -m uvicorn app.main:app --reload
```

Backend will run on: **http://localhost:8000**

### 3. Set Up Frontend

```bash
cd frontend

# Dependencies are already installed!
# (If not: npm install)

# Start development server
npm run dev
```

Frontend will run on: **http://localhost:5173**

## 🎯 Access Points

### Store (Frontend)

- **Home**: http://localhost:5173/
- **Product Page**: http://localhost:5173/product/{id}
- **Checkout**: http://localhost:5173/checkout
- **Login**: http://localhost:5173/login
- **Signup**: http://localhost:5173/signup

### Admin Panel

- **URL**: http://localhost:8000/admin/store
- **Default Credentials**:
  - Username: `admin`
  - Password: `admin123`
  - ⚠️ Change these in production!

### API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔧 Development

### Frontend

```bash
cd frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend

```bash
cd backend
source venv/bin/activate  # Activate virtual environment
python -m uvicorn app.main:app --reload  # Start with hot reload
```

## 📝 Key Changes from Main Repo

### Route Changes

All routes no longer have `/store` prefix:

- ✅ `/` (was `/store`)
- ✅ `/product/:id` (was `/store/product/:id`)
- ✅ `/checkout` (was `/store/checkout`)
- ✅ `/login` (was `/store/login`)
- ✅ `/signup` (was `/store/signup`)

### Import Path Updates

UI components now import from:

```typescript
// Before (in main repo)
import { Button } from "../../../components/ui/button";

// After (in standalone)
import { Button } from "../../components/ui/button";
```

## 📦 What's Included

### Frontend

- ✅ All store pages (Store, ProductDetail, Checkout, etc.)
- ✅ Store components (StoreHeader, ImageModal, etc.)
- ✅ Context providers (Cart, Auth, Store)
- ✅ Required UI components (Button, Card, Input, etc.)
- ✅ Utilities and hooks
- ✅ Tailwind CSS configuration
- ✅ Vite configuration

### Backend

- ✅ Product API routes (CRUD operations)
- ✅ Order management
- ✅ Inventory tracking
- ✅ Database models (Product, Order, InventoryLog, User)
- ✅ Authentication & authorization
- ✅ Admin panel HTML
- ✅ Database initialization script

## 🗄️ Database

The store uses SQLite by default. To use PostgreSQL:

1. Update `DATABASE_URL` in `.env`:

```
DATABASE_URL=postgresql://user:password@localhost/balm_store
```

2. Install PostgreSQL driver:

```bash
pip install psycopg2-binary
```

3. Re-run database initialization:

```bash
python backend/scripts/init_db.py
```

## 🛠️ Admin Panel Features

Access at http://localhost:8000/admin/store

- **Products Tab**: Add, edit, delete products
- **Inventory Tab**: View inventory logs
- **Orders Tab**: View and manage orders
- **Dashboard**: Overview statistics

## 🎨 Customization

### Branding

- Logo: `frontend/public/img/balm-varsity.svg`
- Colors: Edit `frontend/src/globals.css`
- Fonts: Edit `frontend/tailwind.config.ts`

### Products

- Add products via admin panel or
- Edit `frontend/src/store/data/storeProducts.ts`

## 📚 Documentation

- **API Details**: `backend/INVENTORY_SYSTEM.md`
- **Quick Start**: `backend/INVENTORY_QUICKSTART.md`
- **Architecture**: `STORE_SEPARATION_GUIDE.md`
- **Main README**: `README.md`

## 🚨 Important Notes

1. **Environment Variables**:

   - Never commit `.env` to version control
   - Update secrets before deploying to production

2. **Admin Credentials**:

   - Change default password immediately
   - Password is in `.env` as `ADMIN_PASSWORD`

3. **Stripe Setup**:

   - Get keys from https://dashboard.stripe.com/test/apikeys
   - Use test keys for development
   - Switch to live keys for production

4. **Database**:
   - SQLite is for development only
   - Use PostgreSQL for production
   - Backup regularly

## 🌐 Deployment

### Frontend (Netlify)

1. Create `netlify.toml` in `frontend/`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. Deploy:

```bash
cd frontend
npm run build
# Upload dist/ to Netlify
```

### Backend (Railway/Render/Heroku)

1. Update `DATABASE_URL` to PostgreSQL
2. Set environment variables in platform
3. Deploy the `backend/` directory

## 🐛 Troubleshooting

### Frontend won't start

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Backend errors

```bash
cd backend
source venv/bin/activate
pip install --upgrade -r requirements.txt
python scripts/init_db.py
```

### Database issues

```bash
# Delete and recreate database
rm backend/store.db
python backend/scripts/init_db.py
```

### Import errors

Check that all paths use relative imports from the new structure

## ✅ Verification Checklist

- [ ] Backend starts successfully on port 8000
- [ ] Frontend starts successfully on port 5173
- [ ] Can access store homepage
- [ ] Can view product details
- [ ] Can add items to cart
- [ ] Can access checkout (after login)
- [ ] Can log in / sign up
- [ ] Admin panel loads at /admin/store
- [ ] Can create/edit products in admin
- [ ] API docs accessible at /docs

## 🎉 Success!

Your BALM store is now running as a standalone application!

- Store: http://localhost:5173
- API: http://localhost:8000
- Admin: http://localhost:8000/admin/store

For questions or issues, refer to the documentation in the `backend/` folder.

---

**Next Steps:**

1. Customize products and branding
2. Set up Stripe for payments
3. Test all features thoroughly
4. Deploy to production
