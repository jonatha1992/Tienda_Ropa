"""
Tests integrados para el módulo de productos.
Incluye productos, variantes, imágenes y gestión completa del catálogo.
"""
import pytest
from fastapi.testclient import TestClient


class TestProductsCRUD:
    """Tests para operaciones CRUD de productos"""

    def test_create_product_minimal(self, client, auth_cookie):
        """Test crear producto con datos mínimos"""
        data = {
            "name": "Producto Test Minimal",
            "price": 25.0,
            "images": ["image_test.jpg"],
            "variants": [{"color": "azul", "talle": "M", "stock": 5}]
        }
        response = client.post("/api/v1/products/", json=data, headers=auth_cookie)
        
        if response.status_code != 200:
            print("Error detail:", response.json())
        assert response.status_code == 200
        
        product = response.json()
        assert product["name"] == "Producto Test Minimal"
        assert product["price"] == 25.0
        assert "id" in product
        assert "images" in product
        assert "variants" in product

    def test_create_product_complete(self, client, auth_cookie):
        """Test crear producto con todos los campos"""
        data = {
            "name": "Producto Test Complete",
            "description": "Descripción detallada del producto",
            "price": 45.0,
            "genero": "femenino",
            "estado": "nuevo", 
            "edad_destino": "adulto",
            "images": ["image1.jpg", "image2.jpg"],
            "variants": [
                {"color": "rojo", "talle": "S", "stock": 3},
                {"color": "azul", "talle": "M", "stock": 7}
            ]
        }
        response = client.post("/api/v1/products/", json=data, headers=auth_cookie)
        
        assert response.status_code == 200
        product = response.json()
        assert product["name"] == "Producto Test Complete"
        assert product["description"] == "Descripción detallada del producto"
        assert product["genero"] == "femenino"
        assert product["estado"] == "nuevo"
        assert product["edad_destino"] == "adulto"
        assert len(product["variants"]) == 2

    def test_get_products_list(self, client, auth_cookie):
        """Test obtener lista de productos"""
        response = client.get("/api/v1/products/", headers=auth_cookie)
        assert response.status_code == 200
        
        products = response.json()
        assert isinstance(products, list)
        
        if len(products) > 0:
            product = products[0]
            required_fields = ["id", "name", "price", "images", "variants"]
            for field in required_fields:
                assert field in product, f"Field {field} missing in product response"

    def test_get_single_product(self, client, auth_cookie):
        """Test obtener un producto específico"""
        # Primero crear un producto
        create_data = {
            "name": "Producto Para Get",
            "price": 30.0,
            "images": ["test_get.jpg"],
            "variants": [{"color": "verde", "talle": "L", "stock": 2}]
        }
        create_response = client.post("/api/v1/products/", json=create_data, headers=auth_cookie)
        assert create_response.status_code == 200
        product_id = create_response.json()["id"]
        
        # Obtener el producto creado
        response = client.get(f"/api/v1/products/{product_id}", headers=auth_cookie)
        assert response.status_code == 200
        
        product = response.json()
        assert product["id"] == product_id
        assert product["name"] == "Producto Para Get"

    def test_update_product(self, client, auth_cookie):
        """Test actualizar producto"""
        # Crear producto
        create_data = {
            "name": "Producto Para Update",
            "price": 20.0,
            "images": ["original.jpg"],
            "variants": [{"color": "amarillo", "talle": "S", "stock": 1}]
        }
        create_response = client.post("/api/v1/products/", json=create_data, headers=auth_cookie)
        product_id = create_response.json()["id"]
        
        # Actualizar producto
        update_data = {
            "name": "Producto Actualizado",
            "price": 35.0,
            "description": "Nueva descripción",
            "images": ["updated.jpg"],
            "variants": [{"color": "amarillo", "talle": "M", "stock": 5}]
        }
        response = client.put(f"/api/v1/products/{product_id}", json=update_data, headers=auth_cookie)
        assert response.status_code == 200
        
        updated_product = response.json()
        assert updated_product["name"] == "Producto Actualizado"
        assert updated_product["price"] == 35.0
        assert updated_product["description"] == "Nueva descripción"

    def test_delete_product(self, client, auth_cookie):
        """Test eliminar producto"""
        # Crear producto
        create_data = {
            "name": "Producto Para Delete",
            "price": 15.0,
            "images": ["delete_me.jpg"],
            "variants": [{"color": "negro", "talle": "L", "stock": 1}]
        }
        create_response = client.post("/api/v1/products/", json=create_data, headers=auth_cookie)
        product_id = create_response.json()["id"]
        
        # Eliminar producto
        response = client.delete(f"/api/v1/products/{product_id}", headers=auth_cookie)
        assert response.status_code == 200
        
        # Verificar que no existe
        get_response = client.get(f"/api/v1/products/{product_id}", headers=auth_cookie)
        assert get_response.status_code == 404


