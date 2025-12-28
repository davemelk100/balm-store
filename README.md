# 🛍️ BALM Store

A modern, full-stack e-commerce store built with **React**, **TypeScript**, **FastAPI**, and **SQLAlchemy**. Features a beautiful storefront, shopping cart, checkout flow, and comprehensive admin panel for product management.

![BALM Store](https://img.shields.io/badge/Status-Ready%20to%20Deploy-success)
![Python](https://img.shields.io/badge/Python-3.11+-blue)
![React](https://img.shields.io/badge/React-18+-61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688)

## ✨ Features

### 🎨 Customer-Facing Store

- **Product Browsing** - Browse products with beautiful card layouts
- **Product Details** - Detailed product pages with image galleries
- **Shopping Cart** - Add/remove items, update quantities
- **Checkout** - Secure checkout flow with Stripe integration
- **User Authentication** - Sign up, login, and manage account
- **Responsive Design** - Mobile-first, works on all devices

### 🔧 Admin Panel

- **Product Management** - Create, edit, delete products
- **Inventory Tracking** - Monitor stock levels and low-stock alerts
- **Order Management** - View and manage customer orders
- **Image Management** - Upload and manage product images
- **Multi-variant Products** - Support for sizes and colors

### 🚀 Technical Features

- **FastAPI Backend** - High-performance Python API
- **React + TypeScript Frontend** - Type-safe, modern UI
- **SQLAlchemy ORM** - Database abstraction layer
- **JWT Authentication** - Secure token-based auth
- **RESTful API** - Clean, documented API endpoints
- **Stripe Integration** - Ready for payments

## 📸 Screenshots

_(Add your screenshots here)_

## 🏗️ Tech Stack

### Frontend

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations
- **React Router** - Client-side routing
- **Radix UI** - Accessible components

### Backend

- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL toolkit & ORM
- **Pydantic** - Data validation
- **JWT** - Authentication
- **Uvicorn** - ASGI server
- **SQLite/PostgreSQL** - Database

## 🚀 Quick Start

### Prerequisites

- **Python 3.11+** (Python 3.14 not supported yet)
- **Node.js 18+**
- **npm** or **yarn**

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/balm-store.git
cd balm-store
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
VITE_API_URL=http://localhost:8000
VITE_STRIPE_PUBLIC_KEY=pk_test_your_key_here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
SECRET_KEY=your_secret_key_here
DATABASE_URL=sqlite:///./store.db
```

### 3. Set Up Backend

```bash
cd backend

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
python scripts/init_db.py
```

### 4. Set Up Frontend

```bash
cd frontend

# Install dependencies
npm install
```

### 5. Run the Application

**Terminal 1 - Backend:**

```bash
cd backend
source venv/bin/activate
python -m uvicorn app.main:app --reload
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

### 6. Set Up Stripe Payments (Required for Checkout)

See **[STRIPE_QUICKSTART.md](STRIPE_QUICKSTART.md)** for a 5-minute setup guide.

**Quick version:**

1. Get your Stripe test key from https://dashboard.stripe.com/test/apikeys
2. Add `STRIPE_SECRET_KEY` to Netlify environment variables
3. Redeploy

### 7. Access the Application

- **Store**: http://localhost:5173
- **Admin Panel**: http://localhost:8000/admin/store
  - Username: `admin`
  - Password: `admin123` (change this!)
- **API Docs**: http://localhost:8000/docs

## 📁 Project Structure

```
balm-store/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── store/           # Store pages & components
│   │   ├── components/      # Shared UI components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilities
│   │   └── config/          # Configuration
│   ├── public/              # Static assets
│   └── package.json
│
├── backend/                  # FastAPI backend
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── models/         # Database models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── core/           # Config & security
│   │   └── db/             # Database setup
│   ├── scripts/            # Utility scripts
│   ├── store_admin.html    # Admin panel
│   └── requirements.txt
│
├── .env                     # Environment variables (gitignored)
├── .env.example             # Environment template
└── README.md
```

## 🔑 Admin Panel

Access the admin panel at `http://localhost:8000/admin/store`

### Features:

- **Products Tab** - Add, edit, delete products
- **Inventory Tab** - View inventory logs
- **Orders Tab** - Manage customer orders

### Product Management:

- Add product with ID, title, description
- Set prices and SKUs
- Upload images
- Configure sizes and colors
- Set stock quantities
- Control visibility

## 🌐 API Documentation

Interactive API documentation available at:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key Endpoints:

**Products**

- `GET /api/products` - List all products
- `GET /api/products/{id}` - Get product details
- `POST /api/products` - Create product (admin)
- `PUT /api/products/{id}` - Update product (admin)
- `DELETE /api/products/{id}` - Delete product (admin)

**Orders**

- `GET /api/orders` - List orders (admin)
- `POST /api/orders` - Create order
- `GET /api/orders/{id}` - Get order details

**Inventory**

- `GET /api/inventory/logs` - View inventory logs (admin)
- `POST /api/inventory/adjust` - Adjust inventory (admin)

## 🚢 Deployment

### Frontend (Netlify)

1. Build the frontend:

```bash
cd frontend
npm run build
```

2. Deploy to Netlify:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

Or connect your GitHub repo to Netlify for automatic deployments.

### Backend (Railway)

1. Create a `railway.json` in the backend directory:

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn app.main:app --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

2. Deploy to Railway:

```bash
railway login
railway init
railway up
```

### Production Checklist

- [ ] Use PostgreSQL instead of SQLite
- [ ] Set strong `SECRET_KEY` and `ADMIN_PASSWORD`
- [ ] Configure production CORS origins
- [ ] Use production Stripe keys
- [ ] Set up SSL/HTTPS
- [ ] Configure environment variables on hosting platform
- [ ] Enable database backups
- [ ] Set up monitoring and logging

## 🔐 Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- SQL injection protection via SQLAlchemy
- Environment-based configuration
- Admin-only routes protected

**⚠️ Important**: Change default passwords before deploying to production!

## 🧪 Testing

```bash
# Backend tests (if implemented)
cd backend
pytest

# Frontend tests (if implemented)
cd frontend
npm test
```

## 📚 Documentation

### 🎯 Quick Start

- **[CLI Index](CLI_INDEX.md)** - 🔥 Master hub for all CLI tools and automation
- **[Getting Started](GETTING_STARTED.md)** - Quick setup guide
- **[Setup Instructions](SETUP.md)** - Detailed setup walkthrough

### 🛠️ CLI Tools & Automation

- **[CLI Cheatsheet](CLI_CHEATSHEET.md)** - Complete command reference for all CLIs
- **[CLI Setup Guide](CLI_SETUP_GUIDE.md)** - Installation and configuration
- **[Development Workflows](dev-workflows.sh)** - Interactive automation menu
- **[Install All CLIs](install-all-clis.sh)** - One-command CLI installation

### 🚀 Deployment

- **[Railway Quickstart](RAILWAY_QUICKSTART.md)** - Railway CLI quick reference
- **[Railway Setup](RAILWAY_CLI_SETUP.md)** - Detailed Railway configuration
- **[Railway Comparison](RAILWAY_COMPARISON.md)** - Platform comparison
- **[Deployment Guide](DEPLOYMENT.md)** - General deployment guide

### 🔌 Integrations

- **[Stripe Quickstart](STRIPE_QUICKSTART.md)** - 🔥 Quick Stripe setup (5 min)
- **[Stripe Setup](STRIPE_SETUP.md)** - Complete Stripe integration
- **[Resend Email Setup](RESEND_EMAIL_SETUP.md)** - 📧 Email configuration (Resend)
- **[Inventory System](backend/INVENTORY_SYSTEM.md)** - Inventory API docs
- **[Inventory Quickstart](backend/INVENTORY_QUICKSTART.md)** - Quick start guide

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Troubleshooting

### Backend won't start

- Check Python version (must be 3.11 or 3.12, not 3.14)
- Ensure virtual environment is activated
- Try: `pip install --upgrade -r requirements.txt`

### Frontend won't connect to backend

- Check that backend is running on port 8000
- Verify `VITE_API_URL` in `.env`
- Check CORS settings in `backend/app/core/config.py`

### Database errors

- Delete database: `rm backend/store.db`
- Reinitialize: `python backend/scripts/init_db.py`

### Import errors

- Make sure you're in the correct directory
- Virtual environment activated for backend
- All dependencies installed

## 📞 Support

For issues and questions:

- Open an issue on GitHub
- Check existing documentation
- Review API docs at `/docs`

## 🎯 Roadmap

- [ ] Add product reviews and ratings
- [ ] Implement order tracking
- [ ] Add email notifications
- [ ] Support for product categories
- [ ] Wishlist functionality
- [ ] Advanced search and filtering
- [ ] Analytics dashboard
- [ ] Multi-currency support
- [ ] Shipping calculator

## 🙏 Acknowledgments

- Built with ❤️ for BALM merchandise
- Powered by FastAPI and React
- Icons from Lucide React
- UI components from Radix UI

---

**Made with 🎨 by [Your Name]**

[⬆ Back to top](#-balm-store)
