from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime
from ...core.mailer import render_template, send_email
from ...core.config import settings

router = APIRouter()


class WelcomeEmailRequest(BaseModel):
    to: EmailStr
    display_name: Optional[str] = None


class NotificationEmailRequest(BaseModel):
    to: EmailStr
    title: str
    message: str
    action_url: Optional[str] = None


class OrderConfirmationEmailRequest(BaseModel):
    to: EmailStr
    order_number: str
    order_date: str
    customer_name: str
    order_items: List[Dict[str, Any]]
    subtotal: float
    discount: float = 0.0
    shipping_cost: float
    total: float
    shipping_address: str
    shipping_city: str
    shipping_postal_code: str
    delivery_notes: Optional[str] = None
    payment_method_text: str
    payment_instructions: Optional[str] = None


class ContactEmailRequest(BaseModel):
    customer_name: str
    customer_email: EmailStr
    customer_phone: Optional[str] = None
    subject: str
    message: str
    priority: Optional[str] = "medium"  # low, medium, high


@router.post("/welcome")
async def send_welcome_email(request: WelcomeEmailRequest):
    """Send welcome email to new user"""
    try:
        # Render template
        html_content = render_template(
            "email_welcome.html",
            display_name=request.display_name,
            app_name=settings.APP_NAME,
            app_url=settings.APP_URL
        )
        
        # Send email
        success = send_email(
            to=request.to,
            subject=f"¡Bienvenido a {settings.APP_NAME}!",
            html_content=html_content
        )
        
        if not success:
            raise HTTPException(
                status_code=500,
                detail="Error al enviar el email de bienvenida"
            )
        
        return {
            "message": "Email de bienvenida enviado exitosamente",
            "to": request.to
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error interno del servidor: {str(e)}"
        )


@router.post("/order-confirmation")
async def send_order_confirmation_email(request: OrderConfirmationEmailRequest):
    """Send order confirmation email with purchase details"""
    try:
        # Render template
        html_content = render_template(
            "email_order_confirmation.html",
            app_name=settings.APP_NAME,
            app_url=settings.APP_URL,
            order_number=request.order_number,
            order_date=request.order_date,
            customer_name=request.customer_name,
            order_items=request.order_items,
            subtotal=request.subtotal,
            discount=request.discount,
            shipping_cost=request.shipping_cost,
            total=request.total,
            shipping_address=request.shipping_address,
            shipping_city=request.shipping_city,
            shipping_postal_code=request.shipping_postal_code,
            delivery_notes=request.delivery_notes,
            payment_method_text=request.payment_method_text,
            payment_instructions=request.payment_instructions
        )
        
        # Send email
        success = send_email(
            to=request.to,
            subject=f"Confirmación de pedido #{request.order_number} - {settings.APP_NAME}",
            html_content=html_content
        )
        
        if not success:
            raise HTTPException(
                status_code=500,
                detail="Error al enviar el email de confirmación de pedido"
            )
        
        return {
            "message": "Email de confirmación de pedido enviado exitosamente",
            "to": request.to,
            "order_number": request.order_number
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error interno del servidor: {str(e)}"
        )


@router.post("/notify")
async def send_notification_email(request: NotificationEmailRequest):
    """Send notification email"""
    try:
        # Render template
        html_content = render_template(
            "email_notification.html",
            title=request.title,
            message=request.message,
            action_url=request.action_url
        )
        
        # Send email
        success = send_email(
            to=request.to,
            subject=request.title,
            html_content=html_content
        )
        
        if not success:
            raise HTTPException(
                status_code=500,
                detail="Error al enviar el email de notificación"
            )
        
        return {
            "message": "Email de notificación enviado exitosamente",
            "to": request.to,
            "title": request.title
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error interno del servidor: {str(e)}"
        )


@router.post("/contact")
async def send_contact_email(request: ContactEmailRequest):
    """Send contact form email to admin"""
    try:
        # Render template
        html_content = render_template(
            "email_contact.html",
            app_name=settings.APP_NAME,
            app_url=settings.APP_URL,
            customer_name=request.customer_name,
            customer_email=request.customer_email,
            customer_phone=request.customer_phone,
            subject=request.subject,
            message=request.message,
            priority=request.priority,
            message_date=datetime.now().strftime("%d/%m/%Y %H:%M")
        )
        
        # Send email to admin/support email
        admin_email = settings.MAIL_FROM  # or a specific support email
        success = send_email(
            to=admin_email,
            subject=f"Contacto: {request.subject} - {settings.APP_NAME}",
            html_content=html_content
        )
        
        if not success:
            raise HTTPException(
                status_code=500,
                detail="Error al enviar el mensaje de contacto"
            )
        
        return {
            "message": "Mensaje de contacto enviado exitosamente",
            "customer_email": request.customer_email,
            "subject": request.subject
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error interno del servidor: {str(e)}"
        )
