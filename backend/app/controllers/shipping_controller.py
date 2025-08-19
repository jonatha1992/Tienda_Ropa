"""
Controlador para gestión de envíos y seguimiento de pedidos.
"""

from typing import List, Optional
from datetime import datetime

from sqlmodel import Session, select
from fastapi import HTTPException

from app.models.order import Order
from app.models.customer import Customer
from app.models.user import User
from app.core.shipping_providers import (
    validate_tracking_number, 
    get_tracking_url,
    get_provider_name,
    get_shipping_status,
    clean_tracking_number
)


class ShippingController:
    """Controlador para operaciones de envío"""
    
    @staticmethod
    def get_orders_pending_shipment(session: Session) -> List[Order]:
        """
        Obtener pedidos listos para envío.
        
        Args:
            session: Sesión de base de datos
            
        Returns:
            List[Order]: Pedidos aprobados sin tracking number
        """
        return session.exec(
            select(Order)
            .where(Order.status == "approved")
            .where(Order.tracking_number.is_(None))
            .order_by(Order.created_at.asc())
        ).all()
    
    @staticmethod
    def get_shipped_orders(session: Session, days: int = 30) -> List[Order]:
        """
        Obtener pedidos enviados en los últimos N días.
        
        Args:
            session: Sesión de base de datos  
            days: Número de días hacia atrás
            
        Returns:
            List[Order]: Pedidos enviados recientemente
        """
        from datetime import timedelta
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        
        return session.exec(
            select(Order)
            .where(Order.status.in_(["shipped", "delivered"]))
            .where(Order.shipped_at >= cutoff_date)
            .order_by(Order.shipped_at.desc())
        ).all()
    
    @staticmethod
    def update_shipping_info(
        session: Session, 
        order_id: int, 
        tracking_number: str,
        shipping_provider: str,
        admin_user_id: int,
        estimated_delivery: Optional[datetime] = None,
        delivery_notes: Optional[str] = None
    ) -> Order:
        """
        Actualizar información de envío de un pedido.
        
        Args:
            session: Sesión de base de datos
            order_id: ID del pedido
            tracking_number: Número de seguimiento
            shipping_provider: Proveedor de envío
            admin_user_id: ID del admin que hace la actualización
            estimated_delivery: Fecha estimada de entrega (opcional)
            delivery_notes: Notas del envío (opcional)
            
        Returns:
            Order: Pedido actualizado
            
        Raises:
            HTTPException: Si el pedido no existe o no se puede actualizar
        """
        # Obtener pedido
        order = session.get(Order, order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        # Verificar que el pedido esté aprobado
        if order.status != "approved":
            raise HTTPException(
                status_code=400, 
                detail="Only approved orders can have shipping info updated"
            )
        
        # Limpiar y validar número de tracking
        clean_tracking = clean_tracking_number(tracking_number)
        if not validate_tracking_number(clean_tracking, shipping_provider):
            raise HTTPException(
                status_code=400,
                detail=f"Invalid tracking number format for {shipping_provider}. "
                       f"Expected format: {ShippingController._get_format_hint(shipping_provider)}"
            )
        
        # Actualizar campos de envío
        order.tracking_number = clean_tracking
        order.shipping_provider = shipping_provider
        order.estimated_delivery = estimated_delivery
        order.delivery_notes_shipping = delivery_notes
        order.shipped_by = admin_user_id
        order.tracking_updated_at = datetime.utcnow()
        
        # Guardar cambios
        session.add(order)
        session.commit()
        session.refresh(order)
        
        return order
    
    @staticmethod
    def mark_as_shipped(
        session: Session, 
        order_id: int, 
        admin_user_id: int
    ) -> Order:
        """
        Marcar pedido como enviado.
        
        Args:
            session: Sesión de base de datos
            order_id: ID del pedido
            admin_user_id: ID del admin que marca como enviado
            
        Returns:
            Order: Pedido marcado como enviado
            
        Raises:
            HTTPException: Si el pedido no se puede marcar como enviado
        """
        order = session.get(Order, order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        # Verificar que tenga tracking number
        if not order.tracking_number:
            raise HTTPException(
                status_code=400,
                detail="Cannot ship order without tracking number"
            )
        
        # Verificar que esté aprobado
        if order.status != "approved":
            raise HTTPException(
                status_code=400,
                detail="Only approved orders can be shipped"
            )
        
        # Actualizar estado y fecha de envío
        order.status = "shipped"
        order.shipped_at = datetime.utcnow()
        order.shipped_by = admin_user_id
        
        session.add(order)
        session.commit()
        session.refresh(order)
        
        # Aquí se podría enviar notificación al cliente
        # ShippingController._send_shipping_notification(order, session)
        
        return order
    
    @staticmethod
    def get_order_with_tracking_info(session: Session, order_id: int) -> dict:
        """
        Obtener pedido con información de tracking procesada.
        
        Args:
            session: Sesión de base de datos
            order_id: ID del pedido
            
        Returns:
            dict: Información del pedido con datos de tracking
        """
        order = session.get(Order, order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        # Información básica del tracking
        tracking_info = {
            'order': order,
            'has_tracking': bool(order.tracking_number),
            'tracking_number': order.tracking_number,
            'shipping_provider': order.shipping_provider,
            'provider_name': get_provider_name(order.shipping_provider) if order.shipping_provider else None,
            'tracking_url': get_tracking_url(order.tracking_number, order.shipping_provider) if order.tracking_number and order.shipping_provider else None,
            'shipped_at': order.shipped_at,
            'estimated_delivery': order.estimated_delivery,
            'shipping_status': get_shipping_status(order.status, order.tracking_number, order.shipped_at),
            'delivery_notes': order.delivery_notes_shipping
        }
        
        # Información del admin que gestionó el envío
        if order.shipped_by:
            admin = session.get(User, order.shipped_by)
            tracking_info['shipped_by_admin'] = admin.nombre or admin.email if admin else None
        
        return tracking_info
    
    @staticmethod
    def get_shipping_statistics(session: Session, days: int = 30) -> dict:
        """
        Obtener estadísticas de envíos.
        
        Args:
            session: Sesión de base de datos
            days: Días hacia atrás para calcular estadísticas
            
        Returns:
            dict: Estadísticas de envío
        """
        from datetime import timedelta
        from sqlalchemy import func
        
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        
        # Total de pedidos en el período
        total_orders = session.scalar(
            select(func.count(Order.id))
            .where(Order.created_at >= cutoff_date)
        ) or 0
        
        # Pedidos enviados
        shipped_orders = session.scalar(
            select(func.count(Order.id))
            .where(Order.shipped_at >= cutoff_date)
        ) or 0
        
        # Pedidos pendientes de envío
        pending_shipment = session.scalar(
            select(func.count(Order.id))
            .where(Order.status == "approved")
            .where(Order.tracking_number.is_(None))
        ) or 0
        
        # Tiempo promedio de procesamiento (en horas)
        avg_processing_seconds = session.scalar(
            select(func.avg(func.extract('epoch', Order.shipped_at - Order.created_at)))
            .where(Order.shipped_at >= cutoff_date)
            .where(Order.shipped_at.is_not(None))
        ) or 0
        
        avg_processing_hours = round(avg_processing_seconds / 3600, 1) if avg_processing_seconds > 0 else 0
        
        # Uso de proveedores
        provider_usage = session.exec(
            select(Order.shipping_provider, func.count(Order.id))
            .where(Order.shipped_at >= cutoff_date)
            .where(Order.shipping_provider.is_not(None))
            .group_by(Order.shipping_provider)
        ).all()
        
        return {
            'period_days': days,
            'total_orders': total_orders,
            'shipped_orders': shipped_orders,
            'pending_shipment': pending_shipment,
            'shipping_rate_percent': round((shipped_orders / total_orders * 100), 1) if total_orders > 0 else 0,
            'avg_processing_hours': avg_processing_hours,
            'provider_usage': dict(provider_usage) if provider_usage else {}
        }
    
    @staticmethod
    def _get_format_hint(provider: str) -> str:
        """Obtener hint de formato para el proveedor"""
        hints = {
            'correo-argentino': '2 letras + 9 números + 2 letras (ej: CP123456789AR)',
            'oca': '10-13 números (ej: 1234567890123)',
            'andreani': '8-15 caracteres alfanuméricos (ej: ABC12345678)'
        }
        return hints.get(provider, 'formato específico del proveedor')
    
    @staticmethod
    def can_add_tracking(order: Order) -> bool:
        """
        Verificar si se puede agregar tracking a un pedido.
        
        Args:
            order: Pedido a verificar
            
        Returns:
            bool: True si se puede agregar tracking
        """
        return (
            order.status == "approved" and 
            not order.tracking_number
        )
    
    @staticmethod
    def can_mark_shipped(order: Order) -> bool:
        """
        Verificar si se puede marcar pedido como enviado.
        
        Args:
            order: Pedido a verificar
            
        Returns:
            bool: True si se puede marcar como enviado
        """
        return (
            order.status == "approved" and 
            order.tracking_number is not None and
            not order.shipped_at
        )


# Instancia global del controlador
shipping_controller = ShippingController()