export interface CartItem {
  productId: bigint;
  name: string;
  unitPrice: number;
  quantity: number;
  imageUrl?: string;
}

export interface CartState {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}
