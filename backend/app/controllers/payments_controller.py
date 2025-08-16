"""
Controlador de pagos con MercadoPago
"""
import logging
import mercadopago
from typing import Dict, Any, Optional
from fastapi import HTTPException
from sqlmodel import Session, select

from app.core.config import settings
from app.models.order import Order, PaymentStatus, PaymentMethod
from app.models.customer import Customer

logger = logging.getLogger(__name__)


class PaymentsController:
    """Controlador para manejar pagos con MercadoPago"""
    
    def __init__(self):
        if not settings.MERCADOPAGO_ACCESS_TOKEN:
            logger.warning("MERCADOPAGO_ACCESS_TOKEN no configurado")
            self.sdk = None
        else:
            self.sdk = mercadopago.SDK(settings.MERCADOPAGO_ACCESS_TOKEN)
    
    def create_preference(self, order_id: int, session: Session) -> Dict[str, Any]:
        """
        Crea una preferencia de pago en MercadoPago para una orden
        """
        if not self.sdk:
            raise HTTPException(
                status_code=500, 
                detail="MercadoPago no configurado correctamente"
            )
        
        # Obtener la orden
        order = session.get(Order, order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Orden no encontrada")
        
        # Obtener el customer
        customer = session.get(Customer, order.customer_id)
        if not customer:
            raise HTTPException(status_code=404, detail="Cliente no encontrado")
        
        # Crear preferencia
        preference_data = {
            "items": [
                {
                    "title": f"Orden #{order.id}",
                    "quantity": 1,
                    "unit_price": float(order.total),
                    "currency_id": "ARS"
                }
            ],
            "payer": {
                "name": customer.name,
                "email": customer.email or "noemail@example.com",
                "phone": {
                    "number": customer.phone or "1234567890"
                }
            },
            "back_urls": {
                "success": settings.MERCADOPAGO_SUCCESS_URL,
                "failure": settings.MERCADOPAGO_FAILURE_URL,
                "pending": settings.MERCADOPAGO_PENDING_URL
            },
            "auto_return": "approved",
            "external_reference": str(order.id),
            "notification_url": f"{settings.FRONTEND_URL.replace('5173', '8000')}/api/v1/payments/webhook"
        }
        
        try:
            preference_response = self.sdk.preference().create(preference_data)
            
            if preference_response["status"] == 201:
                preference = preference_response["response"]
                
                # Actualizar orden con preference_id
                order.mercadopago_preference_id = preference["id"]
                order.payment_status = PaymentStatus.PENDING_PAYMENT
                session.add(order)
                session.commit()
                session.refresh(order)
                
                return {
                    "preference_id": preference["id"],
                    "init_point": preference["init_point"],
                    "sandbox_init_point": preference.get("sandbox_init_point"),
                    "order_id": order.id
                }
            else:
                logger.error(f"Error creando preferencia: {preference_response}")
                raise HTTPException(
                    status_code=500, 
                    detail="Error creando preferencia de pago"
                )
                
        except Exception as e:
            logger.error(f"Error en create_preference: {e}")
            raise HTTPException(
                status_code=500, 
                detail="Error interno creando preferencia"
            )
    
    def process_webhook(self, webhook_data: Dict[str, Any], session: Session) -> Dict[str, str]:
        """
        Procesa webhook de MercadoPago para actualizar estado de pago
        """
        if not self.sdk:
            raise HTTPException(
                status_code=500, 
                detail="MercadoPago no configurado correctamente"
            )
        
        try:
            # Validar tipo de notificación
            if webhook_data.get("type") != "payment":
                return {"status": "ignored", "reason": "not_payment_notification"}
            
            payment_id = webhook_data.get("data", {}).get("id")
            if not payment_id:
                return {"status": "error", "reason": "missing_payment_id"}
            
            # Obtener información del pago
            payment_response = self.sdk.payment().get(payment_id)
            
            if payment_response["status"] != 200:
                logger.error(f"Error obteniendo pago: {payment_response}")
                return {"status": "error", "reason": "payment_not_found"}
            
            payment_data = payment_response["response"]
            external_reference = payment_data.get("external_reference")
            
            if not external_reference:
                return {"status": "error", "reason": "missing_external_reference"}
            
            # Buscar orden por external_reference
            order = session.exec(
                select(Order).where(Order.id == int(external_reference))
            ).first()
            
            if not order:
                return {"status": "error", "reason": "order_not_found"}
            
            # Actualizar estado según status del pago
            payment_status = payment_data.get("status")
            
            if payment_status == "approved":
                order.payment_status = PaymentStatus.APPROVED
            elif payment_status == "rejected":
                order.payment_status = PaymentStatus.REJECTED
            elif payment_status == "cancelled":
                order.payment_status = PaymentStatus.CANCELLED
            elif payment_status in ["pending", "in_process"]:
                order.payment_status = PaymentStatus.PENDING_PAYMENT
            else:
                order.payment_status = PaymentStatus.PENDING
            
            # Guardar payment_id de MercadoPago
            order.mercadopago_payment_id = str(payment_id)
            
            session.add(order)
            session.commit()
            
            logger.info(f"Orden {order.id} actualizada: {order.payment_status}")
            
            return {
                "status": "success", 
                "order_id": str(order.id),
                "payment_status": order.payment_status
            }
            
        except Exception as e:
            logger.error(f"Error procesando webhook: {e}")
            return {"status": "error", "reason": str(e)}
    
    def get_payment_status(self, order_id: int, session: Session) -> Dict[str, Any]:
        """
        Obtiene el estado actual de pago de una orden
        """
        order = session.get(Order, order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Orden no encontrada")
        
        result = {
            "order_id": order.id,
            "payment_method": order.payment_method,
            "payment_status": order.payment_status,
            "mercadopago_payment_id": order.mercadopago_payment_id,
            "mercadopago_preference_id": order.mercadopago_preference_id,
            "total": order.total
        }
        
        # Si hay payment_id, obtener detalles adicionales de MercadoPago
        if self.sdk and order.mercadopago_payment_id:
            try:
                payment_response = self.sdk.payment().get(order.mercadopago_payment_id)
                if payment_response["status"] == 200:
                    payment_data = payment_response["response"]
                    result["mercadopago_details"] = {
                        "status": payment_data.get("status"),
                        "status_detail": payment_data.get("status_detail"),
                        "payment_method_id": payment_data.get("payment_method_id"),
                        "payment_type_id": payment_data.get("payment_type_id"),
                        "date_created": payment_data.get("date_created"),
                        "date_approved": payment_data.get("date_approved")
                    }
            except Exception as e:
                logger.warning(f"Error obteniendo detalles de MercadoPago: {e}")
        
        return result


# Instancia global del controlador
payments_controller = PaymentsController()
