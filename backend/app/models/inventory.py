
from sqlalchemy import Column, Integer, ForeignKey, DateTime
import datetime
from app.models import Base


class Inventory(Base):
    __tablename__ = "inventory"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    last_update = Column(DateTime, default=datetime.datetime.utcnow)
