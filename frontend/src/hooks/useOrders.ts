import { useGetCallerOrders, useGetOrder } from './useQueries';

export function useOrders() {
  const { data: orders = [], isLoading, error } = useGetCallerOrders();

  return {
    orders,
    isLoading,
    error,
  };
}

export function useOrderDetail(orderId: bigint | null) {
  const { data: order, isLoading, error } = useGetOrder(orderId);

  return {
    order,
    isLoading,
    error,
  };
}
