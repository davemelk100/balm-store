"""Email service for sending transactional emails"""
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class EmailService:
    """Service for sending emails via SendGrid"""
    
    @staticmethod
    def send_email(to_email: str, subject: str, html_content: str, text_content: str = None):
        """Send an email using SendGrid"""
        if not settings.SENDGRID_API_KEY:
            logger.warning(f"Email not sent (SendGrid not configured): {subject} to {to_email}")
            return False
        
        try:
            message = Mail(
                from_email=Email(settings.EMAIL_FROM, settings.EMAIL_FROM_NAME),
                to_emails=To(to_email),
                subject=subject,
                html_content=Content("text/html", html_content)
            )
            
            if text_content:
                message.plain_text_content = Content("text/plain", text_content)
            
            sg = SendGridAPIClient(settings.SENDGRID_API_KEY)
            response = sg.send(message)
            
            logger.info(f"Email sent successfully: {subject} to {to_email}")
            return True
            
        except Exception as e:
            logger.error(f"Error sending email: {str(e)}")
            return False
    
    @staticmethod
    def send_password_reset_email(to_email: str, reset_token: str):
        """Send password reset email"""
        reset_url = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"
        
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #333;">Reset Your Password</h2>
                <p>You requested to reset your password for your BALM Store account.</p>
                <p>Click the button below to reset your password:</p>
                <p style="margin: 30px 0;">
                    <a href="{reset_url}" 
                       style="background-color: #000; color: #fff; padding: 12px 30px; 
                              text-decoration: none; border-radius: 5px; display: inline-block;">
                        Reset Password
                    </a>
                </p>
                <p style="color: #666; font-size: 14px;">
                    This link will expire in {settings.PASSWORD_RESET_TOKEN_EXPIRE_MINUTES} minutes.
                </p>
                <p style="color: #666; font-size: 14px;">
                    If you didn't request this, you can safely ignore this email.
                </p>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                <p style="color: #999; font-size: 12px;">
                    BALM Store | balmsoothes.com
                </p>
            </body>
        </html>
        """
        
        text_content = f"""
        Reset Your Password
        
        You requested to reset your password for your BALM Store account.
        
        Click this link to reset your password:
        {reset_url}
        
        This link will expire in {settings.PASSWORD_RESET_TOKEN_EXPIRE_MINUTES} minutes.
        
        If you didn't request this, you can safely ignore this email.
        
        BALM Store | balmsoothes.com
        """
        
        return EmailService.send_email(
            to_email=to_email,
            subject="Reset Your Password - BALM Store",
            html_content=html_content,
            text_content=text_content
        )
    
    @staticmethod
    def send_verification_email(to_email: str, verification_token: str):
        """Send email verification email"""
        verification_url = f"{settings.FRONTEND_URL}/verify-email?token={verification_token}"
        
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #333;">Verify Your Email</h2>
                <p>Welcome to BALM Store! Please verify your email address to complete your registration.</p>
                <p style="margin: 30px 0;">
                    <a href="{verification_url}" 
                       style="background-color: #000; color: #fff; padding: 12px 30px; 
                              text-decoration: none; border-radius: 5px; display: inline-block;">
                        Verify Email
                    </a>
                </p>
                <p style="color: #666; font-size: 14px;">
                    This link will expire in 24 hours.
                </p>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                <p style="color: #999; font-size: 12px;">
                    BALM Store | balmsoothes.com
                </p>
            </body>
        </html>
        """
        
        text_content = f"""
        Verify Your Email
        
        Welcome to BALM Store! Please verify your email address to complete your registration.
        
        Click this link to verify your email:
        {verification_url}
        
        This link will expire in 24 hours.
        
        BALM Store | balmsoothes.com
        """
        
        return EmailService.send_email(
            to_email=to_email,
            subject="Verify Your Email - BALM Store",
            html_content=html_content,
            text_content=text_content
        )
    
    @staticmethod
    def send_welcome_email(to_email: str, name: str = None):
        """Send welcome email after successful registration"""
        display_name = name or "there"
        
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #333;">Welcome to BALM Store!</h2>
                <p>Hi {display_name},</p>
                <p>Thank you for joining BALM Store. We're excited to have you!</p>
                <p style="margin: 30px 0;">
                    <a href="{settings.FRONTEND_URL}" 
                       style="background-color: #000; color: #fff; padding: 12px 30px; 
                              text-decoration: none; border-radius: 5px; display: inline-block;">
                        Start Shopping
                    </a>
                </p>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                <p style="color: #999; font-size: 12px;">
                    BALM Store | balmsoothes.com
                </p>
            </body>
        </html>
        """
        
        text_content = f"""
        Welcome to BALM Store!
        
        Hi {display_name},
        
        Thank you for joining BALM Store. We're excited to have you!
        
        Visit us at: {settings.FRONTEND_URL}
        
        BALM Store | balmsoothes.com
        """
        
        return EmailService.send_email(
            to_email=to_email,
            subject="Welcome to BALM Store!",
            html_content=html_content,
            text_content=text_content
        )


# Instance for easy import
email_service = EmailService()

