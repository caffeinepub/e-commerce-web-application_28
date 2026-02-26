import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useListProducts } from '../hooks/useQueries';
import ProductCard from '../components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

const features = [
  { icon: ShieldCheck, title: 'Secure Payments', desc: 'Your transactions are protected end-to-end.' },
  { icon: Truck, title: 'Fast Delivery', desc: 'Quick and reliable shipping to your door.' },
  { icon: RefreshCw, title: 'Easy Returns', desc: '30-day hassle-free return policy.' },
  { icon: Star, title: 'Top Quality', desc: 'Curated products from trusted brands.' },
];

export default function Home() {
  const navigate = useNavigate();
  const { data: products, isLoading } = useListProducts();
  const featuredProducts = products?.slice(0, 4) ?? [];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[420px] sm:min-h-[500px] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/assets/generated/hero-banner.dim_1440x500.png)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-xl">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">
              New Season Arrivals
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              Discover Your
              <br />
              <span className="text-primary">Perfect Style</span>
            </h1>
            <p className="text-white/80 text-lg mb-8 leading-relaxed">
              Shop the latest trends in electronics, fashion, and home essentials — all in one place.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={() => navigate({ to: '/catalog' })}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8 rounded-full"
              >
                Shop Now
                <ArrowRight size={18} className="ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate({ to: '/catalog' })}
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-full backdrop-blur-sm"
              >
                Browse Catalog
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-1">Featured</p>
            <h2 className="font-display text-3xl font-bold text-foreground">Popular Products</h2>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate({ to: '/catalog' })}
            className="hidden sm:flex items-center gap-1.5"
          >
            View All
            <ArrowRight size={15} />
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id.toString()} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/30 rounded-xl border border-border">
            <p className="text-muted-foreground">No products available yet. Check back soon!</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => navigate({ to: '/catalog' })}
            >
              Browse Catalog
            </Button>
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Button
            variant="outline"
            onClick={() => navigate({ to: '/catalog' })}
            className="w-full"
          >
            View All Products
            <ArrowRight size={15} className="ml-1.5" />
          </Button>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-primary/10 border-y border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground mb-3">
            Ready to Start Shopping?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Explore our full catalog of electronics, clothing, and home essentials.
          </p>
          <Button
            size="lg"
            onClick={() => navigate({ to: '/catalog' })}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-10 rounded-full"
          >
            Shop the Catalog
            <ArrowRight size={18} className="ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
}
