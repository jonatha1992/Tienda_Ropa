"""
Tests integrados para el módulo de inventario.
Incluye gestión de stock, alertas y sincronización con productos.
"""
import pytest
from fastapi.testclient import TestClient


class TestInventoryCRUD:
    """Tests para operaciones CRUD de inventario"""

    def test_create_inventory_record(self, client, auth_cookie):
        """Test crear registro de inventario"""
        # Crear producto primero
        product_data = {
            "name": "Producto Inventario",
            "price": 25.0,
            "images": ["inventory.jpg"],
            "variants": [{"color": "turquesa", "talle": "M", "stock": 10}]
        }
        product_response = client.post("/api/v1/products/", json=product_data, headers=auth_cookie)
        product_id = product_response.json()["id"]
        
        # Crear registro de inventario
        inventory_data = {
            "product_id": product_id,
            "quantity": 15,
            "last_update": "2025-08-07T10:00:00"
        }
        response = client.post("/api/v1/inventory/", json=inventory_data, headers=auth_cookie)
        assert response.status_code == 200
        
        inventory = response.json()
        assert inventory["product_id"] == product_id
        assert inventory["quantity"] == 15
        assert "id" in inventory
        assert "last_update" in inventory

    # def test_get_inventory_list(self, client, auth_cookie):
    #     """Test obtener lista de inventario"""
    #     response = client.get("/api/v1/inventory/", headers=auth_cookie)
    #     assert response.status_code == 200
    #     
    #     inventories = response.json()
    #     assert isinstance(inventories, list)

    def test_get_single_inventory_record(self, client, auth_cookie):
        """Test obtener un registro de inventario específico"""
        # Crear producto e inventario
        product_data = {
            "name": "Producto Get Inventory",
            "price": 30.0,
            "images": ["get_inv.jpg"],
            "variants": [{"color": "dorado", "talle": "L", "stock": 8}]
        }
        product_response = client.post("/api/v1/products/", json=product_data, headers=auth_cookie)
        product_id = product_response.json()["id"]
        
        inventory_data = {
            "product_id": product_id,
            "quantity": 12,
            "last_update": "2025-08-07T11:00:00"
        }
        inventory_response = client.post("/api/v1/inventory/", json=inventory_data, headers=auth_cookie)
        inventory_id = inventory_response.json()["id"]
        
        # Obtener registro específico
        response = client.get(f"/api/v1/inventory/{inventory_id}", headers=auth_cookie)
        assert response.status_code == 200
        
        inventory = response.json()
        assert inventory["id"] == inventory_id
        assert inventory["product_id"] == product_id

    # def test_update_inventory_quantity(self, client, auth_cookie):
    #     """Test actualizar cantidad en inventario"""
    #     # Crear producto e inventario
    #     product_data = {
    #         "name": "Producto Update Inventory",
    #         "price": 40.0,
    #         "images": ["update_inv.jpg"],
    #         "variants": [{"color": "plateado", "talle": "S", "stock": 5}]
    #     }
    #     product_response = client.post("/api/v1/products/", json=product_data, headers=auth_cookie)
    #     product_id = product_response.json()["id"]
    #     
    #     inventory_data = {
    #         "product_id": product_id,
    #         "quantity": 20,
    #         "last_update": "2025-08-07T09:00:00"
    #     }
    #     inventory_response = client.post("/api/v1/inventory/", json=inventory_data, headers=auth_cookie)
    #     inventory_id = inventory_response.json()["id"]
    #     
    #     # Actualizar cantidad
    #     update_data = {
    #         "product_id": product_id,
    #         "quantity": 25,
    #         "last_update": "2025-08-07T12:00:00"
    #     }
    #     response = client.put(f"/api/v1/inventory/{inventory_id}", json=update_data, headers=auth_cookie)
    #     assert response.status_code == 200
    #     
    #     updated_inventory = response.json()
    #     assert updated_inventory["quantity"] == 25

    # def test_delete_inventory_record(self, client, auth_cookie):
    #     """Test eliminar registro de inventario"""
    #     # Crear producto e inventario
    #     product_data = {
    #         "name": "Producto Delete Inventory",
    #         "price": 15.0,
    #         "images": ["delete_inv.jpg"],
    #         "variants": [{"color": "bronce", "talle": "XL", "stock": 3}]
    #     }
    #     product_response = client.post("/api/v1/products/", json=product_data, headers=auth_cookie)
    #     product_id = product_response.json()["id"]
    #     
    #     inventory_data = {
    #         "product_id": product_id,
    #         "quantity": 5,
    #         "last_update": "2025-08-07T08:00:00"
    #     }
    #     inventory_response = client.post("/api/v1/inventory/", json=inventory_data, headers=auth_cookie)
    #     inventory_id = inventory_response.json()["id"]
    #     
    #     # Eliminar registro
    #     response = client.delete(f"/api/v1/inventory/{inventory_id}", headers=auth_cookie)
    #     assert response.status_code == 200
    #     
    #     # Verificar que no existe
    #     get_response = client.get(f"/api/v1/inventory/{inventory_id}", headers=auth_cookie)
    #     assert get_response.status_code == 404


