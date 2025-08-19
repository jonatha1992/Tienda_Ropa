"""
Rutas administrativas para gestión de envíos y seguimiento.
Solo accesible para usuarios con rol admin.
"""

from typing import List, Optional
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlmodel import Session

from app.core.security import require_admin, get_current_db_user
from app.db.session import get_session
from app.models.user import User
from app.models.order import Order
from app.controllers.shipping_controller import shipping_controller
from app.core.shipping_providers import SHIPPING_PROVIDERS, get_provider_examples, suggest_tracking_format


router = APIRouter(prefix="/admin/shipping", tags=["Admin Shipping"])


# Esquemas de entrada
class ShippingUpdateRequest(BaseModel):
    """Esquema para actualizar información de envío"""
    tracking_number: str = Field(min_length=5, max_length=255, description="Número de seguimiento")
    shipping_provider: str = Field(pattern="^(correo-argentino|oca|andreani)$", description="Proveedor de envío")
    estimated_delivery: Optional[datetime] = Field(None, description="Fecha estimada de entrega")
    delivery_notes: Optional[str] = Field(None, max_length=500, description="Notas específicas del envío")


class MarkShippedRequest(BaseModel):
    """Esquema para marcar como enviado"""
    send_notification: bool = Field(True, description="Enviar notificación al cliente")


# Esquemas de salida
class OrderShippingInfo(BaseModel):
    """Información de envío de un pedido"""
    order_id: int
    customer_name: str
    customer_email: str
    customer_phone: Optional[str]
    total: float
    status: str
    created_at: datetime
    
    # Shipping info
    tracking_number: Optional[str]
    shipping_provider: Optional[str]
    provider_name: Optional[str]
    shipped_at: Optional[datetime]
    estimated_delivery: Optional[datetime]
    delivery_notes: Optional[str]
    shipped_by_admin: Optional[str]
    
    # Status flags
    can_add_tracking: bool
    can_mark_shipped: bool
    shipping_status: str


class ShippingStatistics(BaseModel):
    """Estadísticas de envío"""
    period_days: int
    total_orders: int
    shipped_orders: int
    pending_shipment: int
    shipping_rate_percent: float
    avg_processing_hours: float
    provider_usage: dict


@router.get("/orders/pending", response_model=List[OrderShippingInfo])
def get_pending_shipments(
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin())
):
    """
    Obtener pedidos pendientes de envío (aprobados sin tracking).
    Solo accesible para administradores.
    """
    try:
        orders = shipping_controller.get_orders_pending_shipment(session)
        
        result = []
        for order in orders:
            # Obtener información del cliente
            from app.models.customer import Customer
            customer = session.get(Customer, order.customer_id)
            
            order_info = OrderShippingInfo(
                order_id=order.id,
                customer_name=customer.name if customer else "Cliente desconocido",
                customer_email=customer.email if customer else "",
                customer_phone=customer.phone if customer else None,
                total=order.total,
                status=order.status,
                created_at=order.created_at or datetime.utcnow(),
                
                # Shipping info
                tracking_number=order.tracking_number,
                shipping_provider=order.shipping_provider,
                provider_name=None,  # Se calculará en frontend
                shipped_at=order.shipped_at,
                estimated_delivery=order.estimated_delivery,
                delivery_notes=order.delivery_notes_shipping,
                shipped_by_admin=None,
                
                # Status flags  
                can_add_tracking=shipping_controller.can_add_tracking(order),
                can_mark_shipped=shipping_controller.can_mark_shipped(order),
                shipping_status="pending_shipment"
            )
            
            result.append(order_info)
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving pending shipments: {str(e)}")


@router.get("/orders/shipped", response_model=List[OrderShippingInfo])
def get_shipped_orders(
    days: int = 30,
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin())
):
    """
    Obtener pedidos enviados en los últimos N días.
    """
    try:
        orders = shipping_controller.get_shipped_orders(session, days)
        
        result = []
        for order in orders:
            # Obtener información del cliente
            from app.models.customer import Customer
            customer = session.get(Customer, order.customer_id)
            
            # Obtener información del admin que envió
            shipped_by_admin = None
            if order.shipped_by:
                admin = session.get(User, order.shipped_by)
                shipped_by_admin = admin.nombre or admin.email if admin else None
            
            order_info = OrderShippingInfo(
                order_id=order.id,
                customer_name=customer.name if customer else "Cliente desconocido",
                customer_email=customer.email if customer else "",
                customer_phone=customer.phone if customer else None,
                total=order.total,
                status=order.status,
                created_at=order.created_at or datetime.utcnow(),
                
                # Shipping info
                tracking_number=order.tracking_number,
                shipping_provider=order.shipping_provider,
                provider_name=SHIPPING_PROVIDERS.get(order.shipping_provider, {}).get('name') if order.shipping_provider else None,
                shipped_at=order.shipped_at,
                estimated_delivery=order.estimated_delivery,
                delivery_notes=order.delivery_notes_shipping,
                shipped_by_admin=shipped_by_admin,
                
                # Status flags
                can_add_tracking=shipping_controller.can_add_tracking(order),
                can_mark_shipped=shipping_controller.can_mark_shipped(order),
                shipping_status="shipped"
            )
            
            result.append(order_info)
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving shipped orders: {str(e)}")


