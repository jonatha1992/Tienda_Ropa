"""
Configuración y utilidades para proveedores de envío.
Manejo de Correo Argentino, OCA, Andreani.
"""

import re
from typing import Dict, Any, Optional


# Configuración de proveedores de envío
SHIPPING_PROVIDERS: Dict[str, Dict[str, Any]] = {
    'correo-argentino': {
        'name': 'Correo Argentino',
        'tracking_url': 'https://www.correoargentino.com.ar/formularios/ondnc?numero={}',
        'tracking_regex': r'^[A-Z]{2}[0-9]{9}[A-Z]{2}$',  # Ejemplo: CP123456789AR
        'api_endpoint': 'https://api.correoargentino.com.ar/track',
        'support_api': False,  # Por ahora manual
        'color': '#0066cc',
        'icon': '📮'
    },
    'oca': {
        'name': 'OCA',
        'tracking_url': 'https://www1.oca.com.ar/OcaEpak_Tracking/Tracking.aspx?NumeroEnvio={}',
        'tracking_regex': r'^[0-9]{10,13}$',  # Números de 10-13 dígitos
        'api_endpoint': None,
        'support_api': False,
        'color': '#ff6600',
        'icon': '🚚'
    },
    'andreani': {
        'name': 'Andreani',
        'tracking_url': 'https://www.andreani.com/seguimiento/?numero={}',
        'tracking_regex': r'^[A-Z0-9]{8,15}$',  # Alfanumérico 8-15 caracteres
        'api_endpoint': 'https://api.andreani.com/v2/tracking',
        'support_api': False,  # Por ahora manual
        'color': '#009900',
        'icon': '📦'
    }
}

# Estados de envío
SHIPPING_STATUSES = {
    'pending_shipment': {
        'name': 'Listo para Envío',
        'description': 'Pedido aprobado, sin número de tracking',
        'color': 'orange',
        'icon': '📋'
    },
    'ready_to_ship': {
        'name': 'Preparado para Envío',
        'description': 'Tiene tracking number, no enviado aún',
        'color': 'blue',
        'icon': '📦'
    },
    'shipped': {
        'name': 'Enviado',
        'description': 'Paquete en tránsito',
        'color': 'green',
        'icon': '🚚'
    },
    'in_transit': {
        'name': 'En Camino',
        'description': 'Paquete en centro de distribución',
        'color': 'blue',
        'icon': '🏃‍♂️'
    },
    'delivered': {
        'name': 'Entregado',
        'description': 'Paquete entregado al destinatario',
        'color': 'green',
        'icon': '✅'
    },
    'problem': {
        'name': 'Problema',
        'description': 'Inconveniente con la entrega',
        'color': 'red',
        'icon': '⚠️'
    }
}


def validate_tracking_number(tracking: str, provider: str) -> bool:
    """
    Validar formato de número de tracking según proveedor.
    
    Args:
        tracking: Número de tracking a validar
        provider: Proveedor (correo-argentino, oca, andreani)
        
    Returns:
        bool: True si el formato es válido
    """
    if not tracking or provider not in SHIPPING_PROVIDERS:
        return False
    
    # Limpiar tracking (quitar espacios, convertir a mayúsculas)
    clean_tracking = tracking.strip().upper()
    
    # Obtener patrón regex del proveedor
    pattern = SHIPPING_PROVIDERS[provider]['tracking_regex']
    
    return bool(re.match(pattern, clean_tracking))


def get_tracking_url(tracking: str, provider: str) -> str:
    """
    Generar URL de seguimiento para el proveedor.
    
    Args:
        tracking: Número de tracking
        provider: Proveedor de envío
        
    Returns:
        str: URL de seguimiento o "#" si no es válido
    """
    if provider not in SHIPPING_PROVIDERS or not tracking:
        return "#"
    
    clean_tracking = tracking.strip().upper()
    url_template = SHIPPING_PROVIDERS[provider]['tracking_url']
    
    return url_template.format(clean_tracking)


