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

export interface Color {
  id: number;
  name: string;
  hex_code: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  slug?: string;
  parent_id?: number | null;
  order?: number;
}

export interface Size {
  id: number;
  name: string;
  code: string;
  description?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  numeric_size?: number;  // Añadido para compatibilidad
  order?: number;
  type?: string;
}

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
