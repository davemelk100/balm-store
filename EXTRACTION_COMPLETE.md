# ⚠️ BALM Store Extraction - Manual Setup Required

## ✅ What Was Completed

The store has been successfully extracted to: `/Users/davemelkonian/Movies/repos/balm-store`

### Completed Steps:

1. ✅ All store code extracted to new repository
2. ✅ Frontend dependencies installed (`npm install` successful)
3. ✅ Git repository initialized with initial commit
4. ✅ All route paths updated (removed `/store` prefix)
5. ✅ Import paths fixed for standalone structure
6. ✅ Configuration files created (vite, tailwind, tsconfig, etc.)
7. ✅ Documentation created (README, SETUP.md, etc.)

## ⚠️ Python Version Issue

Your system is using **Python 3.14** which is too new for SQLAlchemy 2.0.25.

### Solution: Use Python 3.11 or 3.12

**Option 1: Install Python 3.12 with Homebrew**

```bash
brew install python@3.12
cd /Users/davemelkonian/Movies/repos/balm-store/backend
rm -rf venv
python3.12 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python scripts/init_db.py
```

**Option 2: Install pyenv and use Python 3.12**

```bash
brew install pyenv
pyenv install 3.12
cd /Users/davemelkonian/Movies/repos/balm-store/backend
pyenv local 3.12
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python scripts/init_db.py
```

## 📋 Complete Setup Steps

### 1. Fix Python Version (see above)

### 2. Set Up Environment Variables

```bash
cd /Users/davemelkonian/Movies/repos/balm-store
cp .env.example .env
```

Edit `.env` with your values:

- `VITE_STRIPE_PUBLIC_KEY` - Your Stripe public key
- `SECRET_KEY` - Change for production!
- `ADMIN_PASSWORD` - Change from default!

### 3. Initialize Database

```bash
cd backend
source venv/bin/activate  # Make sure venv is activated
python scripts/init_db.py
```

This creates:

- Database tables (Product, Order, InventoryLog, User)
- Admin user (username: admin, password: admin123)
- Sample product

### 4. Start Backend

```bash
cd backend
source venv/bin/activate
python -m uvicorn app.main:app --reload
```

Backend should start on: **http://localhost:8000**

### 5. Start Frontend

```bash
cd frontend
npm run dev
```

Frontend should start on: **http://localhost:5173**

## 🎯 Access Points

Once running:

- **Store**: http://localhost:5173/
- **Admin Panel**: http://localhost:8000/admin/store
  - Username: `admin`
  - Password: `admin123`
- **API Docs**: http://localhost:8000/docs

## 🔍 Verification

Check that:

- [ ] Backend starts without errors
- [ ] Frontend loads at localhost:5173
- [ ] Can view store homepage
- [ ] Can click on products
- [ ] Can add items to cart
- [ ] Admin panel loads
- [ ] Can create/edit products in admin

## 📁 What Was Extracted

### Frontend (`/frontend`)

- All store pages (Store, ProductDetail, Checkout, Login, Signup, etc.)
- Store components (StoreHeader, ImageModal, LegalModal, ProtectedRoute)
- Context providers (Cart, Auth, Store)
- Required UI components (Button, Card, Input, Dropdown, etc.)
- Configuration (Vite, Tailwind, TypeScript)

### Backend (`/backend`)

- FastAPI application (app/main.py)
- Product API routes (app/api/routes/products.py)
- Database models (Product, Order, InventoryLog, User)
- Pydantic schemas
- Admin panel HTML (store_admin.html)
- Database init script (scripts/init_db.py)
- Documentation

## 🚨 Important Notes

1. **Python 3.14 is too new** - Use Python 3.11 or 3.12
2. **Change default passwords** before deploying to production
3. **Update .env** with real Stripe keys for payments
4. **Routes changed**: No more `/store` prefix
   - Was: `/store/product/:id`
   - Now: `/product/:id`

## 📚 Documentation

Refer to these files in the new repository:

- `SETUP.md` - Detailed setup instructions
- `README.md` - Project overview
- `backend/INVENTORY_SYSTEM.md` - API documentation
- `backend/INVENTORY_QUICKSTART.md` - Quick start guide
- `STORE_SEPARATION_GUIDE.md` - Architecture details

## 🐛 Troubleshooting

### Backend won't start

- Check Python version (use 3.11 or 3.12, not 3.14)
- Make sure venv is activated: `source venv/bin/activate`
- Reinstall dependencies: `pip install -r requirements.txt`
- Initialize database: `python scripts/init_db.py`

### Frontend won't start

- Check if port 5173 is free
- Try: `rm -rf node_modules && npm install`
- Check if backend is running on port 8000

### Database issues

- Delete and recreate: `rm backend/store.db && python backend/scripts/init_db.py`

## ✅ Next Steps After Setup

1. **Test all features**:

   - Browse products
   - Add to cart
   - Checkout flow
   - Admin panel operations

2. **Customize**:

   - Add your products via admin panel
   - Update branding/images
   - Configure Stripe for real payments

3. **Deploy** (when ready):
   - Frontend: Netlify, Vercel, or similar
   - Backend: Railway, Render, or similar
   - Use PostgreSQL for production database

## 🎉 Summary

Your BALM store has been successfully extracted into a standalone repository at:
`/Users/davemelkonian/Movies/repos/balm-store`

Just need to:

1. Use Python 3.11 or 3.12 (not 3.14)
2. Set up .env file
3. Initialize database
4. Start both servers

Then you'll have a fully functional standalone store!

---

For detailed instructions, see `SETUP.md` in the new repository.
