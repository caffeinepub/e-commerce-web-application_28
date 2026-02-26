import React, { useState } from 'react';
import { useCreateProduct, useUpdateProduct } from '../hooks/useQueries';
import { Category, type Product } from '../backend';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AddProductFormProps {
  open: boolean;
  onClose: () => void;
  editProduct?: Product | null;
}

const categoryOptions = [
  { value: Category.electronics, label: 'Electronics' },
  { value: Category.clothing, label: 'Clothing' },
  { value: Category.homeKitchen, label: 'Home & Kitchen' },
];

export default function AddProductForm({ open, onClose, editProduct }: AddProductFormProps) {
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const [form, setForm] = useState({
    name: editProduct?.name ?? '',
    description: editProduct?.description ?? '',
    category: editProduct?.category ?? Category.electronics,
    priceUsd: editProduct ? (Number(editProduct.priceUsd) / 100).toFixed(2) : '',
    stockQty: editProduct ? editProduct.stockQty.toString() : '',
    imageUrl: editProduct ? editProduct.image.url : '',
  });

  React.useEffect(() => {
    if (editProduct) {
      setForm({
        name: editProduct.name,
        description: editProduct.description,
        category: editProduct.category,
        priceUsd: (Number(editProduct.priceUsd) / 100).toFixed(2),
        stockQty: editProduct.stockQty.toString(),
        imageUrl: editProduct.image.url,
      });
    } else {
      setForm({ name: '', description: '', category: Category.electronics, priceUsd: '', stockQty: '', imageUrl: '' });
    }
  }, [editProduct, open]);

  const isEditing = !!editProduct;
  const isPending = createProduct.isPending || updateProduct.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceInCents = BigInt(Math.round(parseFloat(form.priceUsd) * 100));
    const stockQty = BigInt(parseInt(form.stockQty, 10));

    if (isEditing && editProduct) {
      await updateProduct.mutateAsync({
        id: editProduct.id,
        name: form.name,
        description: form.description,
        category: form.category,
        priceUsd: priceInCents,
        stockQty,
        imageUrl: form.imageUrl,
      });
    } else {
      await createProduct.mutateAsync({
        name: form.name,
        description: form.description,
        category: form.category,
        priceUsd: priceInCents,
        stockQty,
        imageUrl: form.imageUrl,
      });
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Wireless Headphones"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Product description..."
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm(f => ({ ...f, category: v as Category }))}
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (USD) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={form.priceUsd}
                onChange={(e) => setForm(f => ({ ...f, priceUsd: e.target.value }))}
                placeholder="29.99"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock">Stock Quantity *</Label>
            <Input
              id="stock"
              type="number"
              min="0"
              value={form.stockQty}
              onChange={(e) => setForm(f => ({ ...f, stockQty: e.target.value }))}
              placeholder="100"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL *</Label>
            <Input
              id="imageUrl"
              type="url"
              value={form.imageUrl}
              onChange={(e) => setForm(f => ({ ...f, imageUrl: e.target.value }))}
              placeholder="https://example.com/image.jpg"
              required
            />
            {form.imageUrl && (
              <div className="mt-2 w-20 h-20 rounded-lg overflow-hidden border border-border">
                <img
                  src={form.imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = 'https://placehold.co/80x80/f5f0e8/8b7355?text=?'; }}
                />
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </span>
              ) : (
                isEditing ? 'Update Product' : 'Create Product'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
