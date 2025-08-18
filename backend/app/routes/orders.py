from typing import List, Optional
import asyncio
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from fastapi import Body
from app.core.security import get_current_user
from sqlmodel import Session, select

from app.db.session import get_session
from app.models.order import Order
from app.models.customer import Customer
from app.models.order_item import OrderItem
from app.models.product import Product
from app.controllers.payments_controller import payments_controller
from app.controllers.transfer_controller import transfer_controller
from app.controllers.cash_controller import cash_controller
from app.core.mailer import send_email, render_template
from app.core.config import settings

router = APIRouter()


async def send_order_confirmation_email(order: Order, customer: Customer, session: Session):
    """Send order confirmation email asynchronously"""
    try:
        # Get order items with product details
        order_items = session.exec(
            select(OrderItem, Product)
            .where(OrderItem.order_id == order.id)
            .join(Product, OrderItem.product_id == Product.id)
        ).all()
        
        # Format order items for email
        items_for_email = []
        subtotal = 0
        for order_item, product in order_items:
            item_total = order_item.price * order_item.quantity
            subtotal += item_total
            items_for_email.append({
                'product_name': product.name,
                'quantity': order_item.quantity,
                'price': order_item.price,
                'total': item_total,
                'product_image': None,  # Add product image logic if needed
                'variant_info': None   # Add variant info if needed
            })
        
        # Get payment method text
        payment_methods = {
            'transfer': 'Transferencia Bancaria',
            'mercadopago': 'MercadoPago',
            'cash': 'Efectivo Contra Entrega'
        }
        payment_method_text = payment_methods.get(order.payment_method, order.payment_method)
        
        # Payment instructions based on method
        payment_instructions = None
        if order.payment_method == 'transfer':
            payment_instructions = 'Realiza la transferencia e incluye como referencia: ORD-' + str(order.id)
        elif order.payment_method == 'cash':
            payment_instructions = 'Ten el monto exacto disponible al momento de la entrega'
        
        # Render email template
        html_content = render_template(
            'email_order_confirmation.html',
            app_name=settings.APP_NAME,
            app_url=settings.APP_URL,
            order_number=str(order.id),
            order_date=order.created_at.strftime('%d/%m/%Y %H:%M') if order.created_at else datetime.now().strftime('%d/%m/%Y %H:%M'),
            customer_name=customer.name,
            order_items=items_for_email,
            subtotal=subtotal,
            discount=0.0,  # Add discount logic if needed
            shipping_cost=0.0,  # Add shipping cost if needed
            total=order.total,
            shipping_address=customer.address,
            shipping_city=customer.city,
            shipping_postal_code=customer.postal_code,
            delivery_notes=customer.delivery_notes,
            payment_method_text=payment_method_text,
            payment_instructions=payment_instructions
        )
        
        # Send email
        success = send_email(
            to=customer.email,
            subject=f'Confirmación de pedido #{order.id} - {settings.APP_NAME}',
            html_content=html_content
        )
        
        if success:
            print(f"✅ Email de confirmación enviado para pedido #{order.id} a {customer.email}")
        else:
            print(f"❌ Error enviando email de confirmación para pedido #{order.id}")
            
    except Exception as e:
        print(f"❌ Error procesando email de confirmación: {str(e)}")


@router.post("/orders/")
def create_order(session: Session = Depends(get_session), order: Order = Body(...), user=Depends(get_current_user)):
    # Verificar que el customer existe
    customer = session.get(Customer, order.customer_id)
    if not customer:
        raise HTTPException(status_code=422, detail="Customer not found")
    
    # Crear la orden con estado inicial según método de pago
    db_order = Order.model_validate(order)
    
    # Establecer estado inicial según método de pago
    if db_order.payment_method == "mercadopago":
        db_order.payment_status = "pending_payment"
    else:
        db_order.payment_status = "pending"
    
    session.add(db_order)
    session.commit()
    session.refresh(db_order)
    
    # Manejar según método de pago
    response = {"order": db_order}
    
    try:
        if db_order.payment_method == "mercadopago":
            # MercadoPago: Crear preferencia automáticamente
            preference_data = payments_controller.create_preference(db_order.id, session)
            response["payment_preference"] = preference_data
            
        elif db_order.payment_method == "transfer":
            # Transferencia: Configurar y obtener datos bancarios
            transfer_data = transfer_controller.create_transfer_order(db_order.id, session)
            response["transfer_info"] = transfer_data
            
        elif db_order.payment_method == "cash":
            # Efectivo: Calcular entrega y costos
            cash_data = cash_controller.create_cash_order(db_order.id, session)
            response["delivery_info"] = cash_data
            
    except Exception as e:
        # Si falla la configuración específica, mantener la orden pero informar el error
        response["payment_error"] = str(e)
    
    # Send order confirmation email asynchronously
    try:
        # Run email sending in background
        import threading
        email_thread = threading.Thread(
            target=lambda: asyncio.run(send_order_confirmation_email(db_order, customer, session))
        )
        email_thread.start()
    except Exception as e:
        print(f"❌ Error iniciando envío de email: {str(e)}")
        # Don't fail the order creation if email fails
    
    return response


@router.get("/orders/", response_model=List[Order])
def read_orders(
    *, session: Session = Depends(get_session), skip: int = 0, limit: int = 100, user=Depends(get_current_user)
):
    orders = session.exec(select(Order).offset(skip).limit(limit)).all()
    return orders


@router.get("/orders/customer/{customer_id}", response_model=List[Order])
def read_customer_orders(
    customer_id: int, 
    session: Session = Depends(get_session), 
    skip: int = 0, 
    limit: int = 100, 
    user=Depends(get_current_user)
):
    """Obtener todos los pedidos de un cliente específico"""
    orders = session.exec(
        select(Order)
        .where(Order.customer_id == customer_id)
        .order_by(Order.created_at.desc())
        .offset(skip)
        .limit(limit)
    ).all()
    return orders


@router.get("/orders/my-orders", response_model=List[Order])
def read_my_orders(
    session: Session = Depends(get_session), 
    skip: int = 0, 
    limit: int = 100, 
    firebase_user: dict = Depends(get_current_user)
):
    """Obtener todos los pedidos del usuario autenticado"""
    # Buscar customers que coincidan con el email del usuario autenticado
    user_email = firebase_user.get('email')
    if not user_email:
        return []
    
    # Encontrar todos los customers con este email
    customers = session.exec(
        select(Customer).where(Customer.email == user_email)
    ).all()
    
    if not customers:
        return []
    
    # Obtener pedidos de todos los customers con este email
    customer_ids = [customer.id for customer in customers]
    orders = session.exec(
        select(Order)
        .where(Order.customer_id.in_(customer_ids))
        .order_by(Order.created_at.desc())
        .offset(skip)
        .limit(limit)
    ).all()
    
    return orders


@router.get("/orders/{order_id}", response_model=Order)
def read_order(*, session: Session = Depends(get_session), order_id: int, user=Depends(get_current_user)):
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.put("/orders/{order_id}", response_model=Order)
def update_order(
    order_id: int, session: Session = Depends(get_session), order: Order = Body(...), user=Depends(get_current_user)
):
    db_order = session.get(Order, order_id)
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    order_data = order.model_dump(exclude_unset=True)
    for key, value in order_data.items():
        setattr(db_order, key, value)
    session.add(db_order)
    session.commit()
    session.refresh(db_order)
    return db_order


@router.delete("/orders/{order_id}")
def delete_order(*, session: Session = Depends(get_session), order_id: int, user=Depends(get_current_user)):
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    session.delete(order)
    session.commit()
    return {"ok": True}
