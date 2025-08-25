import { PaymentMethod, PaymentStatus } from './payment';

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
