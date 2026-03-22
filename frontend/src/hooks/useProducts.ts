import { useGetAllProducts } from './useQueries';
import type { Product } from '../backend';

export function useProducts() {
  const { data: products = [], isLoading, error } = useGetAllProducts();

  const getProductById = (id: bigint): Product | undefined => {
    return products.find((p) => p.id === id);
  };

  return {
    products,
    isLoading,
    error,
    getProductById,
  };
}
