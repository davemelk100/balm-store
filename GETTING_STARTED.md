# 🚀 Getting Started with BALM Store

Quick guide to get your store up and running in minutes!

## ⚡ Quick Start (5 Minutes)

```bash
# 1. Clone and navigate
git clone https://github.com/YOUR-USERNAME/balm-store.git
cd balm-store

# 2. Set up environment
cp .env.example .env
# Edit .env with your values

# 3. Backend setup
cd backend
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python scripts/init_db.py

# 4. Frontend setup (new terminal)
cd frontend
npm install

# 5. Start both servers
# Terminal 1 (backend):
cd backend && source venv/bin/activate && python -m uvicorn app.main:app --reload

# Terminal 2 (frontend):
cd frontend && npm run dev
```

**Access**: http://localhost:5173

## 📦 What's Included

Your store comes with:

- ✅ **Full e-commerce system** - Browse, cart, checkout
- ✅ **Admin panel** - Manage products, inventory, orders
- ✅ **User authentication** - Login, signup, sessions
- ✅ **Stripe integration** - Ready for payments
- ✅ **Responsive design** - Mobile-first
- ✅ **RESTful API** - Well-documented
- ✅ **Database** - SQLite (dev) / PostgreSQL (prod)

## 🎯 Your First Steps

### 1. Explore the Store

Visit http://localhost:5173 to see:

- Product listings
- Product details
- Shopping cart
- Checkout flow

### 2. Access Admin Panel

Go to http://localhost:8000/admin/store

**Default credentials**:

- Username: `admin`
- Password: `admin123`

**⚠️ Change these immediately!**

### 3. Add Your First Product

In the admin panel:

1. Click "Products" tab
2. Click "+ Add Product"
3. Fill in:
   - Product ID: `balm-shirt-2`
   - Title: "Your Product Name"
   - Category: `buttonup` (or create new)
   - Price: `25.00`
   - Images: Upload or use URLs
   - Sizes: Select available sizes
   - Colors: Select available colors
   - Stock: Set initial quantity
4. Click "Save"

### 4. Test a Purchase

1. Browse to product
2. Add to cart
3. Go to checkout
4. Sign up/login
5. Complete purchase (use Stripe test card: `4242 4242 4242 4242`)

## 🔧 Configuration

### Environment Variables

Edit `.env` file:

```env
# API Connection
VITE_API_URL=http://localhost:8000

# Stripe (get from https://dashboard.stripe.com/test/apikeys)
VITE_STRIPE_PUBLIC_KEY=pk_test_your_key_here

# Admin Access
ADMIN_USERNAME=admin
ADMIN_PASSWORD=changeThisNow!

# Database
DATABASE_URL=sqlite:///./store.db

# Security (generate random string)
SECRET_KEY=your-secret-key-here
```

### Generate Secure Keys

```python
import secrets
print(secrets.token_urlsafe(32))
```

## 📁 Project Structure

```
balm-store/
├── frontend/              # React + TypeScript
│   ├── src/
│   │   ├── store/        # Store pages & components
│   │   ├── components/   # UI components
│   │   └── config/       # Configuration
│   └── package.json
│
├── backend/               # FastAPI
│   ├── app/
│   │   ├── api/         # API routes
│   │   ├── models/      # Database models
│   │   └── core/        # Config & security
│   └── requirements.txt
│
└── .env                  # Your configuration
```

## 🎨 Customization

### Change Branding

**Logo**: Replace `frontend/public/img/balm-varsity.svg`

**Colors**: Edit `frontend/src/globals.css`

**Fonts**: Edit `frontend/tailwind.config.ts`

### Add Products

Use the admin panel or edit `frontend/src/store/data/storeProducts.ts`

### Modify Categories

In admin panel, change the category dropdown options or edit:
`backend/app/schemas/product.py`

## 🧪 Testing

### Test Stripe Integration

Use these test cards:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0027 6000 3184`

Any future expiry date and any 3-digit CVC works.

### Test API

Visit http://localhost:8000/docs for interactive API documentation.

Try:

- `GET /api/products` - List products
- `GET /api/products/{id}` - Get product details
- `POST /api/orders` - Create order

## 🚀 Deploy to Production

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment guide.

**Quick version**:

1. **Frontend** (Netlify):

   - Connect GitHub repo
   - Set build: `npm run build` in `frontend/`
   - Set env vars

2. **Backend** (Railway):
   - Connect GitHub repo
   - Add PostgreSQL database
   - Set env vars
   - Run `python scripts/init_db.py`

## 📚 Documentation

- **[README.md](README.md)** - Project overview
- **[SETUP.md](SETUP.md)** - Detailed setup
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deployment guide
- **[backend/INVENTORY_SYSTEM.md](backend/INVENTORY_SYSTEM.md)** - API docs

## 🆘 Common Issues

### Backend won't start

**Problem**: `ModuleNotFoundError` or import errors

**Solution**:

```bash
cd backend
source venv/bin/activate  # Must activate!
pip install -r requirements.txt
```

### Frontend can't connect to backend

**Problem**: API calls failing

**Solution**:

- Check backend is running on port 8000
- Verify `VITE_API_URL` in `.env`
- Check browser console for CORS errors

### Database errors

**Problem**: Table doesn't exist

**Solution**:

```bash
cd backend
rm store.db  # Delete old database
python scripts/init_db.py  # Recreate
```

### Python version issues

**Problem**: Incompatibility errors

**Solution**: Use Python 3.11 or 3.12 (not 3.14!)

```bash
python3.11 -m venv venv
```

## 💡 Pro Tips

1. **Use two terminals** - One for backend, one for frontend
2. **Check logs** - Most issues show helpful error messages
3. **Read API docs** - Visit `/docs` for interactive API reference
4. **Test with Stripe test mode** - Use test keys until ready
5. **Backup database** - Copy `store.db` before major changes

## 🎯 Next Steps

Now that you're set up:

1. [ ] Customize your products
2. [ ] Update branding and colors
3. [ ] Configure Stripe for real payments
4. [ ] Add more product images
5. [ ] Test all features thoroughly
6. [ ] Deploy to production
7. [ ] Set up custom domain

## 📞 Need Help?

- **API Documentation**: http://localhost:8000/docs
- **GitHub Issues**: Create an issue
- **Logs**: Check terminal output for errors

## 🎉 You're Ready!

Your BALM Store is now running! Start customizing and adding products.

**Store**: http://localhost:5173  
**Admin**: http://localhost:8000/admin/store  
**API Docs**: http://localhost:8000/docs

Happy selling! 🛍️
