import React from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { CheckCircle, Package, ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OrderSuccess() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/order-success' });
  const orderId = (search as { orderId?: string }).orderId;

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="w-20 h-20 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={40} className="text-success" />
      </div>

      <h1 className="font-display text-3xl font-bold text-foreground mb-3">
        Order Placed Successfully!
      </h1>
      <p className="text-muted-foreground mb-2">
        Thank you for your purchase. Your order has been confirmed.
      </p>
      {orderId && (
        <div className="inline-flex items-center gap-2 bg-muted rounded-lg px-4 py-2 mt-2 mb-8">
          <Package size={16} className="text-primary" />
          <span className="text-sm font-medium text-foreground">Order #{orderId}</span>
        </div>
      )}

      <div className="bg-card rounded-xl border border-border shadow-card p-5 mb-8 text-left space-y-3">
        <h3 className="font-semibold text-foreground text-sm">What's next?</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">1</span>
            <span>Your order is being processed and will be shipped soon.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">2</span>
            <span>Track your order status in the "My Orders" section.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">3</span>
            <span>Contact support if you have any questions about your order.</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          onClick={() => navigate({ to: '/orders' })}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Package size={16} className="mr-2" />
          View My Orders
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate({ to: '/catalog' })}
        >
          <ShoppingBag size={16} className="mr-2" />
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}
