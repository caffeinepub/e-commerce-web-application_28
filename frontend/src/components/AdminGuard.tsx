import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ShieldX } from 'lucide-react';
import { useIsAdmin } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading } = useIsAdmin();
  const navigate = useNavigate();

  if (!identity) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <ShieldX size={48} className="text-muted-foreground" />
        <h2 className="font-display text-2xl font-bold text-foreground">Authentication Required</h2>
        <p className="text-muted-foreground max-w-sm">You must be logged in to access the admin dashboard.</p>
        <Button onClick={() => navigate({ to: '/' })} variant="outline">Go Home</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <ShieldX size={48} className="text-destructive" />
        <h2 className="font-display text-2xl font-bold text-foreground">Access Denied</h2>
        <p className="text-muted-foreground max-w-sm">You don't have permission to access the admin dashboard.</p>
        <Button onClick={() => navigate({ to: '/catalog' })} variant="outline">Browse Products</Button>
      </div>
    );
  }

  return <>{children}</>;
}
