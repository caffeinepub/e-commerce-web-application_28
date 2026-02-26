import React, { useState } from 'react';
import { ShoppingCart, CheckCircle, Package } from 'lucide-react';
import { type Product, Category } from '../backend';
import { useCart } from '../context/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
}

const categoryLabels: Record<Category, string> = {
  [Category.electronics]: 'Electronics',
  [Category.clothing]: 'Clothing',
  [Category.homeKitchen]: 'Home & Kitchen',
};

function formatPrice(cents: bigint): string {
  return `$${(Number(cents) / 100).toFixed(2)}`;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, items } = useCart();
  const [added, setAdded] = useState(false);

  const inCart = items.some(i => i.productId === product.id);
  const inStock = product.stockQty > BigInt(0);

  const imageUrl = product.image.url;

  const handleAddToCart = () => {
    if (!inStock) return;
    addToCart({
      productId: product.id,
      name: product.name,
      priceUsd: product.priceUsd,
      imageUrl,
      stockQty: product.stockQty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col border border-border">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = `https://placehold.co/400x400/f5f0e8/8b7355?text=${encodeURIComponent(product.name.slice(0, 2))}`;
          }}
        />
        {/* Category Badge */}
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="text-xs font-medium bg-card/90 backdrop-blur-sm">
            {categoryLabels[product.category] ?? product.category}
          </Badge>
        </div>
        {/* Out of Stock Overlay */}
        {!inStock && (
          <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center">
            <span className="bg-card text-foreground text-xs font-semibold px-3 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div>
            <p className="text-lg font-bold text-primary">{formatPrice(product.priceUsd)}</p>
            <p className="text-xs text-muted-foreground">
              {inStock ? (
                <span className="text-success flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
                  In Stock ({product.stockQty.toString()})
                </span>
              ) : (
                <span className="text-destructive flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive inline-block" />
                  Out of Stock
                </span>
              )}
            </p>
          </div>
        </div>

        <Button
          size="sm"
          onClick={handleAddToCart}
          disabled={!inStock}
          className={`w-full mt-1 transition-all duration-200 ${
            added
              ? 'bg-success text-success-foreground'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
        >
          {added ? (
            <>
              <CheckCircle size={14} className="mr-1.5" />
              Added!
            </>
          ) : inCart ? (
            <>
              <ShoppingCart size={14} className="mr-1.5" />
              Add More
            </>
          ) : (
            <>
              <ShoppingCart size={14} className="mr-1.5" />
              Add to Cart
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
