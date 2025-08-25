export interface Color {
  id: number;
  name: string;
  hex_code: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ColorCreate {
  name: string;
  hex_code: string;
  is_active?: boolean;
}

export interface ColorUpdate {
  name?: string;
  hex_code?: string;
  is_active?: boolean;
}

export interface ColorResponse {
  id: number;
  name: string;
  hex_code: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
