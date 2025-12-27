# BALM Store

A standalone e-commerce store application extracted from the dm-2025 project.

## Features

- Product catalog with categories (Button-Up, Music, Sports)
- Shopping cart functionality
- User authentication and protected routes
- Checkout process
- Admin panel for inventory management
- Order tracking
- Responsive design

## Project Structure

```
balm-store/
├── frontend/          # React + TypeScript frontend
│   ├── src/
│   │   ├── store/    # Store-specific code
│   │   ├── components/ # Shared UI components
│   │   └── lib/      # Utilities
│   └── public/       # Static assets
└── backend/          # FastAPI backend
    ├── app/
    │   ├── api/      # API routes
    │   ├── models/   # Database models
    │   └── schemas/  # Pydantic schemas
    └── scripts/      # Database initialization
```

## Setup

### Frontend

```bash
cd frontend
npm install
cp ../.env.example .env
# Edit .env with your configuration
npm run dev
```

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp ../.env.example .env
# Edit .env with your configuration
python scripts/init_db.py
python -m uvicorn app.main:app --reload
```

## Admin Panel

Access the admin panel at: http://localhost:8000/admin/store

Default credentials (change in production):
- Username: admin
- Password: admin123

## Documentation

- See `STORE_SEPARATION_GUIDE.md` for architecture details
- See `backend/INVENTORY_SYSTEM.md` for backend API documentation
- See `backend/INVENTORY_QUICKSTART.md` for quick start guide

## Technologies

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Radix UI
- React Router

### Backend
- FastAPI
- SQLAlchemy
- Pydantic
- SQLite (can be changed to PostgreSQL)

## License

[Your License Here]
