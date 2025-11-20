'use client';

import { ProductCard } from '@/components/product-card';
import type { Product } from '@/lib/types';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export function ProductGrid() {
  const firestore = useFirestore();

  const productsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'products')) : null),
    [firestore]
  );

  const {
    data: products,
    isLoading,
    error,
  } = useCollection<Product>(productsQuery);

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-8">
        <h2 className="mb-8 text-center font-headline text-3xl font-bold text-primary md:text-4xl">
          Nossos Produtos
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[400px] w-full rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto px-4 py-8 text-center">
        <h2 className="mb-8 text-center font-headline text-3xl font-bold text-primary md:text-4xl">
          Nossos Produtos
        </h2>
        <p className="text-red-500">
          Ocorreu um erro ao carregar os produtos.
        </p>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
       <section className="container mx-auto px-4 py-8">
            <h2 className="mb-8 text-center font-headline text-3xl font-bold text-primary md:text-4xl">
                Nossos Produtos
            </h2>
            <p className="text-center text-muted-foreground">Nenhum produto encontrado.</p>
        </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="mb-8 text-center font-headline text-3xl font-bold text-primary md:text-4xl">
        Nossos Produtos
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
