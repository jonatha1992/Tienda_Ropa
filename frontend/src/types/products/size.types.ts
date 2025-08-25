export interface Size {
  id: number;
  name: string;
  code: string;
  description?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  numeric_size?: number;
  order?: number;
  type?: string;
}

export interface SizeCreate {
  name: string;
  code: string;
  description?: string;
  is_active?: boolean;
  numeric_size?: number;
  order?: number;
  type?: string;
}

export interface SizeUpdate {
  name?: string;
  code?: string;
  description?: string;
  is_active?: boolean;
  numeric_size?: number;
  order?: number;
  type?: string;
}

export interface SizeResponse {
  id: number;
  name: string;
  code: string;
  description: string | null;
  is_active: boolean;
  numeric_size: number | null;
  order: number | null;
  type: string | null;
  created_at: string;
  updated_at: string;
}
