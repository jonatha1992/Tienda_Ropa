"""
Tests integrados para el módulo de datos maestros.
Incluye colores, categorías y talles.
"""
import pytest
from fastapi.testclient import TestClient


class TestMasterDataEndpoints:
    """Tests para los endpoints de master data (GET públicos)"""
    
    def test_get_colors_endpoint(self, client):
        """Test endpoint GET /api/v1/colors"""
        response = client.get("/api/v1/colors")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        
        # Si hay datos, verificar estructura
        if len(data) > 0:
            color = data[0]
            required_fields = ["id", "name", "hex_code", "is_active"]
            for field in required_fields:
                assert field in color, f"Field {field} missing in color response"
            
            # Verificar que solo devuelve colores activos
            for color in data:
                assert color["is_active"] is True

    def test_get_categories_endpoint(self, client):
        """Test endpoint GET /api/v1/categories"""
        response = client.get("/api/v1/categories")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        
        # Si hay datos, verificar estructura
        if len(data) > 0:
            category = data[0]
            required_fields = ["id", "name", "description", "is_active"]
            for field in required_fields:
                assert field in category, f"Field {field} missing in category response"
            
            # Verificar que solo devuelve categorías activas
            for category in data:
                assert category["is_active"] is True

    def test_get_sizes_endpoint(self, client):
        """Test endpoint GET /api/v1/sizes"""
        response = client.get("/api/v1/sizes")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        
        # Si hay datos, verificar estructura
        if len(data) > 0:
            size = data[0]
            required_fields = ["id", "name", "numeric_size", "order", "is_active"]
            for field in required_fields:
                assert field in size, f"Field {field} missing in size response"
            
            # Verificar que solo devuelve talles activos
            for size in data:
                assert size["is_active"] is True
            
            # Verificar que están ordenados correctamente
            orders = [size["order"] for size in data]
            assert orders == sorted(orders), "Los talles deberían estar ordenados por 'order'"

    def test_master_data_endpoints_response_format(self, client):
        """Test que todos los endpoints respondan correctamente"""
        endpoints = [
            "/api/v1/colors",
            "/api/v1/categories", 
            "/api/v1/sizes"
        ]
        
        for endpoint in endpoints:
            response = client.get(endpoint)
            assert response.status_code == 200, f"Endpoint {endpoint} should return 200"
            assert isinstance(response.json(), list), f"Endpoint {endpoint} should return a list"


class TestMasterDataIntegration:
    """Tests de integración para verificar que los datos inicializados están disponibles"""
    
    def test_master_data_are_available(self, client):
        """Test que los datos maestros inicializados estén disponibles"""
        # Verificar colores
        colors_response = client.get("/api/v1/colors")
        assert colors_response.status_code == 200
        colors_data = colors_response.json()
        
        # Verificar categorías
        categories_response = client.get("/api/v1/categories")
        assert categories_response.status_code == 200
        categories_data = categories_response.json()
        
        # Verificar talles
        sizes_response = client.get("/api/v1/sizes")
        assert sizes_response.status_code == 200
        sizes_data = sizes_response.json()
        
        # Los datos deberían existir si se ejecutó setup_database
        print(f"Colores encontrados: {len(colors_data)}")
        print(f"Categorías encontradas: {len(categories_data)}")
        print(f"Talles encontrados: {len(sizes_data)}")
        
        # Verificar que hay al menos algunos datos básicos
        if len(colors_data) > 0:
            color_names = [color["name"] for color in colors_data]
            assert any(name in ["BLANCO", "NEGRO", "ROJO", "AZUL"] for name in color_names)
        
        if len(categories_data) > 0:
            category_names = [cat["name"] for cat in categories_data]
            assert any(name in ["VESTIDOS", "REMERAS", "PANTOLONES"] for name in category_names)
        
        if len(sizes_data) > 0:
            size_names = [size["name"] for size in sizes_data]
            assert any(name in ["S", "M", "L"] for name in size_names)

    def test_data_consistency(self, client):
        """Test que los datos sean consistentes entre llamadas"""
        # Hacer dos llamadas a cada endpoint
        colors_1 = client.get("/api/v1/colors").json()
        colors_2 = client.get("/api/v1/colors").json()
        assert colors_1 == colors_2, "Colors data should be consistent between calls"
        
        categories_1 = client.get("/api/v1/categories").json()
        categories_2 = client.get("/api/v1/categories").json()
        assert categories_1 == categories_2, "Categories data should be consistent between calls"
        
        sizes_1 = client.get("/api/v1/sizes").json()
        sizes_2 = client.get("/api/v1/sizes").json()
        assert sizes_1 == sizes_2, "Sizes data should be consistent between calls"

    def test_color_hex_codes_format(self, client):
        """Test que los códigos hex de colores tengan formato válido"""
        response = client.get("/api/v1/colors")
        assert response.status_code == 200
        colors = response.json()
        
        for color in colors:
            hex_code = color["hex_code"]
            # Verificar formato hex válido
            assert hex_code.startswith("#"), f"Color {color['name']} hex code should start with #"
            assert len(hex_code) == 7, f"Color {color['name']} hex code should be 7 characters long"
            # Verificar que son caracteres hex válidos
            hex_chars = hex_code[1:]
            assert all(c in "0123456789ABCDEFabcdef" for c in hex_chars), f"Invalid hex characters in {hex_code}"

    def test_sizes_numeric_values(self, client):
        """Test que los talles tengan valores numéricos válidos"""
        response = client.get("/api/v1/sizes")
        assert response.status_code == 200
        sizes = response.json()
        
        for size in sizes:
            numeric_size = size["numeric_size"]
            order = size["order"]
            
            assert isinstance(numeric_size, (int, float)), f"Size {size['name']} numeric_size should be numeric"
            assert isinstance(order, int), f"Size {size['name']} order should be integer"
            assert numeric_size > 0, f"Size {size['name']} numeric_size should be positive"
            assert order > 0, f"Size {size['name']} order should be positive"


class TestMasterDataErrorHandling:
    """Tests para manejo de errores en datos maestros"""
    
    def test_invalid_master_data_endpoints(self, client):
        """Test que endpoints inválidos de master data retornen 404"""
        invalid_endpoints = [
            "/api/v1/invalid_master_data",
            "/api/v1/colors/invalid",
            "/api/v1/categories/invalid",
            "/api/v1/sizes/invalid"
        ]
        
        for endpoint in invalid_endpoints:
            response = client.get(endpoint)
            assert response.status_code == 404, f"Invalid endpoint {endpoint} should return 404"
