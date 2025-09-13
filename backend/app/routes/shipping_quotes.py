"""
Rutas para cotización dinámica de precios de envío.
Proporciona endpoints para obtener cotizaciones de OCA, Andreani y Correo Argentino.
"""

from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from app.services.shipping_quotes_service import shipping_quotes_service
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/shipping", tags=["Shipping Quotes"])


# Esquemas de entrada
class ShippingQuoteRequest(BaseModel):
    """Esquema para solicitar cotización de envío"""
    postal_code: str = Field(min_length=1, max_length=8, description="Código postal de destino")
    city: Optional[str] = Field(None, max_length=100, description="Ciudad de destino")
    province: Optional[str] = Field(None, max_length=50, description="Provincia de destino")
    total_weight_kg: float = Field(default=1.0, ge=0.1, le=100.0, description="Peso total del pedido en kg")
    include_fallback: bool = Field(default=True, description="Incluir precios por defecto si falla la API")


# Esquemas de salida
class ShippingOption(BaseModel):
    """Opción de envío disponible"""
    carrier: str = Field(description="Código del transportista")
    name: str = Field(description="Nombre del transportista")
    price: float = Field(description="Precio del envío")
    currency: str = Field(description="Moneda del precio")
    estimated_days: Optional[int] = Field(description="Días estimados de entrega")
    estimated_delivery_text: str = Field(description="Texto descriptivo del tiempo de entrega")
    service_type: Optional[str] = Field(description="Tipo de servicio")
    has_error: bool = Field(default=False, description="Si hubo error en la cotización")
    error_message: Optional[str] = Field(description="Mensaje de error si lo hay")


class ShippingQuoteResponse(BaseModel):
    """Respuesta con cotizaciones de envío"""
    success: bool
    postal_code: str
    total_weight_kg: float
    options: List[ShippingOption]
    message: Optional[str] = None
    api_available: bool = Field(description="Si la API externa está disponible")


@router.post("/quote", response_model=ShippingQuoteResponse)
async def quote_shipping_prices(request: ShippingQuoteRequest):
    """
    Cotizar precios de envío con múltiples transportistas.
    
    Devuelve cotizaciones de OCA, Andreani y Correo Argentino basadas en:
    - Código postal de destino
    - Peso total del pedido
    - Opcional: ciudad y provincia para mayor precisión
    """
    try:
        logger.info(f"Cotizando envío para CP: {request.postal_code}, peso: {request.total_weight_kg}kg")

        # Obtener cotizaciones del servicio
        quotes = await shipping_quotes_service.quote_by_weight_and_destination(
            postal_code=request.postal_code,
            total_weight_kg=request.total_weight_kg,
            city=request.city,
            province=request.province
        )

        # Convertir a esquema de respuesta
        options = [ShippingOption(**quote) for quote in quotes]

        # Verificar si hay errores en las cotizaciones
        has_api_errors = any(option.has_error for option in options)
        api_available = not all(option.has_error for option in options)

        message = None
        if has_api_errors and api_available:
            message = "Algunas cotizaciones usan precios estimados"
        elif not api_available:
            message = "Usando precios estimados - API no disponible"

        return ShippingQuoteResponse(
            success=True,
            postal_code=request.postal_code,
            total_weight_kg=request.total_weight_kg,
            options=options,
            message=message,
            api_available=api_available
        )

    except Exception as e:
        logger.error(f"Error al cotizar envío: {e}")
        
        if request.include_fallback:
            # Retornar precios por defecto en caso de error total
            fallback_options = [
                ShippingOption(
                    carrier="oca",
                    name="OCA",
                    price=450.0,
                    currency="ARS",
                    estimated_days=4,
                    estimated_delivery_text="Entrega en 4-5 días hábiles",
                    service_type="standard",
                    has_error=True,
                    error_message="Precio estimado - API no disponible"
                ),
                ShippingOption(
                    carrier="andreani",
                    name="Andreani", 
                    price=500.0,
                    currency="ARS",
                    estimated_days=4,
                    estimated_delivery_text="Entrega en 3-5 días hábiles",
                    service_type="standard",
                    has_error=True,
                    error_message="Precio estimado - API no disponible"
                ),
                ShippingOption(
                    carrier="correo_argentino",
                    name="Correo Argentino",
                    price=400.0,
                    currency="ARS", 
                    estimated_days=6,
                    estimated_delivery_text="Entrega en 5-8 días hábiles",
                    service_type="standard",
                    has_error=True,
                    error_message="Precio estimado - API no disponible"
                )
            ]

            return ShippingQuoteResponse(
                success=True,
                postal_code=request.postal_code,
                total_weight_kg=request.total_weight_kg,
                options=fallback_options,
                message="Usando precios estimados - servicio de cotización no disponible",
                api_available=False
            )
        else:
            raise HTTPException(
                status_code=503,
                detail=f"Servicio de cotización no disponible: {str(e)}"
            )


@router.get("/carriers")
async def get_available_carriers():
    """
    Obtener lista de transportistas disponibles con información básica.
    """
    return {
        "carriers": [
            {
                "code": "oca",
                "name": "OCA",
                "description": "Entrega a domicilio en 4-5 días hábiles",
                "estimated_days": 4
            },
            {
                "code": "andreani", 
                "name": "Andreani",
                "description": "Entrega a domicilio en 3-5 días hábiles",
                "estimated_days": 4
            },
            {
                "code": "correo_argentino",
                "name": "Correo Argentino", 
                "description": "Entrega a domicilio en 5-8 días hábiles",
                "estimated_days": 6
            }
        ],
        "total": 3
    }


@router.get("/test-api")
async def test_shipping_api():
    """
    Endpoint para testear la conexión con la API de logística.
    Útil para diagnóstico y debugging.
    """
    try:
        # Hacer una cotización de prueba
        test_quotes = await shipping_quotes_service.quote_by_weight_and_destination(
            postal_code="1000",  # CABA
            total_weight_kg=1.0
        )

        api_working = not all(quote.get('has_error', False) for quote in test_quotes)

        return {
            "api_url": shipping_quotes_service.api_url,
            "api_working": api_working,
            "test_quotes": test_quotes,
            "message": "API funcionando correctamente" if api_working else "API con errores - usando fallback"
        }

    except Exception as e:
        return {
            "api_url": shipping_quotes_service.api_url,
            "api_working": False,
            "error": str(e),
            "message": "Error al conectar con API de logística"
        }