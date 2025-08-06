export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  images: { image_url: string }[];
  variants: { color: string; size: string; stock: number }[];
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