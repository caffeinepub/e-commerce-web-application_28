import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminGuard from '../components/AdminGuard';
import ProductManagementTable from '../components/ProductManagementTable';
import OrderManagementTable from '../components/OrderManagementTable';
import SeedProducts from '../components/SeedProducts';
import { useListProducts } from '../hooks/useQueries';
import { LayoutDashboard, Package, ClipboardList } from 'lucide-react';

export default function AdminDashboard() {
  const { data: products } = useListProducts();
  const hasProducts = (products?.length ?? 0) > 0;

  return (
    <AdminGuard>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <LayoutDashboard size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-primary font-semibold text-sm uppercase tracking-widest">Admin</p>
              <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
            </div>
          </div>
          <p className="text-muted-foreground mt-1">Manage your store's products and orders.</p>
        </div>

        {/* Seed Products Banner (only when no products) */}
        {!hasProducts && (
          <div className="mb-8">
            <SeedProducts />
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="products">
          <TabsList className="mb-6 bg-muted">
            <TabsTrigger value="products" className="flex items-center gap-1.5">
              <Package size={15} />
              Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-1.5">
              <ClipboardList size={15} />
              Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductManagementTable />
          </TabsContent>

          <TabsContent value="orders">
            <OrderManagementTable />
          </TabsContent>
        </Tabs>
      </div>
    </AdminGuard>
  );
}
