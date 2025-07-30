import sys
import pytest
from fastapi.testclient import TestClient
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app.main import app

client = TestClient(app)


def test_health():
    response = client.get("/healasth")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_create_and_get_product():
    data = {
        "name": "pantalon",
        "description": "string",
        "price": 1.0,
        "stock": 1,
        "image_url": "string"
    }
    response = client.post("/api/v1/products/", json=data)
    assert response.status_code == 200
    product = response.json()
    assert product["name"] == "pantalon"

    response = client.get("/api/v1/products/")
    assert response.status_code == 200
    products = response.json()
    assert any(p["name"] == "pantalon" for p in products)

def test_create_and_get_customer():
    data = {
        "name": "cliente1",
        "email": "cliente1@example.com",
        "phone": "123456789",
        "address": "calle 1"
    }
    response = client.post("/api/v1/customers/", json=data)
    assert response.status_code == 200
    customer = response.json()
    assert customer["name"] == "cliente1"

    response = client.get("/api/v1/customers/")
    assert response.status_code == 200
    customers = response.json()
    assert any(c["name"] == "cliente1" for c in customers)

def test_create_and_get_order():
    # Primero crea un cliente y producto
    customer_data = {
        "name": "cliente2",
        "email": "cliente2@example.com",
        "phone": "987654321",
        "address": "calle 2"
    }
    product_data = {
        "name": "camisa",
        "description": "algodon",
        "price": 10.0,
        "stock": 5,
        "image_url": "img.jpg"
    }
    customer_resp = client.post("/api/v1/customers/", json=customer_data)
    product_resp = client.post("/api/v1/products/", json=product_data)
    customer_id = customer_resp.json()["id"]
    product_id = product_resp.json()["id"]

    order_data = {
        "customer_id": customer_id,
        "status": "pending",
        "total": 10.0,
        "created_at": "2025-07-30T00:00:00"
    }
    response = client.post("/api/v1/orders/", json=order_data)
    assert response.status_code == 200
    order = response.json()
    assert order["customer_id"] == customer_id

    response = client.get("/api/v1/orders/")
    assert response.status_code == 200
    orders = response.json()
    assert any(o["customer_id"] == customer_id for o in orders)

def test_create_and_get_inventory():
    # Crea un producto primero
    product_data = {
        "name": "zapato",
        "description": "cuero",
        "price": 20.0,
        "stock": 10,
        "image_url": "img2.jpg"
    }
    product_resp = client.post("/api/v1/products/", json=product_data)
    product_id = product_resp.json()["id"]

    inventory_data = {
        "product_id": product_id,
        "quantity": 10,
        "last_update": "2025-07-30T00:00:00"
    }
    response = client.post("/api/v1/inventory/", json=inventory_data)
    assert response.status_code == 200
    inventory = response.json()
    assert inventory["product_id"] == product_id

    response = client.get("/api/v1/inventory/")
    assert response.status_code == 200
    inventories = response.json()
    assert any(i["product_id"] == product_id for i in inventories)

def test_create_and_get_order_item():
    # Crea orden y producto primero
    customer_data = {
        "name": "cliente3",
        "email": "cliente3@example.com",
        "phone": "555555555",
        "address": "calle 3"
    }
    product_data = {
        "name": "gorra",
        "description": "poliester",
        "price": 5.0,
        "stock": 3,
        "image_url": "img3.jpg"
    }
    customer_resp = client.post("/api/v1/customers/", json=customer_data)
    product_resp = client.post("/api/v1/products/", json=product_data)
    customer_id = customer_resp.json()["id"]
    product_id = product_resp.json()["id"]

    order_data = {
        "customer_id": customer_id,
        "status": "pending",
        "total": 5.0,
        "created_at": "2025-07-30T00:00:00"
    }
    order_resp = client.post("/api/v1/orders/", json=order_data)
    order_id = order_resp.json()["id"]

    order_item_data = {
        "order_id": order_id,
        "product_id": product_id,
        "quantity": 1,
        "price": 5.0
    }
    response = client.post("/api/v1/order-items/", json=order_item_data)
    assert response.status_code == 200
    order_item = response.json()
    assert order_item["order_id"] == order_id

    response = client.get("/api/v1/order-items/")
    assert response.status_code == 200
    order_items = response.json()
    assert any(oi["order_id"] == order_id for oi in order_items)
