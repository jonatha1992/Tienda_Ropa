from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select
from typing import Optional
from datetime import datetime

from app.db.session import get_session
from app.models.user import User
from app.models.email_verification import (
    EmailVerificationToken, 
    EmailVerificationRequest, 
    EmailVerificationResponse
)
from app.core.mailer import render_template, send_email
from app.core.config import settings

router = APIRouter()


@router.post("/send-verification")
async def send_verification_email(
    user_id: int,
    email: str,
    display_name: Optional[str] = None,
    session: Session = Depends(get_session)
):
    """Send email verification to user"""
    try:
        # Check if user exists
        user = session.get(User, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        
        # Invalidate any existing tokens for this email
        existing_tokens = session.exec(
            select(EmailVerificationToken).where(
                EmailVerificationToken.email == email,
                EmailVerificationToken.used_at.is_(None)
            )
        ).all()
        
        for token in existing_tokens:
            token.mark_as_used()
            session.add(token)
        
        # Generate new verification token
        verification_token = EmailVerificationToken.generate_verification_token(
            user_id=user_id,
            email=email
        )
        session.add(verification_token)
        session.commit()
        session.refresh(verification_token)
        
        # Create verification URL
        verification_url = f"{settings.FRONTEND_URL}/verify-email?token={verification_token.token}"
        
        # Render email template
        html_content = render_template(
            'email_verification.html',
            display_name=display_name or email.split('@')[0],
            app_name=settings.APP_NAME,
            app_url=settings.APP_URL,
            verification_code=verification_token.code,
            verification_url=verification_url,
            expire_hours=24,
            support_email=settings.MAIL_FROM
        )
        
        # Send email
        success = send_email(
            to=email,
            subject=f'Verifica tu email - {settings.APP_NAME}',
            html_content=html_content
        )
        
        if not success:
            raise HTTPException(
                status_code=500,
                detail="Error al enviar el email de verificación"
            )
        
        return {
            "message": "Email de verificación enviado exitosamente",
            "email": email,
            "expires_in_hours": 24
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error interno del servidor: {str(e)}"
        )


@router.post("/verify", response_model=EmailVerificationResponse)
async def verify_email(
    request: EmailVerificationRequest,
    session: Session = Depends(get_session)
):
    """Verify email using token or code"""
    try:
        verification_token = None
        
        # Try to find token by URL token or by code
        if request.token:
            verification_token = session.exec(
                select(EmailVerificationToken).where(
                    EmailVerificationToken.token == request.token,
                    EmailVerificationToken.email == request.email
                )
            ).first()
        elif request.code:
            verification_token = session.exec(
                select(EmailVerificationToken).where(
                    EmailVerificationToken.code == request.code,
                    EmailVerificationToken.email == request.email
                )
            ).first()
        else:
            raise HTTPException(
                status_code=400,
                detail="Se requiere token o código de verificación"
            )
        
        if not verification_token:
            return EmailVerificationResponse(
                success=False,
                message="Token o código de verificación inválido",
                verified=False
            )
        
        # Check if token is valid
        if not verification_token.is_valid():
            if verification_token.is_expired():
                message = "El código de verificación ha expirado. Solicita uno nuevo."
            else:
                message = "Este código ya ha sido utilizado."
            
            return EmailVerificationResponse(
                success=False,
                message=message,
                verified=False
            )
        
        # Mark token as used
        verification_token.mark_as_used()
        session.add(verification_token)
        
        # Update user as verified
        user = session.get(User, verification_token.user_id)
        if user:
            user.email_verified = True
            user.email_verified_at = datetime.utcnow()
            session.add(user)
        
        session.commit()
        
        return EmailVerificationResponse(
            success=True,
            message="Email verificado exitosamente",
            verified=True
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error interno del servidor: {str(e)}"
        )


@router.post("/resend-verification")
async def resend_verification_email(
    email: str,
    session: Session = Depends(get_session)
):
    """Resend verification email for a user"""
    try:
        # Find user by email
        user = session.exec(
            select(User).where(User.email == email)
        ).first()
        
        if not user:
            # Don't reveal if email exists for security
            return {
                "message": "Si el email existe en nuestro sistema, se ha enviado un nuevo código de verificación",
                "email": email
            }
        
        # Check if already verified
        if getattr(user, 'email_verified', False):
            return {
                "message": "Este email ya está verificado",
                "email": email,
                "already_verified": True
            }
        
        # Send new verification email
        await send_verification_email(
            user_id=user.id,
            email=email,
            display_name=getattr(user, 'nombre', None) or email.split('@')[0],
            session=session
        )
        
        return {
            "message": "Si el email existe en nuestro sistema, se ha enviado un nuevo código de verificación",
            "email": email
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error interno del servidor: {str(e)}"
        )


@router.get("/status/{user_id}")
async def get_verification_status(
    user_id: int,
    session: Session = Depends(get_session)
):
    """Get email verification status for a user"""
    try:
        user = session.get(User, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        
        return {
            "user_id": user_id,
            "email": user.email,
            "email_verified": getattr(user, 'email_verified', False),
            "email_verified_at": getattr(user, 'email_verified_at', None)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error interno del servidor: {str(e)}"
        )