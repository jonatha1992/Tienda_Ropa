"""
Rutas de pagos con MercadoPago
"""
from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlmodel import Session

from app.db.session import get_session
from app.core.security import get_current_user
from app.controllers.payments_controller import payments_controller

router = APIRouter()


@router.post("/payments/create-preference")
def create_payment_preference(
    order_id: int,
    session: Session = Depends(get_session),
    user=Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Crea una preferencia de pago en MercadoPago para una orden específica
    """
    return payments_controller.create_preference(order_id, session)


@router.post("/payments/webhook")
async def mercadopago_webhook(
    request: Request,
    session: Session = Depends(get_session)
) -> Dict[str, str]:
    """
    Webhook para recibir notificaciones de MercadoPago
    No requiere autenticación ya que viene de MercadoPago
    """
    try:
        webhook_data = await request.json()
        return payments_controller.process_webhook(webhook_data, session)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error procesando webhook: {str(e)}")


@router.get("/payments/status/{order_id}")
def get_payment_status(
    order_id: int,
    session: Session = Depends(get_session),
    user=Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Obtiene el estado actual de pago de una orden
    """
    return payments_controller.get_payment_status(order_id, session)
