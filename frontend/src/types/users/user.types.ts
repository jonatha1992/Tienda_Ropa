import type { Role } from './role.types';

// Base user type
export interface User {
  id: number;
  email: string;
  name: string;
  email_verified?: boolean;
  email_verified_at?: string;
}

// User with roles (extends base User)
export interface UserWithRoles extends User {
  roles?: Role[];
}

// User creation data
export interface UserCreateData {
  email: string;
  password: string;
  name: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role_id?: number;
}

// User update data
export interface UserUpdateData {
  email?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  current_password?: string;
  new_password?: string;
  email_verified?: boolean;
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