def get_provider_info(provider: str) -> Dict[str, Any]:
    """
    Obtener información completa del proveedor.
    
    Args:
        provider: Código del proveedor
        
    Returns:
        Dict con información del proveedor o None si no existe
    """
    return SHIPPING_PROVIDERS.get(provider, {})


def get_provider_name(provider: str) -> str:
    """
    Obtener nombre amigable del proveedor.
    
    Args:
        provider: Código del proveedor
        
    Returns:
        str: Nombre del proveedor
    """
    return SHIPPING_PROVIDERS.get(provider, {}).get('name', provider)


def clean_tracking_number(tracking: str) -> str:
    """
    Limpiar y normalizar número de tracking.
    
    Args:
        tracking: Número de tracking sin procesar
        
    Returns:
        str: Tracking limpio y normalizado
    """
    if not tracking:
        return ''
    
    # Quitar espacios, convertir a mayúsculas, quitar caracteres especiales
    clean = re.sub(r'[^\w]', '', tracking.strip().upper())
    
    return clean


def get_shipping_status(order_status: str, tracking_number: Optional[str], shipped_at: Optional[str]) -> str:
    """
    Determinar estado de envío basado en datos de la orden.
    
    Args:
        order_status: Estado de la orden (pending, approved, shipped, delivered, cancelled)
        tracking_number: Número de tracking (puede ser None)
        shipped_at: Fecha de envío (puede ser None)
        
    Returns:
        str: Estado de envío
    """
    if order_status == 'cancelled':
        return 'cancelled'
    
    if order_status == 'pending':
        return 'pending_payment'
    
    if order_status == 'approved':
        if not tracking_number:
            return 'pending_shipment'
        elif not shipped_at:
            return 'ready_to_ship'
        else:
            return 'shipped'
    
    if order_status == 'shipped':
        return 'shipped'
    
    if order_status == 'delivered':
        return 'delivered'
    
    return 'unknown'


def get_status_info(status: str) -> Dict[str, Any]:
    """
    Obtener información de un estado de envío.
    
    Args:
        status: Estado de envío
        
    Returns:
        Dict con información del estado
    """
    return SHIPPING_STATUSES.get(status, {
        'name': 'Estado Desconocido',
        'description': 'Estado no reconocido',
        'color': 'gray',
        'icon': '❓'
    })


# Funciones de validación por proveedor
def validate_correo_argentino(tracking: str) -> bool:
    """Validar tracking de Correo Argentino: CP123456789AR"""
    return bool(re.match(r'^[A-Z]{2}[0-9]{9}[A-Z]{2}$', tracking.upper()))


def validate_oca(tracking: str) -> bool:
    """Validar tracking de OCA: 1234567890123"""
    return bool(re.match(r'^[0-9]{10,13}$', tracking))


def validate_andreani(tracking: str) -> bool:
    """Validar tracking de Andreani: ABC12345678"""
    return bool(re.match(r'^[A-Z0-9]{8,15}$', tracking.upper()))


# Mapeo de funciones de validación
VALIDATION_FUNCTIONS = {
    'correo-argentino': validate_correo_argentino,
    'oca': validate_oca,
    'andreani': validate_andreani
}


def get_provider_examples() -> Dict[str, str]:
    """
    Obtener ejemplos de números de tracking por proveedor.
    
    Returns:
        Dict con ejemplos de tracking por proveedor
    """
    return {
        'correo-argentino': 'CP123456789AR',
        'oca': '1234567890123',
        'andreani': 'ABC12345678'
    }


def suggest_tracking_format(provider: str) -> str:
    """
    Sugerir formato de tracking para un proveedor.
    
    Args:
        provider: Código del proveedor
        
    Returns:
        str: Descripción del formato esperado
    """
    formats = {
        'correo-argentino': 'Formato: 2 letras + 9 números + 2 letras (ej: CP123456789AR)',
        'oca': 'Formato: 10-13 números (ej: 1234567890123)', 
        'andreani': 'Formato: 8-15 caracteres alfanuméricos (ej: ABC12345678)'
    }
    
    return formats.get(provider, 'Formato no especificado')