'use client';

import { useParams } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Product } from '@/lib/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Tag } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Function to format price to BRL currency
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
};

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const firestore = useFirestore();

  const productRef = useMemoFirebase(
    () => (firestore && id ? doc(firestore, 'products', id) : null),
    [firestore, id]
  );

  const { data: product, isLoading, error } = useDoc<Product>(productRef);

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="aspect-[3/4] w-full rounded-lg" />
          <div className="flex flex-col space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p className="text-red-500">Erro ao carregar o produto. Tente novamente mais tarde.</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p>Produto não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div className="aspect-[3/4] relative w-full overflow-hidden rounded-lg shadow-lg">
          <Image
            src={product.imageUrl}
            alt={`Foto de ${product.name}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            data-ai-hint="pajama product"
            priority
          />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="font-headline text-3xl font-bold text-primary sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-4 text-4xl font-bold text-primary">
            {formatPrice(product.price)}
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
             <Tag className="h-4 w-4" />
             <span>{product.categoryId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} / {product.subcategoryId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
          </div>

          <div className="mt-6">
             <h3 className="text-lg font-semibold">Tamanho: {product.size.toUpperCase()}</h3>
          </div>

           <div className="mt-2">
             <p className="text-sm text-muted-foreground">
                Estoque: {product.stockQuantity > 0 ? `${product.stockQuantity} unidades` : 'Indisponível'}
             </p>
           </div>
          
          <div className="mt-8">
            <Button size="lg" className="w-full font-bold text-lg" disabled={product.stockQuantity === 0}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              {product.stockQuantity > 0 ? 'Adicionar ao Carrinho' : 'Produto Indisponível'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
