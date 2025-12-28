from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from itsdangerous import URLSafeTimedSerializer
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict]:
    """Decode and verify a JWT token"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None


# Token serializer for password reset and email verification
serializer = URLSafeTimedSerializer(settings.SECRET_KEY)


def generate_password_reset_token(email: str) -> str:
    """Generate a secure token for password reset"""
    return serializer.dumps(email, salt="password-reset")


def verify_password_reset_token(token: str) -> Optional[str]:
    """Verify password reset token and return email if valid"""
    try:
        email = serializer.loads(
            token,
            salt="password-reset",
            max_age=settings.PASSWORD_RESET_TOKEN_EXPIRE_MINUTES * 60
        )
        return email
    except Exception:
        return None


def generate_email_verification_token(email: str) -> str:
    """Generate a secure token for email verification"""
    return serializer.dumps(email, salt="email-verification")


def verify_email_verification_token(token: str) -> Optional[str]:
    """Verify email verification token and return email if valid"""
    try:
        email = serializer.loads(
            token,
            salt="email-verification",
            max_age=settings.EMAIL_VERIFICATION_TOKEN_EXPIRE_MINUTES * 60
        )
        return email
    except Exception:
        return None

