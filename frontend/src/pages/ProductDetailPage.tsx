import { useNavigate, useParams } from '@tanstack/react-router';
import { ArrowLeft, ShoppingCart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { productId } = useParams({ from: '/product/$productId' });
  const { getProductById, isLoading } = useProducts();
  const { addItem } = useCart();

  const product = getProductById(BigInt(productId));

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      productId: product.id,
      name: product.name,
      unitPrice: product.price,
      imageUrl: product.imageUrl,
    });
    toast.success(`${product.name} added to cart`);
  };

  if (isLoading) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Product Not Found</CardTitle>
            <CardDescription>The product you're looking for doesn't exist.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate({ to: '/' })}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shop
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Shop
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <ShoppingCart className="h-24 w-24 text-muted-foreground" />
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <Badge variant={product.availability ? 'outline' : 'destructive'} className={product.availability ? 'bg-green-50 text-green-700 border-green-200' : ''}>
              {product.availability ? 'In Stock' : 'Out of Stock'}
            </Badge>
          </div>

          <Separator />

          <div>
            <h2 className="text-sm font-medium text-muted-foreground mb-2">Description</h2>
            <p className="text-foreground">{product.description}</p>
          </div>

          <div>
            <h2 className="text-sm font-medium text-muted-foreground mb-2">Category</h2>
            <Badge variant="secondary">{product.category}</Badge>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="text-4xl font-bold">${product.price.toFixed(2)}</p>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full"
            disabled={!product.availability}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
