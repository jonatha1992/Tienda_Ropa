from sqlmodel import SQLModel, Field
from datetime import datetime, timedelta
from typing import Optional
import secrets
import string


class EmailVerificationToken(SQLModel, table=True):
    __tablename__ = "email_verification_tokens"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    email: str = Field(index=True)
    token: str = Field(unique=True, index=True)
    code: str = Field(index=True)  # 6-digit code for user-friendly verification
    expires_at: datetime
    used_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    @classmethod
    def generate_verification_token(cls, user_id: int, email: str) -> "EmailVerificationToken":
        """Generate a new verification token with both token and code"""
        # Generate secure token for URL
        token = secrets.token_urlsafe(32)
        
        # Generate 6-digit code for manual entry
        code = ''.join(secrets.choice(string.digits) for _ in range(6))
        
        # Token expires in 24 hours
        expires_at = datetime.utcnow() + timedelta(hours=24)
        
        return cls(
            user_id=user_id,
            email=email,
            token=token,
            code=code,
            expires_at=expires_at
        )
    
    def is_expired(self) -> bool:
        """Check if token is expired"""
        return datetime.utcnow() > self.expires_at
    
    def is_used(self) -> bool:
        """Check if token has been used"""
        return self.used_at is not None
    
    def is_valid(self) -> bool:
        """Check if token is valid (not expired and not used)"""
        return not self.is_expired() and not self.is_used()
    
    def mark_as_used(self):
        """Mark token as used"""
        self.used_at = datetime.utcnow()


class EmailVerificationRequest(SQLModel):
    """Request model for email verification"""
    token: Optional[str] = None
    code: Optional[str] = None
    email: str


class EmailVerificationResponse(SQLModel):
    """Response model for email verification"""
    success: bool
    message: str
    verified: Optional[bool] = None