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

// Import the User type for UserRole interface
import { User } from './user.types';