class TestProductValidation:
    """Tests para validación de datos de productos"""

    def test_create_product_missing_required_fields(self, client, auth_cookie):
        """Test crear producto sin campos requeridos"""
        incomplete_data_sets = [
            {},  # Sin campos
            {"name": "Solo nombre"},  # Sin price
            {"price": 25.0},  # Sin name
            {"name": "Test", "price": 25.0},  # Sin variants
            {"name": "Test", "price": 25.0, "variants": []},  # Variants vacío
        ]
        
        for data in incomplete_data_sets:
            response = client.post("/api/v1/products/", json=data, headers=auth_cookie)
            assert response.status_code == 422, f"Should fail validation with data: {data}"

    def test_create_product_invalid_price(self, client, auth_cookie):
        """Test crear producto con precio inválido"""
        invalid_prices = [-1, 0, "invalid", None]
        
        for price in invalid_prices:
            data = {
                "name": "Test Product",
                "price": price,
                "images": ["test.jpg"],
                "variants": [{"color": "azul", "talle": "M", "stock": 1}]
            }
            response = client.post("/api/v1/products/", json=data, headers=auth_cookie)
            assert response.status_code == 422, f"Should fail validation with price: {price}"

    def test_create_product_invalid_variants(self, client, auth_cookie):
        """Test crear producto con variantes inválidas"""
        invalid_variant_sets = [
            [{"color": "azul"}],  # Sin talle y stock
            [{"talle": "M"}],  # Sin color y stock
            [{"stock": 5}],  # Sin color y talle
            [{"color": "", "talle": "M", "stock": 1}],  # Color vacío
            [{"color": "azul", "talle": "", "stock": 1}],  # Talle vacío
            [{"color": "azul", "talle": "M", "stock": -1}],  # Stock negativo
        ]
        
        for variants in invalid_variant_sets:
            data = {
                "name": "Test Product",
                "price": 25.0,
                "images": ["test.jpg"],
                "variants": variants
            }
            response = client.post("/api/v1/products/", json=data, headers=auth_cookie)
            assert response.status_code == 422, f"Should fail validation with variants: {variants}"


class TestProductVariants:
    """Tests específicos para variantes de productos"""

    def test_product_with_multiple_variants(self, client, auth_cookie):
        """Test producto con múltiples variantes"""
        data = {
            "name": "Producto Multi Variantes",
            "price": 40.0,
            "images": ["multi.jpg"],
            "variants": [
                {"color": "rojo", "talle": "S", "stock": 2},
                {"color": "rojo", "talle": "M", "stock": 3},
                {"color": "azul", "talle": "S", "stock": 1},
                {"color": "azul", "talle": "M", "stock": 4}
            ]
        }
        response = client.post("/api/v1/products/", json=data, headers=auth_cookie)
        assert response.status_code == 200
        
        product = response.json()
        assert len(product["variants"]) == 4
        
        # Verificar que todas las variantes están presentes
        variants = product["variants"]
        colors = set(v["color"] for v in variants)
        sizes = set(v["talle"] for v in variants)
        
        assert "rojo" in colors and "azul" in colors
        assert "S" in sizes and "M" in sizes

    def test_product_variants_stock_calculation(self, client, auth_cookie):
        """Test que el stock total se calcule correctamente"""
        data = {
            "name": "Test Stock Total",
            "price": 25.0,
            "images": ["stock.jpg"],
            "variants": [
                {"color": "verde", "talle": "S", "stock": 5},
                {"color": "verde", "talle": "M", "stock": 3},
                {"color": "verde", "talle": "L", "stock": 2}
            ]
        }
        response = client.post("/api/v1/products/", json=data, headers=auth_cookie)
        assert response.status_code == 200
        
        product = response.json()
        total_stock = sum(v["stock"] for v in product["variants"])
        assert total_stock == 10


class TestProductImages:
    """Tests para manejo de imágenes de productos"""

    def test_product_with_multiple_images(self, client, auth_cookie):
        """Test producto con múltiples imágenes"""
        data = {
            "name": "Producto Multi Imagen",
            "price": 50.0,
            "images": ["imagen1.jpg", "imagen2.jpg", "imagen3.jpg"],
            "variants": [{"color": "morado", "talle": "M", "stock": 3}]
        }
        response = client.post("/api/v1/products/", json=data, headers=auth_cookie)
        assert response.status_code == 200
        
        product = response.json()
        assert len(product["images"]) == 3
        assert "imagen1.jpg" in product["images"]
        assert "imagen2.jpg" in product["images"]
        assert "imagen3.jpg" in product["images"]

    def test_product_without_images(self, client, auth_cookie):
        """Test producto sin imágenes (debería usar images vacío o por defecto)"""
        data = {
            "name": "Producto Sin Imagen",
            "price": 20.0,
            "variants": [{"color": "gris", "talle": "L", "stock": 1}]
        }
        response = client.post("/api/v1/products/", json=data, headers=auth_cookie)
        
        # Dependiendo de la implementación, puede ser 200 o 422
        if response.status_code == 200:
            product = response.json()
            # Verificar que el campo images existe
            assert "images" in product
        else:
            assert response.status_code == 422


class TestProductsErrorHandling:
    """Tests para manejo de errores en productos"""

    def test_get_nonexistent_product(self, client, auth_cookie):
        """Test obtener producto inexistente"""
        response = client.get("/api/v1/products/99999", headers=auth_cookie)
        assert response.status_code == 404

    def test_update_nonexistent_product(self, client, auth_cookie):
        """Test actualizar producto inexistente"""
        data = {
            "name": "No existe",
            "price": 10.0,
            "images": ["test.jpg"],
            "variants": [{"color": "azul", "talle": "M", "stock": 1}]
        }
        response = client.put("/api/v1/products/99999", json=data, headers=auth_cookie)
        assert response.status_code == 404

    def test_delete_nonexistent_product(self, client, auth_cookie):
        """Test eliminar producto inexistente"""
        response = client.delete("/api/v1/products/99999", headers=auth_cookie)
        assert response.status_code == 404

    def test_products_require_authentication(self, client):
        """Test que los endpoints de productos requieran autenticación"""
        endpoints = [
            ("GET", "/api/v1/products/"),
            ("POST", "/api/v1/products/"),
            ("GET", "/api/v1/products/1"),
            ("PUT", "/api/v1/products/1"),
            ("DELETE", "/api/v1/products/1")
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
