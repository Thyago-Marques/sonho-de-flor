'use client';

import { useParams } from 'next/navigation';
import { ProductCard } from '@/components/product-card';
import type { Product } from '@/lib/types';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, Query } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

function getPathFromSlug(slug: string | string[]) {
    if (Array.isArray(slug)) {
        return slug.join(' / ');
    }
    return slug;
}

export default function CategoryPage() {
  const params = useParams();
  const { slug } = params;
  const firestore = useFirestore();

  const productsQuery = useMemoFirebase(() => {
    if (!firestore || !slug) return null;
    
    let q: Query = collection(firestore, 'products');

    const [categoryId, ...rest] = slug as string[];

    if (categoryId) {
      q = query(q, where('categoryId', '==', categoryId));
    }
    
    // This logic assumes a flexible filtering. 
    // For "infantil/[age]/[gender]", it filters categoryId: "infantil", subcategoryId: "[gender]", size: "[age]"
    // For "feminino/[size]/[subcategory]", it filters categoryId: "feminino", subcategoryId: "[subcategory]", size: "[size]"
    // For "masculino/[subcategory]/[size]", it filters categoryId: "masculino", subcategoryId: "[subcategory]", size: "[size]"
    
    if (rest.length > 0) {
        if (categoryId === 'infantil') {
            const [size, subcategoryId] = rest;
            if (size) q = query(q, where('size', '==', size));
            if (subcategoryId) q = query(q, where('subcategoryId', '==', subcategoryId));
        } else if (categoryId === 'feminino') {
            const [size, subcategoryId] = rest;
            if (size) q = query(q, where('size', '==', size));
            if (subcategoryId) q = query(q, where('subcategoryId', '==', subcategoryId));
        } else if (categoryId === 'masculino') {
            const [subcategoryId, size] = rest;
            if (subcategoryId) q = query(q, where('subcategoryId', '==', subcategoryId));
            if (size) q = query(q, where('size', '==', size));
        }
    }

    return q;
  }, [firestore, slug]);

  const { data: products, isLoading, error } = useCollection<Product>(productsQuery);

  const path = getPathFromSlug(slug).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-8">
        <h2 className="mb-8 text-center font-headline text-3xl font-bold text-primary md:text-4xl">
          {path}
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
           {path}
        </h2>
        <p className="text-red-500">Ocorreu um erro ao carregar os produtos.</p>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="mb-8 text-center font-headline text-3xl font-bold text-primary md:text-4xl">
        {path}
      </h2>
      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">Nenhum produto encontrado nesta categoria.</p>
      )}
    </section>
  );
}
