
def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_create_and_get_product(client, auth_cookie):
    data = {
        "name": "pantalon",
        "price": 1.0,
        "color": "azul",
        "talle": "M",
        "genero": "masculino",
        "estado": "nuevo",
        "edad_destino": "adulto"
    }
    response = client.post("/api/v1/products/", json=data, cookies=auth_cookie)
    if response.status_code != 200:
        print("Error detail:", response.json())
    assert response.status_code == 200
    product = response.json()
    assert product["name"] == "pantalon"

    response = client.get("/api/v1/products/", cookies=auth_cookie)
    assert response.status_code == 200
    products = response.json()
    assert any(p["name"] == "pantalon" for p in products)

def test_create_and_get_customer(client, auth_cookie):
    data = {
        "name": "cliente1",
        "email": "cliente1@example.com"
    }
    response = client.post("/api/v1/customers/", json=data, cookies=auth_cookie)
    assert response.status_code == 200
    customer = response.json()
    assert customer["name"] == "cliente1"

    response = client.get("/api/v1/customers/", cookies=auth_cookie)
    assert response.status_code == 200
    customers = response.json()
    assert any(c["name"] == "cliente1" for c in customers)

def test_create_and_get_order(client, auth_cookie):
    # Primero crea un cliente y producto
    customer_data = {
        "name": "cliente2",
        "email": "cliente2@example.com"
    }
    product_data = {
        "name": "camisa",
        "price": 10.0
    }
    customer_resp = client.post("/api/v1/customers/", json=customer_data, cookies=auth_cookie)
    product_resp = client.post("/api/v1/products/", json=product_data, cookies=auth_cookie)
    customer_id = customer_resp.json()["id"]
    product_id = product_resp.json()["id"]

    order_data = {
        "customer_id": customer_id,
        "status": "pending",
        "total": 10.0
    }
    response = client.post("/api/v1/orders/", json=order_data, cookies=auth_cookie)
    assert response.status_code == 200
    order = response.json()
    assert order["customer_id"] == customer_id

    response = client.get("/api/v1/orders/", cookies=auth_cookie)
    assert response.status_code == 200
    orders = response.json()
    assert any(o["customer_id"] == customer_id for o in orders)

def test_create_and_get_inventory(client, auth_cookie):
    # Crea un producto primero
    product_data = {
        "name": "zapato",
        "description": "cuero",
        "price": 20.0,
        "stock": 10,
        "image_url": "img2.jpg"
    }
    product_resp = client.post("/api/v1/products/", json=product_data, cookies=auth_cookie)
    product_id = product_resp.json()["id"]

    inventory_data = {
        "product_id": product_id,
        "quantity": 10,
        "last_update": "2025-07-30T00:00:00"
    }
    response = client.post("/api/v1/inventory/", json=inventory_data, cookies=auth_cookie)
    assert response.status_code == 200
    inventory = response.json()
    assert inventory["product_id"] == product_id

    response = client.get("/api/v1/inventory/", cookies=auth_cookie)
    assert response.status_code == 200
    inventories = response.json()
    assert any(i["product_id"] == product_id for i in inventories)

def test_create_and_get_order_item(client, auth_cookie):
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
    customer_resp = client.post("/api/v1/customers/", json=customer_data, cookies=auth_cookie)
    product_resp = client.post("/api/v1/products/", json=product_data, cookies=auth_cookie)
    customer_id = customer_resp.json()["id"]
    product_id = product_resp.json()["id"]

    order_data = {
        "customer_id": customer_id,
        "status": "pending",
        "total": 5.0,
        "created_at": "2025-07-30T00:00:00"
    }
    order_resp = client.post("/api/v1/orders/", json=order_data, cookies=auth_cookie)
    order_id = order_resp.json()["id"]

    order_item_data = {
        "order_id": order_id,
        "product_id": product_id,
        "quantity": 1,
        "price": 5.0
    }
    response = client.post("/api/v1/order-items/", json=order_item_data, cookies=auth_cookie)
    assert response.status_code == 200
    order_item = response.json()
    assert order_item["order_id"] == order_id

    response = client.get("/api/v1/order-items/", cookies=auth_cookie)
    assert response.status_code == 200
    order_items = response.json()
    assert any(oi["order_id"] == order_id for oi in order_items)
