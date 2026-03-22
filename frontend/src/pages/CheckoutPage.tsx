import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCart } from '../hooks/useCart';
import { useCreateOrder } from '../hooks/useQueries';
import { useAuthz } from '../hooks/useAuthz';
import { toast } from 'sonner';
import AccessDeniedScreen from '../components/common/AccessDeniedScreen';
import type { LineItem } from '../backend';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const { isAuthenticated } = useAuthz();
  const createOrder = useCreateOrder();
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [errors, setErrors] = useState<{ address?: string; phone?: string }>({});

  if (!isAuthenticated) {
    return <AccessDeniedScreen />;
  }

  if (items.length === 0) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Your cart is empty</CardTitle>
            <CardDescription>Add items to your cart before checking out.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate({ to: '/' })}>Browse Products</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors: { address?: string; phone?: string } = {};
    
    if (!deliveryAddress.trim()) {
      newErrors.address = 'Delivery address is required';
    }
    
    if (!contactPhone.trim()) {
      newErrors.phone = 'Contact phone is required';
    } else if (!/^\+?[\d\s\-()]+$/.test(contactPhone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const lineItems: LineItem[] = items.map((item) => ({
      productId: item.productId,
      nameSnapshot: item.name,
      unitPriceSnapshot: item.unitPrice,
      quantity: BigInt(item.quantity),
    }));

    try {
      const orderId = await createOrder.mutateAsync({
        items: lineItems,
        deliveryAddress: deliveryAddress.trim(),
        contactPhone: contactPhone.trim(),
      });
      
      clearCart();
      toast.success('Order placed successfully!');
      navigate({ to: '/order-confirmation/$orderId', params: { orderId: orderId.toString() } });
    } catch (error: any) {
      console.error('Order creation failed:', error);
      toast.error(error.message || 'Failed to place order. Please try again.');
    }
  };

  return (
    <div className="container py-8">
      <Button variant="ghost" onClick={() => navigate({ to: '/cart' })} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Cart
      </Button>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Information</CardTitle>
              <CardDescription>Enter your delivery details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Delivery Address *</Label>
                  <Input
                    id="address"
                    value={deliveryAddress}
                    onChange={(e) => {
                      setDeliveryAddress(e.target.value);
                      if (errors.address) setErrors({ ...errors, address: undefined });
                    }}
                    placeholder="123 Main St, Apt 4B, City, State 12345"
                    disabled={createOrder.isPending}
                  />
                  {errors.address && (
                    <p className="text-sm text-destructive">{errors.address}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Contact Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => {
                      setContactPhone(e.target.value);
                      if (errors.phone) setErrors({ ...errors, phone: undefined });
                    }}
                    placeholder="+1 (555) 123-4567"
                    disabled={createOrder.isPending}
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone}</p>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.productId.toString()} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-2xl font-bold">${subtotal.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                size="lg"
                onClick={handleSubmit}
                disabled={createOrder.isPending}
              >
                {createOrder.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  'Place Order'
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
