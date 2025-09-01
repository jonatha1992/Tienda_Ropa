/**
 * Centralized order status utilities
 * Single source of truth for all status mappings across the application
 */

// Configuration for payment status display
export const PAYMENT_STATUS_CONFIG = {
  'pending': { text: 'Pago Pendiente', class: 'bg-orange-100 text-orange-800' },
  'pending_payment': { text: 'Esperando Pago', class: 'bg-orange-100 text-orange-800' },
  'approved': { text: 'Pago Confirmado', class: 'bg-green-100 text-green-800' },
  'paid': { text: 'Pagado', class: 'bg-green-100 text-green-800' },
  'rejected': { text: 'Pago Rechazado', class: 'bg-red-100 text-red-800' },
  'cancelled': { text: 'Pago Cancelado', class: 'bg-red-100 text-red-800' }
} as const;

// Configuration for shipping status display
export const SHIPPING_STATUS_CONFIG = {
  'pending': { text: 'Pendiente Envío', class: 'bg-yellow-100 text-yellow-800' },
  'prepared': { text: 'Preparado', class: 'bg-blue-100 text-blue-800' },
  'ready_to_ship': { text: 'Listo para Enviar', class: 'bg-indigo-100 text-indigo-800' },
  'ready_for_pickup': { text: 'Listo para Recoger', class: 'bg-indigo-100 text-indigo-800' },
  'shipped': { text: 'Enviado', class: 'bg-purple-100 text-purple-800' },
  'in_transit': { text: 'En Tránsito', class: 'bg-blue-100 text-blue-800' },
  'out_for_delivery': { text: 'En Reparto', class: 'bg-purple-100 text-purple-800' },
  'delivered': { text: 'Entregado', class: 'bg-green-100 text-green-800' },
  'failed': { text: 'Error en Entrega', class: 'bg-red-100 text-red-800' }
} as const;

// Configuration for delivery method display
export const DELIVERY_METHOD_CONFIG = {
  'envio_andreani': { text: 'Envío Andreani', class: 'bg-blue-100 text-blue-800' },
  'envio_correo': { text: 'Envío Correo Argentino', class: 'bg-purple-100 text-purple-800' },
  'retiro_local': { text: 'Retiro en Local', class: 'bg-green-100 text-green-800' },
  'standard': { text: 'Estándar', class: 'bg-blue-100 text-blue-800' },
  'express': { text: 'Express', class: 'bg-purple-100 text-purple-800' },
  'pickup': { text: 'Recogida en tienda', class: 'bg-green-100 text-green-800' }
} as const;

/**
 * Gets payment status configuration (text and CSS class)
 */
export function getPaymentStatusConfig(status: string | undefined) {
  if (!status) return { text: 'Pendiente', class: 'bg-gray-100 text-gray-800' };
  return PAYMENT_STATUS_CONFIG[status.toLowerCase() as keyof typeof PAYMENT_STATUS_CONFIG] 
    || { text: status, class: 'bg-gray-100 text-gray-800' };
}

/**
 * Gets shipping status configuration (text and CSS class)
 */
export function getShippingStatusConfig(status: string | undefined) {
  if (!status) return { text: 'Pendiente', class: 'bg-gray-100 text-gray-800' };
  return SHIPPING_STATUS_CONFIG[status.toLowerCase() as keyof typeof SHIPPING_STATUS_CONFIG] 
    || { text: status, class: 'bg-gray-100 text-gray-800' };
}

/**
 * Gets delivery method configuration (text and CSS class)
 */
export function getDeliveryMethodConfig(method: string | null | undefined) {
  if (!method) return { text: 'No especificado', class: 'bg-gray-100 text-gray-800' };
  return DELIVERY_METHOD_CONFIG[method.toLowerCase() as keyof typeof DELIVERY_METHOD_CONFIG] 
    || { text: method, class: 'bg-gray-100 text-gray-800' };
}

/**
 * Gets payment status text only
 */
export function getPaymentStatusText(status: string | undefined): string {
  return getPaymentStatusConfig(status).text;
}

/**
 * Gets payment status CSS class only
 */
export function getPaymentStatusClass(status: string | undefined): string {
  return getPaymentStatusConfig(status).class;
}

/**
 * Gets shipping status text only
 */
export function getShippingStatusText(status: string | undefined): string {
  return getShippingStatusConfig(status).text;
}

/**
 * Gets shipping status CSS class only
 */
export function getShippingStatusClass(status: string | undefined): string {
  return getShippingStatusConfig(status).class;
}

/**
 * Gets delivery method text only
 */
export function getDeliveryMethodText(method: string | null | undefined): string {
  return getDeliveryMethodConfig(method).text;
}

/**
 * Gets delivery method CSS class only
 */
export function getDeliveryMethodClass(method: string | null | undefined): string {
  return getDeliveryMethodConfig(method).class;
}

/**
 * Legacy compatibility - maps general status to appropriate shipping status
 * Used for backward compatibility when shipping_status is not available
 */
export function mapLegacyStatusToShipping(status: string | undefined): string {
  const mapping: Record<string, string> = {
    'pending': 'pending',
    'pending_payment': 'pending',
    'approved': 'prepared',
    'shipped': 'shipped',
    'delivered': 'delivered',
    'cancelled': 'failed'
  };
  
  return status ? (mapping[status.toLowerCase()] || status) : 'pending';
}