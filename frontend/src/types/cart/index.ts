// Cart type definitions
export interface CartItem {
  id: number
  product_id: number
  product_name: string
  product_variant_id?: number
  color?: string
  size?: string
  quantity: number
  price: number
  image_url?: string
}

export interface Cart {
  items: CartItem[]
  total: number
  itemCount: number
}

export type CartState = Cart