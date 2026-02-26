import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Package, ShoppingBag } from 'lucide-react';
import { useOrderHistory, useListProducts } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import OrderCard from '../components/OrderCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function OrderHistory() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: orders, isLoading } = useOrderHistory();
  const { data: products } = useListProducts();

  const productNames: Record<string, string> = {};
  products?.forEach(p => {
    productNames[p.id.toString()] = p.name;
  });

  if (!identity) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <Package size={48} className="mx-auto text-muted-foreground mb-4" />
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">Login Required</h2>
        <p className="text-muted-foreground mb-6">Please log in to view your order history.</p>
        <Button onClick={() => navigate({ to: '/' })} variant="outline">Go Home</Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-8">
        <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-1">Account</p>
        <h1 className="font-display text-3xl font-bold text-foreground">My Orders</h1>
        <p className="text-muted-foreground mt-1">
          {isLoading ? 'Loading...' : `${orders?.length ?? 0} order${orders?.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : !orders?.length ? (
        <div className="text-center py-16 bg-muted/30 rounded-xl border border-border">
          <ShoppingBag size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="font-display text-xl font-semibold text-foreground mb-2">No orders yet</h3>
          <p className="text-muted-foreground mb-6">Start shopping to see your orders here.</p>
          <Button
            onClick={() => navigate({ to: '/catalog' })}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Browse Products
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <OrderCard key={order.id.toString()} order={order} productNames={productNames} />
          ))}
        </div>
      )}
    </div>
  );
}
