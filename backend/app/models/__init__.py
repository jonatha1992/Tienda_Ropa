# Importar todos los modelos para que SQLModel los registre
from .user import User
from .role import Role
from .user_role import UserRole
from .product import Product, ProductImage, ProductVariant
from .customer import Customer
from .order import Order
from .order_item import OrderItem
from .inventory import Inventory