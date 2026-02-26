import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Package } from 'lucide-react';
import { useListProducts, useDeleteProduct } from '../hooks/useQueries';
import { Category, type Product } from '../backend';
import AddProductForm from './AddProductForm';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const categoryLabels: Record<Category, string> = {
  [Category.electronics]: 'Electronics',
  [Category.clothing]: 'Clothing',
  [Category.homeKitchen]: 'Home & Kitchen',
};

function formatPrice(cents: bigint): string {
  return `$${(Number(cents) / 100).toFixed(2)}`;
}

export default function ProductManagementTable() {
  const { data: products, isLoading } = useListProducts();
  const deleteProduct = useDeleteProduct();
  const [formOpen, setFormOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setFormOpen(true);
  };

  const handleAdd = () => {
    setEditProduct(null);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    await deleteProduct.mutateAsync(deleteId);
    setDeleteId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-foreground">Products ({products?.length ?? 0})</h3>
        <Button onClick={handleAdd} className="bg-primary text-primary-foreground hover:bg-primary/90" size="sm">
          <Plus size={15} className="mr-1.5" />
          Add Product
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : !products?.length ? (
        <div className="text-center py-12 bg-muted/30 rounded-xl border border-border">
          <Package size={40} className="mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground font-medium">No products yet</p>
          <p className="text-sm text-muted-foreground mt-1">Click "Add Product" to create your first product</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-16">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="hidden md:table-cell">Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id.toString()} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted">
                      <img
                        src={product.image.url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = 'https://placehold.co/40x40/f5f0e8/8b7355?text=?'; }}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-sm text-foreground">{product.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{product.description}</p>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant="secondary" className="text-xs">
                      {categoryLabels[product.category] ?? product.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-primary">
                    {formatPrice(product.priceUsd)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className={`text-sm font-medium ${product.stockQty > 0 ? 'text-success' : 'text-destructive'}`}>
                      {product.stockQty.toString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => handleEdit(product)}
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => setDeleteId(product.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AddProductForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditProduct(null); }}
        editProduct={editProduct}
      />

      <AlertDialog open={deleteId !== null} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteProduct.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
