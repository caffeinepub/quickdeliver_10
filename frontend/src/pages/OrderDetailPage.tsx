import { useParams, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Loader2, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useOrderDetail } from '../hooks/useOrders';
import { useAuthz } from '../hooks/useAuthz';
import AccessDeniedScreen from '../components/common/AccessDeniedScreen';
import OrderStatusTimeline from '../components/orders/OrderStatusTimeline';

export default function OrderDetailPage() {
  const { orderId } = useParams({ from: '/order/$orderId' });
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthz();
  const { order, isLoading, error } = useOrderDetail(orderId ? BigInt(orderId) : null);

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

  if (error || !order) {
    return (
      <div className="container py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Order Not Found</CardTitle>
            <CardDescription>
              {error
                ? 'You do not have permission to view this order.'
                : "The order you're looking for doesn't exist."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate({ to: '/my-orders' })}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Orders
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const orderDate = new Date(Number(order.createdAt) / 1000000);
  const total = order.items.reduce((sum, item) => sum + item.unitPriceSnapshot * Number(item.quantity), 0);

  return (
    <div className="container py-8">
      <Button variant="ghost" onClick={() => navigate({ to: '/my-orders' })} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to My Orders
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order #{order.orderId.toString()}</CardTitle>
              <CardDescription>
                Placed on {orderDate.toLocaleDateString()} at {orderDate.toLocaleTimeString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-3">Order Items</h3>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.nameSnapshot}</p>
                        <p className="text-sm text-muted-foreground">
                          ${item.unitPriceSnapshot.toFixed(2)} × {item.quantity.toString()}
                        </p>
                      </div>
                      <p className="font-semibold">
                        ${(item.unitPriceSnapshot * Number(item.quantity)).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="font-semibold">Total</span>
                <span className="text-2xl font-bold">${total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Delivery Address</p>
                  <p className="text-foreground">{order.deliveryAddress}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Phone className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Contact Phone</p>
                  <p className="text-foreground">{order.contactPhone}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderStatusTimeline currentStatus={order.status} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
