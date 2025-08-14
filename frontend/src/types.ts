// Product interfaces
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  genero?: string;
  estado?: string;
  categoria?: string;
  edad_destino?: string;
  is_unique: boolean;
  color?: string | null;
  talle?: string | null;
  stock?: number | null;
  is_new?: boolean;
  is_sale?: boolean;
  original_price?: number;
  created_at?: string;
  images: ProductImage[];
  variants: ProductVariant[];
}

export interface ProductImage {
  id: number;
  image_url: string;
}

export interface ProductVariant {
  id?: number;
  color: string;
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