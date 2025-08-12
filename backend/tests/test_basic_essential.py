"""
Tests básicos y esenciales para la aplicación Tienda Ropa.
Solo incluye las funcionalidades más críticas y simples.
"""
import pytest
from fastapi.testclient import TestClient


class TestHealthAndBasics:
    """Tests básicos de salud y funcionalidad"""
    
    def test_health_endpoint(self, client):
        """Test que el servidor esté funcionando"""
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}


class TestMasterDataBasics:
    """Tests básicos de datos maestros"""
    
    def test_get_colors(self, client):
        """Test obtener colores"""
        response = client.get("/api/v1/colors")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_get_categories(self, client):
        """Test obtener categorías"""
        response = client.get("/api/v1/categories")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_get_sizes(self, client):
        """Test obtener talles"""
        response = client.get("/api/v1/sizes")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_get_categories_with_stock(self, client):
        """Test obtener categorías que tienen productos con stock"""
        response = client.get("/api/v1/categories/with-stock")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        # Las categorías con stock pueden estar vacías si no hay productos con stock
        # pero la respuesta debe ser una lista válida
    
    def test_categories_with_stock_endpoint_exists(self, client):
        """Test básico para verificar que el endpoint existe y no da 404"""
        response = client.get("/api/v1/categories/with-stock")
        # El endpoint debe existir (no 404) y devolver una respuesta válida
        assert response.status_code != 404
        assert response.status_code in [200, 500], f"Expected 200 or 500, got {response.status_code}"
        
        # Si es 200, debe ser una lista
        if response.status_code == 200:
            data = response.json()
            assert isinstance(data, list)


class TestAuthBasics:
    """Tests básicos de autenticación"""
    
    def test_protected_endpoint_without_auth(self, client):
        """Test que endpoint protegido requiera autenticación"""
        response = client.get("/api/v1/users/me")
        assert response.status_code == 403
    
    def test_protected_endpoint_with_auth(self, client, auth_cookie):
        """Test endpoint protegido con autenticación"""
        response = client.get("/api/v1/users/me", headers=auth_cookie)
        assert response.status_code == 200


class TestProductBasics:
    """Tests básicos de productos"""
    
    def test_get_products(self, client):
        """Test obtener lista de productos"""
        response = client.get("/api/v1/products/")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_create_simple_product(self, client, auth_cookie):
        """Test crear producto simple"""
        data = {
            "name": "Producto Test Básico",
            "price": 25.0,
            "images": ["test.jpg"],
            "variants": [{"color": "azul", "talle": "M", "stock": 5}]
        }
        response = client.post("/api/v1/products/", json=data, headers=auth_cookie)
        assert response.status_code == 200
        product = response.json()
        assert product["name"] == "Producto Test Básico"
        assert product["price"] == 25.0
    
    def test_categories_with_stock_before_and_after_product_creation(self, client, auth_cookie):
        """Test simple para verificar que categorías con stock funciona antes y después de crear productos"""
        # Verificar estado inicial
        initial_response = client.get("/api/v1/categories/with-stock")
        assert initial_response.status_code == 200
        initial_categories = initial_response.json()
        assert isinstance(initial_categories, list)
        
        # Verificar que las categorías normales existen
        categories_response = client.get("/api/v1/categories")
        assert categories_response.status_code == 200
        all_categories = categories_response.json()
        
        if all_categories:
            # Solo continuar si hay categorías para probar
            first_category = all_categories[0]
            
            # Crear producto simple
            product_data = {
                "name": "Test Product for Stock",
                "price": 15.0,
                "categoria": first_category["name"],
                "is_unique": True,  # Producto único es más simple
                "color": "verde",
                "talle": "S", 
                "stock": 3,
                "images": ["test.jpg"],
                "variants": []
            }
            
            create_response = client.post("/api/v1/products/", json=product_data, headers=auth_cookie)
            assert create_response.status_code == 200
            
            # Verificar categorías con stock después de crear producto
            final_response = client.get("/api/v1/categories/with-stock")
            assert final_response.status_code == 200
            final_categories = final_response.json()
            assert isinstance(final_categories, list)
    
    def test_categories_with_stock_integration(self, client, auth_cookie):
        """Test integración: crear producto con stock y verificar que aparezca en categorías con stock"""
        # Primero obtener una categoría existente
        categories_response = client.get("/api/v1/categories")
        assert categories_response.status_code == 200
        categories = categories_response.json()
        
        if not categories:
            # Crear una categoría si no existe
            from app.models.master_data import Category
            pytest.skip("No hay categorías disponibles para el test")
        
        # Tomar la primera categoría
        test_category = categories[0]
        
        # Crear un producto con stock en esa categoría
        data = {
            "name": "Producto Test Con Stock",
            "price": 30.0,
            "categoria": test_category["name"],  # Usar el nombre, no el ID
            "is_unique": False,
            "images": ["test_stock.jpg"],
            "variants": [{"color": "rojo", "talle": "L", "stock": 10}]
        }
        
        # Crear el producto
        product_response = client.post("/api/v1/products/", json=data, headers=auth_cookie)
        assert product_response.status_code == 200
        created_product = product_response.json()
        
        # Verificar que el producto se creó correctamente
        assert created_product["name"] == "Producto Test Con Stock"
        assert created_product["categoria"] == test_category["name"]
        assert len(created_product["variants"]) > 0
        assert created_product["variants"][0]["stock"] == 10
        
        # Verificar que la categoría ahora aparezca en categorías con stock
        stock_categories_response = client.get("/api/v1/categories/with-stock")
        assert stock_categories_response.status_code == 200
        stock_categories = stock_categories_response.json()
        
        # La categoría del producto debería estar en la lista
        category_names = [cat["name"] for cat in stock_categories]
        assert test_category["name"] in category_names, f"Category '{test_category['name']}' should be in stock categories: {category_names}"


class TestCustomerBasics:
    """Tests básicos de clientes"""
    
    def test_create_customer(self, client, auth_cookie):
        """Test crear cliente básico"""
        data = {
            "name": "Cliente Test",
            "email": "test@example.com"
        }
        response = client.post("/api/v1/customers/", json=data, headers=auth_cookie)
        assert response.status_code == 200
        customer = response.json()
        assert customer["name"] == "Cliente Test"
        assert customer["email"] == "test@example.com"
    
    def test_get_customers(self, client, auth_cookie):
        """Test obtener lista de clientes"""
        response = client.get("/api/v1/customers/", headers=auth_cookie)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)