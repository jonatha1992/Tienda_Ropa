// Base user type
export interface User {
  id: number;
  email: string;
  name: string;
  email_verified?: boolean;
  email_verified_at?: string;
}

// Customer type for orders
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

// Customer creation interface
export interface CustomerCreate {
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
