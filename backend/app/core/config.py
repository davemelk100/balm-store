from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "sqlite:///./store.db"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Admin
    ADMIN_USERNAME: str = "admin"
    ADMIN_PASSWORD: str = "admin123"  # Change this in production
    
    # CORS
    # Can be comma-separated string or list
    # In production, set via environment variable: CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000,http://localhost:8080,http://localhost:8888"
    
    # Frontend URL for OAuth redirects and email links
    FRONTEND_URL: str = "http://localhost:8888"
    
    # Google OAuth
    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    GOOGLE_REDIRECT_URI: str = "http://localhost:8000/api/auth/google/callback"
    
    # Email Configuration (Resend)
    RESEND_API_KEY: Optional[str] = None
    EMAIL_FROM: str = "noreply@balmsoothes.com"
    EMAIL_FROM_NAME: str = "BALM Store"
    
    # Password Reset Token Expiry (in minutes)
    PASSWORD_RESET_TOKEN_EXPIRE_MINUTES: int = 30
    EMAIL_VERIFICATION_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    
    @property
    def cors_origins_list(self) -> list[str]:
        """Parse CORS_ORIGINS string into list"""
        if isinstance(self.CORS_ORIGINS, str):
            return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]
        return self.CORS_ORIGINS if isinstance(self.CORS_ORIGINS, list) else []
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

