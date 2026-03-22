import type { CartItem } from './cartTypes';

const CART_STORAGE_KEY = 'shopping_cart_v1';

export function saveCartToStorage(items: CartItem[]): void {
  try {
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save cart to storage:', error);
  }
}

export function loadCartFromStorage(): CartItem[] {
  try {
    const stored = sessionStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.map(item => ({
      ...item,
      productId: BigInt(item.productId),
    })) : [];
  } catch (error) {
    console.error('Failed to load cart from storage:', error);
    return [];
  }
}

export function clearCartStorage(): void {
  try {
    sessionStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear cart storage:', error);
  }
}
