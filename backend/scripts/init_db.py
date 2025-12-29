"""
Initialize database with default admin user
Note: Products are now managed through Stripe, not the database
"""
import sys
from pathlib import Path

# Add parent directory to path to import app modules
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy.orm import Session
from app.db.database import SessionLocal, engine, Base
from app.models.user import User
from app.core.security import get_password_hash
from app.core.config import settings

# Create all tables
Base.metadata.create_all(bind=engine)


def init_admin_user(db: Session):
    """Create default admin user if it doesn't exist"""
    admin_user = db.query(User).filter(User.username == settings.ADMIN_USERNAME).first()
    if not admin_user:
        admin_user = User(
            username=settings.ADMIN_USERNAME,
            email="admin@balmstore.com",
            hashed_password=get_password_hash(settings.ADMIN_PASSWORD),
            is_active=True,
            is_admin=True
        )
        db.add(admin_user)
        db.commit()
        print(f"✅ Created admin user: {settings.ADMIN_USERNAME}")
    else:
        print(f"ℹ️  Admin user already exists: {settings.ADMIN_USERNAME}")


if __name__ == "__main__":
    print("\n🔧 Initializing BALM Store Database...\n")
    db = SessionLocal()
    try:
        init_admin_user(db)
        print("\n🎉 Database initialization complete!\n")
        print(f"Admin Username: {settings.ADMIN_USERNAME}")
        print(f"Admin Password: {settings.ADMIN_PASSWORD}")
        print("\nNote: Products are now managed through Stripe Dashboard\n")
    finally:
        db.close()

