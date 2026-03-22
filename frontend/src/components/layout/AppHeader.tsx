import { Link, useNavigate } from '@tanstack/react-router';
import { ShoppingCart, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LoginButton from '../auth/LoginButton';
import { useCart } from '../../hooks/useCart';
import { useCurrentUserProfile } from '../../hooks/useCurrentUserProfile';
import { useAuthz } from '../../hooks/useAuthz';

export default function AppHeader() {
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { userProfile } = useCurrentUserProfile();
  const { isAuthenticated } = useAuthz();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img
              src="/assets/generated/shop-logo.dim_512x512.png"
              alt="Shop Logo"
              className="h-10 w-10 object-contain"
            />
            <span className="text-xl font-bold text-foreground">QuickShop</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Shop
            </Link>
            {isAuthenticated && (
              <Link
                to="/my-orders"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
              >
                <Package className="h-4 w-4" />
                My Orders
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated && userProfile && (
            <span className="hidden sm:inline text-sm text-muted-foreground">
              Hello, <span className="font-medium text-foreground">{userProfile.name}</span>
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => navigate({ to: '/cart' })}
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {itemCount}
              </Badge>
            )}
          </Button>
          <LoginButton />
        </div>
      </div>
    </header>
  );
}
