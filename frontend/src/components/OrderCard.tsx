import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Package, Clock } from 'lucide-react';
import { type Order, Status } from '../backend';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface OrderCardProps {
  order: Order;
  productNames?: Record<string, string>;
}

const statusConfig: Record<Status, { label: string; className: string }> = {
  [Status.pending]: { label: 'Pending', className: 'bg-warning/20 text-warning-foreground border-warning/30' },
  [Status.processing]: { label: 'Processing', className: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300' },
  [Status.shipped]: { label: 'Shipped', className: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300' },
  [Status.delivered]: { label: 'Delivered', className: 'bg-success/20 text-success border-success/30' },
  [Status.cancelled]: { label: 'Cancelled', className: 'bg-destructive/10 text-destructive border-destructive/20' },
};

function formatPrice(cents: bigint): string {
  return `$${(Number(cents) / 100).toFixed(2)}`;
}

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp / BigInt(1_000_000));
  return new Date(ms).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function OrderCard({ order, productNames = {} }: OrderCardProps) {
  const [expanded, setExpanded] = useState(false);
  const status = statusConfig[order.status] ?? { label: String(order.status), className: 'bg-muted text-muted-foreground' };

  return (
    <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Package size={18} className="text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">
                Order #{order.id.toString()}
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <Clock size={11} />
                {formatDate(order.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${status.className}`}>
              {status.label}
            </span>
            <p className="font-bold text-primary text-base">{formatPrice(order.totalAmount)}</p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground"
          >
            {expanded ? (
              <><ChevronUp size={14} className="mr-1" /> Hide Details</>
            ) : (
              <><ChevronDown size={14} className="mr-1" /> View Details</>
            )}
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-border bg-muted/30 px-4 sm:px-5 py-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Order Items</p>
          <div className="space-y-2">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">
                    {item.quantity.toString()}
                  </span>
                  <span className="text-foreground">
                    {productNames[item.productId.toString()] ?? `Product #${item.productId.toString()}`}
                  </span>
                </div>
                <span className="text-muted-foreground font-medium">
                  {formatPrice(item.unitPrice * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-border flex justify-between font-semibold text-sm">
            <span>Total</span>
            <span className="text-primary">{formatPrice(order.totalAmount)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
