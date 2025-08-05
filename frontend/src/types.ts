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