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
