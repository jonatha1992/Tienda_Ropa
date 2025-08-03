export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  images: { image_url: string }[];
  variants: { color: string; size: string; stock: number }[];
}
