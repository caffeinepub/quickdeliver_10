import { useNavigate } from '@tanstack/react-router';
import { Package, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOrders } from '../hooks/useOrders';
import { useAuthz } from '../hooks/useAuthz';
import AccessDeniedScreen from '../components/common/AccessDeniedScreen';
import { OrderStatus } from '../backend';

const statusLabels: Record<OrderStatus, string> = {
  [OrderStatus.placed]: 'Placed',
  [OrderStatus.preparing]: 'Preparing',
  [OrderStatus.outForDelivery]: 'Out for Delivery',
  [OrderStatus.delivered]: 'Delivered',
  [OrderStatus.cancelled]: 'Cancelled',
};

const statusVariants: Record<OrderStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  [OrderStatus.placed]: 'secondary',
  [OrderStatus.preparing]: 'default',
  [OrderStatus.outForDelivery]: 'default',
  [OrderStatus.delivered]: 'outline',
  [OrderStatus.cancelled]: 'destructive',
};

export default function MyOrdersPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthz();
  const { orders, isLoading } = useOrders();

  if (!isAuthenticated) {
    return <AccessDeniedScreen />;
  }

  if (isLoading) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle>No orders yet</CardTitle>
            <CardDescription>
              You haven't placed any orders. Start shopping to see your orders here.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button onClick={() => navigate({ to: '/' })}>
              Browse Products
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => {
          const orderDate = new Date(Number(order.createdAt) / 1000000);
          const itemCount = order.items.reduce((sum, item) => sum + Number(item.quantity), 0);
          const total = order.items.reduce((sum, item) => sum + item.unitPriceSnapshot * Number(item.quantity), 0);

          return (
            <Card key={order.orderId.toString()} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Order #{order.orderId.toString()}</CardTitle>
                    <CardDescription>
                      {orderDate.toLocaleDateString()} at {orderDate.toLocaleTimeString()}
                    </CardDescription>
                  </div>
                  <Badge variant={statusVariants[order.status]}>
                    {statusLabels[order.status]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Items</span>
                    <span className="font-medium">{itemCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-semibold">${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate({ to: '/order/$orderId', params: { orderId: order.orderId.toString() } })}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
