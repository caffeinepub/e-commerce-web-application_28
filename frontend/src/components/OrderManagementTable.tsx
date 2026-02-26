import React from 'react';
import { useListAllOrders, useUpdateOrderStatus } from '../hooks/useQueries';
import { Status } from '../backend';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ClipboardList } from 'lucide-react';

const statusConfig: Record<Status, { label: string; className: string }> = {
  [Status.pending]: { label: 'Pending', className: 'bg-warning/20 text-warning-foreground border-warning/30' },
  [Status.processing]: { label: 'Processing', className: 'bg-blue-100 text-blue-800 border-blue-200' },
  [Status.shipped]: { label: 'Shipped', className: 'bg-purple-100 text-purple-800 border-purple-200' },
  [Status.delivered]: { label: 'Delivered', className: 'bg-success/20 text-success border-success/30' },
  [Status.cancelled]: { label: 'Cancelled', className: 'bg-destructive/10 text-destructive border-destructive/20' },
};

const statusOptions = [
  { value: Status.pending, label: 'Pending' },
  { value: Status.processing, label: 'Processing' },
  { value: Status.shipped, label: 'Shipped' },
  { value: Status.delivered, label: 'Delivered' },
  { value: Status.cancelled, label: 'Cancelled' },
];

function formatPrice(cents: bigint): string {
  return `$${(Number(cents) / 100).toFixed(2)}`;
}

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp / BigInt(1_000_000));
  return new Date(ms).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function OrderManagementTable() {
  const { data: orders, isLoading } = useListAllOrders();
  const updateStatus = useUpdateOrderStatus();

  const handleStatusChange = (orderId: bigint, status: Status) => {
    updateStatus.mutate({ id: orderId, status });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-foreground">
          All Orders ({orders?.length ?? 0})
        </h3>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : !orders?.length ? (
        <div className="text-center py-12 bg-muted/30 rounded-xl border border-border">
          <ClipboardList size={40} className="mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground font-medium">No orders yet</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Order ID</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead className="hidden md:table-cell">Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const sc = statusConfig[order.status];
                return (
                  <TableRow key={order.id.toString()} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-sm font-medium">
                      #{order.id.toString()}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="text-xs font-mono text-muted-foreground">
                        {order.userId.toString().slice(0, 12)}...
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </TableCell>
                    <TableCell className="font-semibold text-primary">
                      {formatPrice(order.totalAmount)}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(v) => handleStatusChange(order.id, v as Status)}
                        disabled={updateStatus.isPending}
                      >
                        <SelectTrigger className={`h-7 text-xs w-32 border font-medium ${sc.className}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map(opt => (
                            <SelectItem key={opt.value} value={opt.value} className="text-xs">
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
