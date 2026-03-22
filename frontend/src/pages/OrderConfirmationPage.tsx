import { useParams, useNavigate } from '@tanstack/react-router';
import { CheckCircle2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function OrderConfirmationPage() {
  const { orderId } = useParams({ from: '/order-confirmation/$orderId' });
  const navigate = useNavigate();

  return (
    <div className="container py-12 flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle>Order Placed Successfully!</CardTitle>
          <CardDescription>
            Your order has been confirmed and is being prepared.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Order ID</p>
            <p className="text-2xl font-bold font-mono">#{orderId}</p>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            You can track your order status in the My Orders section.
          </p>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={() => navigate({ to: '/' })}>
            Continue Shopping
          </Button>
          <Button className="flex-1" onClick={() => navigate({ to: '/order/$orderId', params: { orderId } })}>
            <Package className="h-4 w-4 mr-2" />
            View Order
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
