# Integración de API de Logística - MVintage

## Resumen

Se implementó una integración completa con APIs de logística para calcular cotizaciones de envío en tiempo real. La solución incluye manejo de múltiples transportistas, fallbacks cuando las APIs externas no están disponibles, y una interfaz de usuario intuitiva.

## Arquitectura

### Backend (FastAPI)

#### Servicio Principal
- **Archivo**: `backend/app/services/shipping_quotes_service.py`
- **Clase**: `ShippingQuotesService`
- **Responsabilidades**:
  - Integración con APIs externas de logística
  - Manejo de fallbacks cuando las APIs no están disponibles
  - Normalización de respuestas de diferentes transportistas
  - Cálculo de precios estimados basados en peso y distancia

#### Endpoints API
- **Base URL**: `/api/v1/shipping/`
- **Endpoints disponibles**:
  - `GET /test-api` - Prueba de conectividad con API externa
  - `POST /quote` - Obtener cotizaciones de envío
  - `GET /carriers` - Listar transportistas disponibles

#### Transportistas Soportados
1. **Correo Argentino**
   - Servicio estándar y express
   - Cobertura nacional
   - Tiempo estimado: 3-7 días

2. **OCA**
   - Servicio estándar y express
   - Cobertura nacional e internacional
   - Tiempo estimado: 2-5 días

3. **Andreani**
   - Servicio estándar y express
   - Cobertura nacional
   - Tiempo estimado: 1-4 días

### Frontend (Vue.js + TypeScript)

#### Servicio API
- **Archivo**: `frontend/src/config/api.ts`
- **Objeto**: `shippingQuotesApi`
- **Métodos**:
  - `testShippingApi()` - Prueba conectividad
  - `getShippingQuotes(params)` - Obtiene cotizaciones
  - `getAvailableCarriers()` - Lista transportistas

#### Componente Principal
- **Archivo**: `frontend/src/components/checkout/ShippingQuoteCalculator.vue`
- **Características**:
  - Formulario de dirección con validación
  - Cálculo automático de cotizaciones
  - Selección de transportista
  - Manejo de estados de carga y error
  - Interfaz responsive con Tailwind CSS

#### Tipos TypeScript
- **Archivo**: `frontend/src/types/orders/shipping.types.ts`
- **Interfaces definidas**:
  - `ShippingQuoteRequest`
  - `ShippingQuoteOption`
  - `ShippingQuoteResponse`
  - `CarrierInfo`

## Uso

### Integración en Checkout

```vue
<template>
  <ShippingQuoteCalculator
    :total-weight="cartTotalWeight"
    v-model="selectedShippingOption"
    @quote-selected="handleShippingSelection"
  />
</template>

<script setup>
import ShippingQuoteCalculator from '@/components/checkout/ShippingQuoteCalculator.vue'

const selectedShippingOption = ref(null)
const cartTotalWeight = computed(() => {
  // Calcular peso total del carrito
  return cart.items.reduce((total, item) => total + (item.weight * item.quantity), 0)
})

const handleShippingSelection = (quote) => {
  // Manejar selección de cotización
  console.log('Shipping selected:', quote)
}
</script>
```

### Llamada Directa a la API

```typescript
import { shippingQuotesApi } from '@/config/api'

// Obtener cotizaciones
const quotes = await shippingQuotesApi.getShippingQuotes({
  postal_code: '1000',
  city: 'Buenos Aires',
  province: 'CABA',
  total_weight_kg: 2.5,
  include_fallback: true
})

// Probar conectividad
const status = await shippingQuotesApi.testShippingApi()
```

## Configuración

### Variables de Entorno (Backend)

```bash
# API de Logística
LOGISTICS_API_URL=https://api.logistica.com/v1
LOGISTICS_API_KEY=your_api_key_here

# Configuración de fallback
ENABLE_SHIPPING_FALLBACK=true
DEFAULT_SHIPPING_PRICE=1500
```

### Configuración Frontend

```typescript
// frontend/src/config/api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const shippingQuotesApi = {
  baseURL: `${API_BASE_URL}/api/v1/shipping`,
  // ... métodos
}
```

## Funcionalidades

### 1. Cálculo de Cotizaciones
- Ingreso de código postal, ciudad y provincia
- Cálculo automático basado en peso del pedido
- Múltiples opciones de transportistas
- Precios y tiempos de entrega estimados

### 2. Manejo de Errores
- Fallback cuando APIs externas fallan
- Mensajes de error informativos
- Opciones de reintento automático
- Logging detallado para debugging

### 3. Interfaz de Usuario
- Formulario intuitivo con validación
- Estados de carga visuales
- Selección clara de opciones
- Responsive design
- Accesibilidad mejorada

### 4. Integración con Checkout
- Componente reutilizable
- Eventos para comunicación con componente padre
- Validación de datos antes del pago
- Persistencia de selección

## Testing

### Vista de Prueba
- **URL**: `http://localhost:5174/test/shipping`
- **Funcionalidades**:
  - Prueba de conectividad API
  - Calculadora de envío interactiva
  - Visualización de respuestas JSON
  - Lista de transportistas disponibles

### Casos de Prueba Recomendados

1. **Conectividad API**
   ```bash
   curl -X GET "http://localhost:8000/api/v1/shipping/test-api"
   ```

2. **Cotización Válida**
   ```bash
   curl -X POST "http://localhost:8000/api/v1/shipping/quote" \
     -H "Content-Type: application/json" \
     -d '{
       "postal_code": "1000",
       "city": "Buenos Aires",
       "province": "CABA",
       "total_weight_kg": 2.5
     }'
   ```

3. **Fallback Mode**
   - Desconectar API externa
   - Verificar que se muestren opciones de fallback
   - Confirmar precios estimados

## Monitoreo y Logs

### Backend Logs
```python
# Logs importantes a monitorear
INFO: Shipping API connection successful
WARNING: Shipping API unavailable, using fallback
ERROR: Failed to calculate shipping quote
```

### Frontend Console
```javascript
// Debugging en consola del navegador
console.log('Shipping quote request:', requestData)
console.log('Shipping quote response:', response)
console.error('Shipping calculation error:', error)
```

## Próximos Pasos

1. **Integración con Más Transportistas**
   - Mercado Envíos
   - Cruz del Sur
   - Vía Cargo

2. **Funcionalidades Avanzadas**
   - Seguimiento de envíos
   - Notificaciones automáticas
   - Integración con sistema de inventario

3. **Optimizaciones**
   - Cache de cotizaciones
   - Compresión de respuestas
   - Rate limiting

4. **Analytics**
   - Métricas de uso por transportista
   - Análisis de costos de envío
   - Reportes de performance

## Troubleshooting

### Problemas Comunes

1. **API Externa No Responde**
   - Verificar conectividad de red
   - Revisar configuración de API keys
   - Confirmar que el servicio de fallback esté habilitado

2. **Cotizaciones Incorrectas**
   - Validar peso del producto
   - Verificar código postal
   - Revisar configuración de precios base

3. **Errores de CORS**
   - Configurar headers en backend
   - Verificar URLs de frontend en whitelist
   - Revisar configuración de proxy en desarrollo

### Logs de Debugging

```bash
# Backend
tail -f logs/shipping.log

# Frontend (DevTools)
localStorage.setItem('debug', 'shipping:*')
```

## Contacto y Soporte

Para problemas relacionados con la integración de logística:
- Revisar logs del sistema
- Consultar documentación de APIs externas
- Verificar configuración de variables de entorno
- Probar conectividad con herramientas de red