@router.put("/orders/{order_id}/shipping-info")
def update_shipping_info(
    order_id: int,
    shipping_data: ShippingUpdateRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin())
):
    """
    Actualizar información de envío de un pedido.
    """
    try:
        updated_order = shipping_controller.update_shipping_info(
            session=session,
            order_id=order_id,
            tracking_number=shipping_data.tracking_number,
            shipping_provider=shipping_data.shipping_provider,
            admin_user_id=current_user.id,
            estimated_delivery=shipping_data.estimated_delivery,
            delivery_notes=shipping_data.delivery_notes
        )
        
        return {
            "success": True,
            "message": f"Shipping info updated for order #{order_id}",
            "order_id": updated_order.id,
            "tracking_number": updated_order.tracking_number,
            "shipping_provider": updated_order.shipping_provider,
            "updated_at": updated_order.tracking_updated_at
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating shipping info: {str(e)}")


@router.post("/orders/{order_id}/mark-shipped")
def mark_order_shipped(
    order_id: int,
    request_data: MarkShippedRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin())
):
    """
    Marcar pedido como enviado.
    """
    try:
        shipped_order = shipping_controller.mark_as_shipped(
            session=session,
            order_id=order_id,
            admin_user_id=current_user.id
        )
        
        # TODO: Enviar notificación al cliente si request_data.send_notification es True
        
        return {
            "success": True,
            "message": f"Order #{order_id} marked as shipped",
            "order_id": shipped_order.id,
            "status": shipped_order.status,
            "shipped_at": shipped_order.shipped_at,
            "tracking_number": shipped_order.tracking_number,
            "notification_sent": request_data.send_notification  # TODO: implementar notificación
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error marking order as shipped: {str(e)}")


@router.get("/orders/{order_id}/tracking-info")
def get_order_tracking_info(
    order_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin())
):
    """
    Obtener información completa de tracking de un pedido.
    """
    try:
        tracking_info = shipping_controller.get_order_with_tracking_info(session, order_id)
        return tracking_info
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving tracking info: {str(e)}")


@router.get("/statistics", response_model=ShippingStatistics)
def get_shipping_statistics(
    days: int = 30,
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin())
):
    """
    Obtener estadísticas de envío para el dashboard admin.
    """
    try:
        stats = shipping_controller.get_shipping_statistics(session, days)
        return ShippingStatistics(**stats)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving shipping statistics: {str(e)}")


@router.get("/providers")
def get_shipping_providers(current_user: User = Depends(require_admin())):
    """
    Obtener información de proveedores de envío disponibles.
    """
    providers = []
    for code, info in SHIPPING_PROVIDERS.items():
        providers.append({
            "code": code,
            "name": info['name'],
            "tracking_url_template": info['tracking_url'],
            "color": info['color'],
            "icon": info['icon'],
            "example_tracking": get_provider_examples().get(code),
            "format_hint": suggest_tracking_format(code)
        })
    
    return {
        "providers": providers,
        "total_providers": len(providers)
    }


@router.get("/bulk-actions/ready")
def get_bulk_action_ready_orders(
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin())
):
    """
    Obtener pedidos listos para acciones en lote (con tracking pero sin marcar como enviados).
    """
    try:
        from sqlmodel import select
        
        orders = session.exec(
            select(Order)
            .where(Order.status == "approved")
            .where(Order.tracking_number.is_not(None))
            .where(Order.shipped_at.is_(None))
            .order_by(Order.tracking_updated_at.desc())
        ).all()
        
        result = []
        for order in orders:
            from app.models.customer import Customer
            customer = session.get(Customer, order.customer_id)
            
            result.append({
                "order_id": order.id,
                "customer_name": customer.name if customer else "Cliente desconocido",
                "tracking_number": order.tracking_number,
                "shipping_provider": order.shipping_provider,
                "provider_name": SHIPPING_PROVIDERS.get(order.shipping_provider, {}).get('name'),
                "tracking_updated_at": order.tracking_updated_at,
                "total": order.total
            })
        
        return {
            "orders": result,
            "count": len(result)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving bulk action ready orders: {str(e)}")


@router.post("/bulk-actions/mark-shipped")
def bulk_mark_shipped(
    order_ids: List[int],
    send_notifications: bool = True,
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin())
):
    """
    Marcar múltiples pedidos como enviados en una operación en lote.
    """
    try:
        results = []
        errors = []
        
        for order_id in order_ids:
            try:
                shipped_order = shipping_controller.mark_as_shipped(
                    session=session,
                    order_id=order_id,
                    admin_user_id=current_user.id
                )
                
                results.append({
                    "order_id": order_id,
                    "success": True,
                    "shipped_at": shipped_order.shipped_at
                })
                
                # TODO: Enviar notificación si send_notifications es True
                
            except Exception as e:
                errors.append({
                    "order_id": order_id,
                    "error": str(e)
                })
        
        return {
            "success": True,
            "processed": len(results),
            "errors": len(errors),
            "results": results,
            "error_details": errors if errors else None
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in bulk mark shipped: {str(e)}")