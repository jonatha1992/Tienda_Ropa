"""
Servicio para cotizar precios de envío usando la API de logística externa.
Integra con https://apilogistica-production.up.railway.app/api/v1/cotizar
para obtener precios dinámicos de OCA, Andreani y Correo Argentino.
"""

import httpx
import asyncio
from typing import List, Dict, Optional, Any
from dataclasses import dataclass
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


@dataclass
class ShippingQuote:
    """Cotización de envío de un transportista específico"""
    carrier: str  # 'oca', 'andreani', 'correo_argentino'
    carrier_name: str
    price: float
    currency: str
    estimated_days: Optional[int]
    service_type: Optional[str]
    error: Optional[str] = None


@dataclass
class QuoteRequest:
    """Request para cotizar envío"""
    destination_postal_code: str
    destination_city: Optional[str] = None
    destination_province: Optional[str] = None
    weight_kg: float = 1.0
    height_cm: int = 10
    width_cm: int = 20
    length_cm: int = 20
    content: str = "Ropa vintage"


class ShippingQuotesService:
    """Servicio para cotizar precios de envío con transportistas"""

    def __init__(self):
        self.api_url = settings.SHIPPING_API_URL
        self.api_token = settings.SHIPPING_API_TOKEN
        self.origin = {
            "street": settings.SHIPPING_ORIGIN_ADDRESS,
            "postal_code": settings.SHIPPING_ORIGIN_POSTAL_CODE,
            "city": settings.SHIPPING_ORIGIN_CITY,
            "country_code": settings.SHIPPING_ORIGIN_COUNTRY
        }

    async def quote_all_carriers(self, quote_request: QuoteRequest) -> List[ShippingQuote]:
        """
        Cotiza con todos los transportistas disponibles (OCA, Andreani, Correo)
        """
        carriers = ['oca', 'andreani', 'correo_argentino']
        quotes = []

        # Ejecutar cotizaciones en paralelo para mayor eficiencia
        tasks = [self._quote_single_carrier(carrier, quote_request) for carrier in carriers]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        for result in results:
            if isinstance(result, ShippingQuote):
                quotes.append(result)
            elif isinstance(result, Exception):
                logger.error(f"Error en cotización: {result}")
                # Crear quote con error para mantener consistencia
                quotes.append(ShippingQuote(
                    carrier="unknown",
                    carrier_name="Error",
                    price=0.0,
                    currency="ARS",
                    estimated_days=None,
                    service_type=None,
                    error=str(result)
                ))

        return quotes

    async def _quote_single_carrier(self, carrier: str, quote_request: QuoteRequest) -> ShippingQuote:
        """
        Cotiza con un transportista específico
        """
        try:
            # Construir payload para la API
            payload = {
                "origin": self.origin,
                "destination": {
                    "postal_code": quote_request.destination_postal_code,
                    "city": quote_request.destination_city,
                    "province": quote_request.destination_province,
                    "country_code": "AR"
                },
                "parcels": [{
                    "weight": quote_request.weight_kg,
                    "height": quote_request.height_cm,
                    "width": quote_request.width_cm,
                    "length": quote_request.length_cm,
                    "content": quote_request.content
                }],
                "carrier": carrier
            }

            headers = {}
            if self.api_token:
                headers["Authorization"] = f"Bearer {self.api_token}"

            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.api_url}/cotizar",
                    json=payload,
                    headers=headers,
                    timeout=10.0
                )

                if response.status_code == 200:
                    data = response.json()
                    return self._parse_quote_response(carrier, data)
                else:
                    logger.error(f"Error al cotizar con {carrier}: {response.status_code} - {response.text}")
                    return self._create_fallback_quote(carrier, f"API Error: {response.status_code}")

        except httpx.TimeoutException:
            logger.error(f"Timeout al cotizar con {carrier}")
            return self._create_fallback_quote(carrier, "Timeout")
        except Exception as e:
            logger.error(f"Error inesperado al cotizar con {carrier}: {e}")
            return self._create_fallback_quote(carrier, str(e))

    def _parse_quote_response(self, carrier: str, response_data: Dict[str, Any]) -> ShippingQuote:
        """
        Parsea la respuesta de la API y extrae la información relevante
        """
        try:
            # La estructura exacta puede variar según la API
            # Adaptamos según la documentación real
            if 'quotes' in response_data and response_data['quotes']:
                quote_data = response_data['quotes'][0]  # Tomar la primera cotización
                
                return ShippingQuote(
                    carrier=carrier,
                    carrier_name=self._get_carrier_display_name(carrier),
                    price=float(quote_data.get('total_price', 0)),
                    currency=quote_data.get('currency', 'ARS'),
                    estimated_days=quote_data.get('estimated_days'),
                    service_type=quote_data.get('service_type')
                )
            else:
                # Si no hay cotizaciones, usar fallback
                return self._create_fallback_quote(carrier, "No quotes available")

        except Exception as e:
            logger.error(f"Error parseando respuesta para {carrier}: {e}")
            return self._create_fallback_quote(carrier, "Parse error")

    def _create_fallback_quote(self, carrier: str, error_msg: str) -> ShippingQuote:
        """
        Crea una cotización con precios por defecto cuando falla la API
        """
        fallback_prices = {
            'oca': 450,
            'andreani': 500,
            'correo_argentino': 400
        }

        return ShippingQuote(
            carrier=carrier,
            carrier_name=self._get_carrier_display_name(carrier),
            price=fallback_prices.get(carrier, 500),
            currency="ARS",
            estimated_days=self._get_default_estimated_days(carrier),
            service_type="standard",
            error=error_msg
        )

    def _get_carrier_display_name(self, carrier: str) -> str:
        """
        Retorna el nombre para mostrar del transportista
        """
        names = {
            'oca': 'OCA',
            'andreani': 'Andreani',
            'correo_argentino': 'Correo Argentino'
        }
        return names.get(carrier, carrier.upper())

    def _get_default_estimated_days(self, carrier: str) -> int:
        """
        Retorna días estimados por defecto para cada transportista
        """
        days = {
            'oca': 4,
            'andreani': 4,
            'correo_argentino': 6
        }
        return days.get(carrier, 5)

    async def quote_by_weight_and_destination(
        self, 
        postal_code: str, 
        total_weight_kg: float,
        city: Optional[str] = None,
        province: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Método de conveniencia para cotizar basado en peso total del carrito y destino
        Retorna formato compatible con el frontend
        """
        quote_request = QuoteRequest(
            destination_postal_code=postal_code,
            destination_city=city,
            destination_province=province,
            weight_kg=total_weight_kg,
            height_cm=15,  # Estimado para ropa
            width_cm=25,
            length_cm=30,
            content="Ropa vintage M-Vintage"
        )

        quotes = await self.quote_all_carriers(quote_request)

        # Convertir a formato esperado por el frontend
        formatted_quotes = []
        for quote in quotes:
            formatted_quotes.append({
                'carrier': quote.carrier,
                'name': quote.carrier_name,
                'price': quote.price,
                'currency': quote.currency,
                'estimated_days': quote.estimated_days,
                'estimated_delivery_text': self._format_delivery_time(quote.estimated_days),
                'service_type': quote.service_type,
                'has_error': quote.error is not None,
                'error_message': quote.error
            })

        return formatted_quotes

    def _format_delivery_time(self, estimated_days: Optional[int]) -> str:
        """
        Formatea el tiempo de entrega para mostrar al usuario
        """
        if not estimated_days:
            return "Consultar tiempos"
        
        if estimated_days <= 3:
            return f"Entrega en {estimated_days} días hábiles"
        elif estimated_days <= 5:
            return f"Entrega en {estimated_days}-{estimated_days+1} días hábiles"
        else:
            return f"Entrega en {estimated_days}-{estimated_days+2} días hábiles"


# Instancia global del servicio
shipping_quotes_service = ShippingQuotesService()