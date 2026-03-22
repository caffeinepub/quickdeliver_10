import { useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Search, ShoppingCart, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { toast } from 'sonner';

export default function StorefrontPage() {
  const navigate = useNavigate();
  const { products, isLoading } = useProducts();
  const { addItem } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return ['all', ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const handleAddToCart = (product: typeof products[0]) => {
    addItem({
      productId: product.id,
      name: product.name,
      unitPrice: product.price,
      imageUrl: product.imageUrl,
    });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 border-b">
        <div className="container py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Fresh Groceries
                <br />
                <span className="text-primary">Delivered Fast</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-md">
                Order your favorite meals and groceries. Get them delivered to your doorstep in minutes.
              </p>
              <div className="flex gap-4">
                <Button size="lg" onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}>
                  Start Shopping
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="/assets/generated/store-hero.dim_1600x600.png"
                alt="Shopping and Delivery"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="container py-12">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No products found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id.toString()} className="flex flex-col hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="aspect-square bg-muted rounded-md mb-3 flex items-center justify-center overflow-hidden">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <ShoppingCart className="h-12 w-12 text-muted-foreground" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
                      <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
                      {product.availability ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          In Stock
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          Out of Stock
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => navigate({ to: '/product/$productId', params: { productId: product.id.toString() } })}
                    >
                      View Details
                    </Button>
                    <Button
                      className="flex-1"
                      disabled={!product.availability}
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
