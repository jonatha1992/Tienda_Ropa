from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product
import mercadopago

router = APIRouter()

@router.post("/webhook")
async def mercadopago_webhook(request: Request, db: Session = Depends(get_db)):
    body = await request.json()
    notification_type = body.get("type")
    notification_id = body.get("data", {}).get("id")

    if notification_type == "payment":
        sdk = mercadopago.SDK("YOUR_MERCADOPAGO_ACCESS_TOKEN")
        payment_info = sdk.payment().get(notification_id)

        if payment_info["status"] == 200:
            payment = payment_info["response"]
            if payment["status"] == "approved":
                order_id = payment["external_reference"]
                order = db.query(Order).filter(Order.id == order_id).first()
                if order:
                    order.status = "paid"
                    
                    order_items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
                    for item in order_items:
                        product = db.query(Product).filter(Product.id == item.product_id).first()
                        if product:
                            product.stock -= item.quantity
                    
                    db.commit()
    
    return {"status": "ok"}