class TestInventoryProductRelationship:
    """Tests para relación entre inventario y productos"""

    def test_inventory_links_to_existing_product(self, client, auth_cookie):
        """Test que el inventario se vincule a productos existentes"""
        # Crear producto
        product_data = {
            "name": "Producto Vinculado",
            "price": 35.0,
            "images": ["linked.jpg"],
            "variants": [{"color": "coral", "talle": "M", "stock": 7}]
        }
        product_response = client.post("/api/v1/products/", json=product_data, headers=auth_cookie)
        product_id = product_response.json()["id"]
        
        # Crear inventario
        inventory_data = {
            "product_id": product_id,
            "quantity": 50,
            "last_update": "2025-08-07T13:00:00"
        }
        response = client.post("/api/v1/inventory/", json=inventory_data, headers=auth_cookie)
        assert response.status_code == 200
        
        inventory = response.json()
        assert inventory["product_id"] == product_id

    # def test_multiple_inventory_records_same_product(self, client, auth_cookie):
    #     """Test múltiples registros de inventario para el mismo producto (historial)"""
    #     # Crear producto
    #     product_data = {
    #         "name": "Producto Multi Inventory",
    #         "price": 50.0,
    #         "images": ["multi_inv.jpg"],
    #         "variants": [{"color": "magenta", "talle": "L", "stock": 12}]
    #     }
    #     product_response = client.post("/api/v1/products/", json=product_data, headers=auth_cookie)
    #     product_id = product_response.json()["id"]
    #     
    #     # Crear múltiples registros de inventario (simulando historial)
    #     inventory_records = [
    #         {
    #             "product_id": product_id,
    #             "quantity": 100,
    #             "last_update": "2025-08-01T10:00:00"
    #         },
    #         {
    #             "product_id": product_id,
    #             "quantity": 80,
    #             "last_update": "2025-08-03T10:00:00"
    #         },
    #         {
    #             "product_id": product_id,
    #             "quantity": 60,
    #             "last_update": "2025-08-05T10:00:00"
    #         }
    #     ]
    #     
    #     created_records = []
    #     for record in inventory_records:
    #         response = client.post("/api/v1/inventory/", json=record, headers=auth_cookie)
    #         assert response.status_code == 200
    #         created_records.append(response.json())
    #     
    #     # Verificar que todos pertenecen al mismo producto
    #     for record in created_records:
    #         assert record["product_id"] == product_id
    #     
    #     # Verificar cantidades diferentes
    #     quantities = [record["quantity"] for record in created_records]
    #     assert len(set(quantities)) == 3  # Todas diferentes

    def test_inventory_with_nonexistent_product_fails(self, client, auth_cookie):
        """Test que crear inventario con producto inexistente falle"""
        inventory_data = {
            "product_id": 99999,
            "quantity": 10,
            "last_update": "2025-08-07T14:00:00"
        }
        response = client.post("/api/v1/inventory/", json=inventory_data, headers=auth_cookie)
        assert response.status_code in [400, 422, 404]


