// Order related types and interfaces

// Payment types
export type PaymentMethod = 'credit_card' | 'debit_card' | 'mercadopago' | 'bank_transfer' | 'cash' | 'other' | 'transfer';
export type PaymentStatus = 'pending' | 'approved' | 'in_process' | 'rejected' | 'refunded' | 'cancelled' | 'in_mediation' | 'charged_back' | 'pending_payment';

// Payment related interfaces
export interface PaymentPreference {
  preference_id: string;
  init_point: string;
  sandbox_init_point?: string;
  order_id: number;
}

export interface PaymentStatusResponse {
  order_id: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  mercadopago_payment_id?: string;
  mercadopago_preference_id?: string;
  total: number;
  mercadopago_details?: {
    status: string;
    status_detail: string;
    payment_method_id: string;
    payment_type_id: string;
    date_created: string;
    date_approved?: string;
  };
}

export interface TransferInfo {
  order_id: number;
  bank_info: {
    bank_name: string;
    account_type: string;
    account_number: string;
    cbu: string;
    alias: string;
    holder_name: string;
    cuit: string;
  };
  total_amount: number;
  reference: string;
  instructions: string[];
}

export interface DeliveryInfo {
  order_id: number;
  delivery_info: {
    zone_code: string;
    zone_name: string;
    zone_description: string;
    cost: number;
    original_cost: number;
    estimated_days: string;
    free_threshold: number;
    is_free: boolean;
    savings: number;
  };
  original_total: number;
  delivery_cost: number;
  final_total: number;
  customer_address: string;
  estimated_delivery: string;
  instructions: string[];
}

export interface OrderResponse {
  order: Order;
  payment_preference?: PaymentPreference;
  transfer_info?: TransferInfo;
  delivery_info?: DeliveryInfo;
  payment_error?: string;
}

export interface AdminOrderFilters {
  payment_method?: string;
  payment_status?: string;
  verification_required?: boolean | string;
  delivery_status?: string;
}

export interface AdminStats {
  pending_verification: number;
  pending_delivery: number;
  scheduled_delivery: number;
  total_pending_amount: number;
  orders_by_method: Record<PaymentMethod, number>;
  last_updated: string;
}

// Order related interfaces
export interface Order {
  // Campos requeridos
  order_id: number;
  status: string;
  shipping_status: string;
  customer_name: string;
  customer_email: string;
  shipping_address: string;
  total: number;
  payment_method: string | PaymentMethod;
  
  // Campos opcionales que pueden ser string, null o undefined
  shipping_method?: string | null;
  tracking_number?: string | null;
  shipping_provider?: string | null;
  estimated_delivery?: string | null;
  customer_phone?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at?: string | null;
  shipped_at?: string | null;
  delivery_method?: string | null;
  provider_name?: string | null;
  
  // Campos para el estado del pago
  payment_status?: PaymentStatus;
  mercadopago_payment_id?: string;
  mercadopago_preference_id?: string;
  
  // Campos para envío
  delivery_cost?: number;
  delivery_zone?: string;
  delivery_notes?: string;
  
  // Campos para verificación
  verification_required?: boolean;
  verified_by_admin?: boolean;
  admin_verification_date?: string;
  
  // Campos calculados con valores predeterminados
  can_add_tracking?: boolean;
  can_mark_shipped?: boolean;
  can_coordinate_pickup?: boolean;
  
  // Relaciones
  items?: OrderItem[];
  customer?: Customer;
  
  // Para propiedades adicionales que puedan venir de la API
  [key: string]: any;
}

export interface OrderItem {
  id?: number;
  order_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  variant_id?: number;
  color_id?: number;
  size_id?: number;
  color_name?: string;
  size_name?: string;
  image_url?: string;
  product?: {
    id: number;
    name: string;
    description: string;
    price: number;
    images: Array<{ id: number; image_url: string }>;
  };
}

export interface Customer {
  id: number;
  name: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  province?: string;
  country?: string;
  address_reference?: string;
  delivery_notes?: string;
  preferred_delivery_time?: string;
}

export interface ShippingProvider {
  id: string;
  name: string;
  code: string;
  tracking_url?: string;
}

export interface OrderStatistics {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  revenue: number;
  // Propiedades adicionales usadas en el componente
  pending_shipment?: number;
  shipped_orders?: number;
  shipping_rate_percent?: number;
  avg_processing_hours?: number;
  [key: string]: number | undefined; // Para permitir propiedades dinámicas
}

// Tipos para los filtros de búsqueda
export interface OrderFilters {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// Tipo para la respuesta paginada de órdenes
export interface PaginatedOrders {
  data: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
