import sys
import pytest
from fastapi.testclient import TestClient
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_products():
    response = client.get("/api/v1/products")
    assert response.status_code == 200

def test_customers():
    response = client.get("/api/v1/customers")
    assert response.status_code == 200

def test_orders():
    response = client.get("/api/v1/orders")
    assert response.status_code == 200

def test_inventory():
    response = client.get("/api/v1/inventory")
    assert response.status_code == 200

def test_order_items():
    response = client.get("/api/v1/order_items")
    assert response.status_code == 200