class TestInventoryValidation:
    """Tests para validación de datos de inventario"""

    def test_inventory_quantity_validation(self, client, auth_cookie):
        """Test validación de cantidad en inventario"""
        # Crear producto válido
        product_data = {
            "name": "Producto Validation",
            "price": 20.0,
            "images": ["validation.jpg"],
            "variants": [{"color": "salmon", "talle": "M", "stock": 4}]
        }
        product_response = client.post("/api/v1/products/", json=product_data, headers=auth_cookie)
        product_id = product_response.json()["id"]
        
        invalid_quantities = [-1, -10, "invalid", None]
        
        for quantity in invalid_quantities:
            inventory_data = {
                "product_id": product_id,
                "quantity": quantity,
                "last_update": "2025-08-07T15:00:00"
            }
            response = client.post("/api/v1/inventory/", json=inventory_data, headers=auth_cookie)
            assert response.status_code == 422, f"Should fail validation with quantity: {quantity}"

    # def test_inventory_zero_quantity_allowed(self, client, auth_cookie):
    #     """Test que cantidad cero sea válida (producto agotado)"""
    #     # Crear producto
    #     product_data = {
    #         "name": "Producto Agotado",
    #         "price": 25.0,
    #         "images": ["agotado.jpg"],
    #         "variants": [{"color": "cobre", "talle": "S", "stock": 0}]
    #     }
    #     product_response = client.post("/api/v1/products/", json=product_data, headers=auth_cookie)
    #     product_id = product_response.json()["id"]
    #     
    #     # Cantidad cero debería ser válida
    #     inventory_data = {
    #         "product_id": product_id,
    #         "quantity": 0,
    #         "last_update": "2025-08-07T16:00:00"
    #     }
    #     response = client.post("/api/v1/inventory/", json=inventory_data, headers=auth_cookie)
    #     assert response.status_code == 200
    #     
    #     inventory = response.json()
    #     assert inventory["quantity"] == 0

    def test_inventory_date_format_validation(self, client, auth_cookie):
        """Test validación de formato de fecha"""
        # Crear producto
        product_data = {
            "name": "Producto Date Test",
            "price": 30.0,
            "images": ["date.jpg"],
            "variants": [{"color": "esmeralda", "talle": "M", "stock": 6}]
        }
        product_response = client.post("/api/v1/products/", json=product_data, headers=auth_cookie)
        product_id = product_response.json()["id"]
        
        invalid_dates = [
            "invalid-date",
            "2025-13-40",  # Mes y día inválidos
            "2025-08-32",  # Día inválido
            "25-08-07",    # Formato incorrecto
            ""             # Vacío
        ]
        
        for date in invalid_dates:
            inventory_data = {
                "product_id": product_id,
                "quantity": 10,
                "last_update": date
            }
            response = client.post("/api/v1/inventory/", json=inventory_data, headers=auth_cookie)
            assert response.status_code == 422, f"Should fail validation with date: {date}"

    # def test_inventory_missing_required_fields(self, client, auth_cookie):
    #     """Test crear inventario sin campos requeridos"""
    #     incomplete_data_sets = [
    #         {},  # Sin campos
    #         {"product_id": 1},  # Sin quantity y last_update
    #         {"quantity": 10},  # Sin product_id y last_update
    #         {"last_update": "2025-08-07T10:00:00"},  # Sin product_id y quantity
    #         {"product_id": 1, "quantity": 10},  # Sin last_update
    #     ]
    #     
    #     for data in incomplete_data_sets:
    #         response = client.post("/api/v1/inventory/", json=data, headers=auth_cookie)
    #         assert response.status_code == 422, f"Should fail validation with data: {data}"


class TestInventoryBusinessLogic:
    """Tests para lógica de negocio del inventario"""

    def test_inventory_stock_tracking(self, client, auth_cookie):
        """Test seguimiento de stock a través del tiempo"""
        # Crear producto
        product_data = {
            "name": "Producto Stock Tracking",
            "price": 45.0,
            "images": ["tracking.jpg"],
            "variants": [{"color": "lavanda", "talle": "L", "stock": 15}]
        }
        product_response = client.post("/api/v1/products/", json=product_data, headers=auth_cookie)
        product_id = product_response.json()["id"]
        
        # Simular movimientos de stock en el tiempo
        stock_movements = [
            {"quantity": 100, "last_update": "2025-08-01T10:00:00"},  # Stock inicial
            {"quantity": 95, "last_update": "2025-08-02T10:00:00"},   # Venta de 5
            {"quantity": 90, "last_update": "2025-08-03T10:00:00"},   # Venta de 5
            {"quantity": 110, "last_update": "2025-08-04T10:00:00"},  # Restock +20
            {"quantity": 105, "last_update": "2025-08-05T10:00:00"},  # Venta de 5
        ]
        
        created_records = []
        for movement in stock_movements:
            inventory_data = {
                "product_id": product_id,
                **movement
            }
            response = client.post("/api/v1/inventory/", json=inventory_data, headers=auth_cookie)
            assert response.status_code == 200
            created_records.append(response.json())
        
        # Verificar que se crearon todos los registros
        assert len(created_records) == 5
        
        # Verificar progression de cantidades
        quantities = [record["quantity"] for record in created_records]
        assert quantities == [100, 95, 90, 110, 105]

    # def test_inventory_low_stock_detection(self, client, auth_cookie):
    #     """Test detección de stock bajo"""
    #     # Crear producto con stock bajo
    #     product_data = {
    #         "name": "Producto Stock Bajo",
    #         "price": 35.0,
    #         "images": ["lowstock.jpg"],
    #         "variants": [{"color": "perla", "talle": "S", "stock": 2}]
    #     }
    #     product_response = client.post("/api/v1/products/", json=product_data, headers=auth_cookie)
    #     product_id = product_response.json()["id"]
    #     
    #     # Crear registro con stock bajo
    #     inventory_data = {
    #         "product_id": product_id,
    #         "quantity": 3,  # Stock bajo
    #         "last_update": "2025-08-07T17:00:00"
    #     }
    #     response = client.post("/api/v1/inventory/", json=inventory_data, headers=auth_cookie)
    #     assert response.status_code == 200
    #     
    #     inventory = response.json()
    #     assert inventory["quantity"] <= 5  # Consideramos 5 o menos como stock bajo

    # def test_inventory_restock_workflow(self, client, auth_cookie):
    #     """Test flujo de restock"""
    #     # Crear producto
    #     product_data = {
    #         "name": "Producto Restock",
    #         "price": 60.0,
    #         "images": ["restock.jpg"],
    #         "variants": [{"color": "jade", "talle": "M", "stock": 1}]
    #     }
    #     product_response = client.post("/api/v1/products/", json=product_data, headers=auth_cookie)
    #     product_id = product_response.json()["id"]
    #     
    #     # Stock inicial bajo
    #     initial_inventory = {
    #         "product_id": product_id,
    #         "quantity": 2,
    #         "last_update": "2025-08-07T08:00:00"
    #     }
    #     initial_response = client.post("/api/v1/inventory/", json=initial_inventory, headers=auth_cookie)
    #     assert initial_response.status_code == 200
    #     
    #     # Restock - agregar más unidades
    #     restock_inventory = {
    #         "product_id": product_id,
    #         "quantity": 52,  # +50 unidades
    #         "last_update": "2025-08-07T18:00:00"
    #     }
    #     restock_response = client.post("/api/v1/inventory/", json=restock_inventory, headers=auth_cookie)
    #     assert restock_response.status_code == 200
    #     
    #     restock_record = restock_response.json()
    #     assert restock_record["quantity"] == 52


