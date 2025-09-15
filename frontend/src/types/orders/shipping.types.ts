export interface ShippingProvider {
  id: string;  // Cambiado de number a string
  name: string;
  code: string;
  tracking_url?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ShippingMethod {
  id: number;
  name: string;
  code: string;
  description?: string;
  is_active: boolean;
  estimated_days_min: number;
  estimated_days_max: number;
  price: number;
  free_shipping_threshold?: number;
  provider_id: number;
  provider?: ShippingProvider;
  created_at?: string;
  updated_at?: string;
}

export interface ShippingZone {
  id: number;
  name: string;
  code: string;
  description?: string;
  is_active: boolean;
  countries: string[];
  states?: string[];
  postal_codes?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface ShippingRate {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
  price: number;
  min_order_amount?: number;
  max_order_amount?: number;
  min_weight?: number;
  max_weight?: number;
  shipping_method_id: number;
  shipping_method?: ShippingMethod;
  zone_id: number;
  zone?: ShippingZone;
  created_at?: string;
  updated_at?: string;
}

// Tipos para cotizaciones dinámicas de envío
export interface ShippingQuoteRequest {
  postal_code: string;
  city?: string;
  province?: string;
  total_weight_kg: number;
  include_fallback?: boolean;
}

export interface ShippingQuoteOption {
  carrier: string;
  name: string;
  price: number;
  currency: string;
  estimated_days?: number;
  estimated_delivery_text: string;
  service_type?: string;
  has_error: boolean;
  error_message?: string;
}

export interface ShippingQuoteResponse {
  success: boolean;
  postal_code: string;
  total_weight_kg: number;
  options: ShippingQuoteOption[];
  message?: string;
  api_available: boolean;
}

export interface CarrierInfo {
  code: string;
  name: string;
  description: string;
  estimated_days: number;
}
