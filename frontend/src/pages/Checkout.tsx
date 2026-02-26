import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ShoppingBag, LogIn, ArrowLeft, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { usePlaceOrder } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

function formatPrice(cents: bigint): string {
  return `$${(Number(cents) / 100).toFixed(2)}`;
}

export default function Checkout() {
  const { items, getTotal, clearCart } = useCart();
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const navigate = useNavigate();
  const placeOrder = usePlaceOrder();
  const isAuthenticated = !!identity;

  const handleConfirmOrder = async () => {
    if (!isAuthenticated || items.length === 0) return;
    try {
      const cartItems = items.map(item => ({
        productId: item.productId,
        quantity: BigInt(item.quantity),
      }));
      const order = await placeOrder.mutateAsync(cartItems);
      clearCart();
      navigate({ to: '/order-success', search: { orderId: order.id.toString() } });
    } catch (err) {
      console.error('Order failed:', err);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <ShoppingBag size={48} className="mx-auto text-muted-foreground mb-4" />
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Add some products before checking out.</p>
        <Button onClick={() => navigate({ to: '/catalog' })} className="bg-primary text-primary-foreground">
          Browse Products
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <button
        onClick={() => navigate({ to: '/catalog' })}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft size={15} />
        Continue Shopping
      </button>

      <h1 className="font-display text-3xl font-bold text-foreground mb-8">Checkout</h1>

      {/* Order Summary */}
      <div className="bg-card rounded-xl border border-border shadow-card p-5 sm:p-6 mb-6">
        <h2 className="font-semibold text-foreground mb-4">Order Summary</h2>
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.productId.toString()} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = 'https://placehold.co/48x48/f5f0e8/8b7355?text=?'; }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatPrice(item.priceUsd)} × {item.quantity}
                </p>
              </div>
              <p className="font-semibold text-sm text-foreground shrink-0">
                {formatPrice(item.priceUsd * BigInt(item.quantity))}
              </p>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
            <span>{formatPrice(getTotal())}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Shipping</span>
            <span className="text-success font-medium">Free</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-foreground text-lg">
            <span>Total</span>
            <span className="text-primary">{formatPrice(getTotal())}</span>
          </div>
        </div>
      </div>

      {/* Auth Gate */}
      {!isAuthenticated ? (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 text-center space-y-3">
          <LogIn size={28} className="mx-auto text-primary" />
          <p className="font-semibold text-foreground">Login to Complete Your Order</p>
          <p className="text-sm text-muted-foreground">You need to be logged in to place an order.</p>
          <Button
            onClick={login}
            disabled={isLoggingIn}
            className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
          >
            {isLoggingIn ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Logging in...
              </span>
            ) : (
              <>
                <LogIn size={16} className="mr-2" />
                Login to Continue
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-success/10 border border-success/20 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle size={18} className="text-success shrink-0" />
            <p className="text-sm text-foreground">
              Logged in as <span className="font-medium">{identity.getPrincipal().toString().slice(0, 16)}...</span>
            </p>
          </div>

          {placeOrder.isError && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4">
              <p className="text-sm text-destructive font-medium">
                Failed to place order. Please try again.
              </p>
            </div>
          )}

          <Button
            onClick={handleConfirmOrder}
            disabled={placeOrder.isPending}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-12 text-base"
          >
            {placeOrder.isPending ? (
              <span className="flex items-center gap-2">
                <span className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Placing Order...
              </span>
            ) : (
              <>
                <CheckCircle size={18} className="mr-2" />
                Confirm Order — {formatPrice(getTotal())}
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
