
export interface Product {
  id: number;
  name: string;
  brand: string;
  description: string;
  price: number;
  image_url: string;
  category_id: number;
  stock: number;
  notes_top: string;
  notes_middle: string;
  notes_base: string;
  created_at?: string;
  zoho_item_id?: string;
  zoho_raw?: any;
  category_name?: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  image_url: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
