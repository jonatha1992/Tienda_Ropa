// Product interfaces
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  is_new?: boolean;
  is_sale?: boolean;
  genero?: string;
  estado?: string;
  categoria?: string;
  edad_destino?: string;
  is_unique: boolean;
  color?: string | null;
  talle?: string | null;
  stock?: number | null;
  has_discount: boolean;
  discount_percentage?: number | null;
  discounted_price?: number;
  discount_amount?: number;
  images: ProductImage[];
  variants: ProductVariant[];
}

export interface ProductImage {
  id: number;
  image_url: string;
}

export interface ProductVariant {
  id?: number;
  color_id: number;
  size_id: number;
  image_url: string;
  size: string;
  stock: number;
}

// Master data interfaces
export interface Color {
  id: number;
  name: string;
  hex_code: string;
  is_active: boolean;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
}

export interface Size {
  id: number;
  name: string;
  numeric_size?: number;
  order?: number;
  is_active: boolean;
}

// User type definition (debe coincidir con el modelo UserRead del backend)
export type User = {
  id: number
  email: string
  name: string
}

// Role types
export type RoleType = "admin" | "manager" | "employee" | "user";

export const ROLE_TYPES = {
  ADMIN: "admin" as const,
  MANAGER: "manager" as const,
  EMPLOYEE: "employee" as const,
  USER: "user" as const
} as const;

export interface Role {
  id: number;
  name: RoleType;
  description?: string;
  is_active: boolean;
}

export interface UserRole {
  id: number;
  user_id: number;
  role_id: number;
  assigned_at: string;
  assigned_by?: number;
  is_active: boolean;
  user?: User;
  role?: Role;
}

export interface UserWithRoles extends User {
  roles?: Role[];
}

// Payment interfaces
export type PaymentMethod = "transfer" | "mercadopago" | "cash";
export type PaymentStatus = "pending" | "pending_payment" | "approved" | "rejected" | "cancelled";

export interface Order {
  id: number;
  customer_id: number;
  status?: string;
  total: number;
  created_at?: string;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  mercadopago_payment_id?: string;
  mercadopago_preference_id?: string;
}

export interface Customer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

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

// Order item interface
export interface OrderItem {
  id?: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
}

// Customer creation interface
export interface CustomerCreate {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}