import React, { useState } from 'react';
import { useCreateProduct } from '../hooks/useQueries';
import { Category } from '../backend';
import { Button } from '@/components/ui/button';
import { Sparkles, CheckCircle2 } from 'lucide-react';

const SEED_PRODUCTS = [
  // Electronics
  {
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear audio.',
    category: Category.electronics,
    priceUsd: BigInt(19999),
    stockQty: BigInt(45),
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop&auto=format',
  },
  {
    name: 'Smart Watch Series X',
    description: 'Feature-packed smartwatch with health monitoring, GPS, and 7-day battery. Water resistant to 50m.',
    category: Category.electronics,
    priceUsd: BigInt(29999),
    stockQty: BigInt(30),
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop&auto=format',
  },
  {
    name: 'Portable Bluetooth Speaker',
    description: 'Compact 360° speaker with deep bass, 20-hour playtime, and IPX7 waterproof rating. Perfect for outdoors.',
    category: Category.electronics,
    priceUsd: BigInt(7999),
    stockQty: BigInt(60),
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop&auto=format',
  },
  {
    name: 'Mechanical Gaming Keyboard',
    description: 'RGB backlit mechanical keyboard with tactile switches, anti-ghosting, and durable aluminum frame.',
    category: Category.electronics,
    priceUsd: BigInt(12999),
    stockQty: BigInt(25),
    imageUrl: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&h=500&fit=crop&auto=format',
  },
  {
    name: 'True Wireless Earbuds Pro',
    description: 'Waterproof earbuds with active noise cancellation, 8-hour playtime, and touch controls. Includes charging case.',
    category: Category.electronics,
    priceUsd: BigInt(9999),
    stockQty: BigInt(80),
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=500&fit=crop&auto=format',
  },
  // Clothing
  {
    name: 'Classic Oxford Button-Down Shirt',
    description: 'Timeless Oxford weave shirt in 100% cotton. Perfect for business casual or relaxed weekend wear.',
    category: Category.clothing,
    priceUsd: BigInt(4999),
    stockQty: BigInt(80),
    imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&h=500&fit=crop&auto=format',
  },
  {
    name: 'Premium Slim-Fit Chinos',
    description: 'Versatile slim-fit chinos crafted from stretch cotton blend. Wrinkle-resistant and available in multiple colors.',
    category: Category.clothing,
    priceUsd: BigInt(5999),
    stockQty: BigInt(65),
    imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&h=500&fit=crop&auto=format',
  },
  {
    name: 'Merino Wool Crew Neck Sweater',
    description: 'Luxuriously soft merino wool sweater. Naturally temperature-regulating, odor-resistant, and machine washable.',
    category: Category.clothing,
    priceUsd: BigInt(8999),
    stockQty: BigInt(40),
    imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&h=500&fit=crop&auto=format',
  },
  {
    name: 'Leather Minimalist Wallet',
    description: 'Slim genuine leather wallet with RFID blocking technology. Holds up to 8 cards and cash.',
    category: Category.clothing,
    priceUsd: BigInt(3499),
    stockQty: BigInt(100),
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&h=500&fit=crop&auto=format',
  },
  // Home & Kitchen
  {
    name: 'Cast Iron Dutch Oven',
    description: 'Enameled cast iron Dutch oven, 6-quart capacity. Perfect for braising, soups, stews, and baking artisan bread.',
    category: Category.homeKitchen,
    priceUsd: BigInt(7999),
    stockQty: BigInt(35),
    imageUrl: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500&h=500&fit=crop&auto=format',
  },
  {
    name: 'Bamboo Cutting Board Set',
    description: 'Set of 3 premium bamboo cutting boards with juice grooves and non-slip feet. Eco-friendly and knife-friendly.',
    category: Category.homeKitchen,
    priceUsd: BigInt(3499),
    stockQty: BigInt(90),
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop&auto=format',
  },
  {
    name: 'Stainless Steel Coffee Maker',
    description: '12-cup programmable coffee maker with thermal carafe. Keeps coffee hot for 4 hours without a warming plate.',
    category: Category.homeKitchen,
    priceUsd: BigInt(6999),
    stockQty: BigInt(50),
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=500&fit=crop&auto=format',
  },
  {
    name: 'Aromatherapy Diffuser & Humidifier',
    description: 'Ultrasonic essential oil diffuser with 7 LED color modes, auto shut-off, and 500ml water tank capacity.',
    category: Category.homeKitchen,
    priceUsd: BigInt(2999),
    stockQty: BigInt(75),
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&h=500&fit=crop&auto=format',
  },
];

const CATEGORY_COUNTS = {
  [Category.electronics]: SEED_PRODUCTS.filter(p => p.category === Category.electronics).length,
  [Category.clothing]: SEED_PRODUCTS.filter(p => p.category === Category.clothing).length,
  [Category.homeKitchen]: SEED_PRODUCTS.filter(p => p.category === Category.homeKitchen).length,
};

interface SeedProductsProps {
  onComplete?: () => void;
}

export default function SeedProducts({ onComplete }: SeedProductsProps) {
  const createProduct = useCreateProduct();
  const [seeding, setSeeding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const handleSeed = async () => {
    setSeeding(true);
    setDone(false);
    setProgress(0);
    try {
      for (let i = 0; i < SEED_PRODUCTS.length; i++) {
        const p = SEED_PRODUCTS[i];
        await createProduct.mutateAsync(p);
        setProgress(i + 1);
      }
      setDone(true);
      onComplete?.();
    } catch (err) {
      console.error('Seed error:', err);
    } finally {
      setSeeding(false);
    }
  };

  const progressPct = SEED_PRODUCTS.length > 0 ? (progress / SEED_PRODUCTS.length) * 100 : 0;

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 space-y-3">
      <div className="flex items-start gap-3">
        <Sparkles size={20} className="text-primary mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground text-sm">Seed Sample Products</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Populate the store with {SEED_PRODUCTS.length} sample products — {CATEGORY_COUNTS[Category.electronics]} Electronics,{' '}
            {CATEGORY_COUNTS[Category.clothing]} Clothing, and {CATEGORY_COUNTS[Category.homeKitchen]} Home &amp; Kitchen items.
          </p>
        </div>
      </div>

      {seeding && (
        <div className="space-y-1.5">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Creating product {progress} of {SEED_PRODUCTS.length}…
          </p>
        </div>
      )}

      {done && !seeding && (
        <div className="flex items-center gap-2 text-success text-xs font-medium">
          <CheckCircle2 size={14} />
          {SEED_PRODUCTS.length} products added successfully!
        </div>
      )}

      <Button
        onClick={handleSeed}
        disabled={seeding || done}
        size="sm"
        className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
      >
        {seeding ? (
          <span className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Seeding {progress}/{SEED_PRODUCTS.length}…
          </span>
        ) : done ? (
          <span className="flex items-center gap-2">
            <CheckCircle2 size={14} />
            Products Seeded
          </span>
        ) : (
          <>
            <Sparkles size={14} className="mr-1.5" />
            Seed {SEED_PRODUCTS.length} Products
          </>
        )}
      </Button>
    </div>
  );
}