class TestInventoryErrorHandling:
    """Tests para manejo de errores en inventario"""

    def test_get_nonexistent_inventory_record(self, client, auth_cookie):
        """Test obtener registro de inventario inexistente"""
        response = client.get("/api/v1/inventory/99999", headers=auth_cookie)
        assert response.status_code == 404

    def test_update_nonexistent_inventory_record(self, client, auth_cookie):
        """Test actualizar registro de inventario inexistente"""
        update_data = {
            "product_id": 1,
            "quantity": 10,
            "last_update": "2025-08-07T19:00:00"
        }
        response = client.put("/api/v1/inventory/99999", json=update_data, headers=auth_cookie)
        assert response.status_code == 404

    def test_delete_nonexistent_inventory_record(self, client, auth_cookie):
        """Test eliminar registro de inventario inexistente"""
        response = client.delete("/api/v1/inventory/99999", headers=auth_cookie)
        assert response.status_code == 404

    def test_inventory_requires_authentication(self, client):
        """Test que los endpoints de inventario requieran autenticación"""
        endpoints = [
            ("GET", "/api/v1/inventory/"),
            ("POST", "/api/v1/inventory/"),
            ("GET", "/api/v1/inventory/1"),
            ("PUT", "/api/v1/inventory/1"),
            ("DELETE", "/api/v1/inventory/1")
        ]
        
        for method, endpoint in endpoints:
            if method == "GET":
                response = client.get(endpoint)
            elif method == "POST":
                response = client.post(endpoint, json={})
            elif method == "PUT":
                response = client.put(endpoint, json={})
            elif method == "DELETE":
                response = client.delete(endpoint)
            
            assert response.status_code in [401, 403], f"{method} {endpoint} should require auth"


class TestInventoryIntegration:
    """Tests de integración para inventario con otros módulos"""

    def test_inventory_product_integration(self, client, auth_cookie):
        """Test integración entre inventario y productos"""
        # Crear producto
        product_data = {
            "name": "Producto Integration",
            "price": 55.0,
            "images": ["integration.jpg"],
            "variants": [{"color": "ámbar", "talle": "L", "stock": 8}]
        }
        product_response = client.post("/api/v1/products/", json=product_data, headers=auth_cookie)
        product_id = product_response.json()["id"]
        
        # Crear inventario
        inventory_data = {
            "product_id": product_id,
            "quantity": 25,
            "last_update": "2025-08-07T20:00:00"
        }
        inventory_response = client.post("/api/v1/inventory/", json=inventory_data, headers=auth_cookie)
        inventory_id = inventory_response.json()["id"]
        
        # Verificar que el producto existe
        product_check = client.get(f"/api/v1/products/{product_id}", headers=auth_cookie)
        assert product_check.status_code == 200
        
        # Verificar que el inventario existe
        inventory_check = client.get(f"/api/v1/inventory/{inventory_id}", headers=auth_cookie)
        assert inventory_check.status_code == 200
        
        # Verificar relación
        inventory_record = inventory_check.json()
        assert inventory_record["product_id"] == product_id
