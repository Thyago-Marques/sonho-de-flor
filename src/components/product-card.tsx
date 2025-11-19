import Image from "next/image";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="w-full overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
      <Link href={`/product/${product.id}`} aria-label={`Ver detalhes de ${product.name}`}>
        <CardHeader className="p-0">
          <div className="aspect-[3/4] relative w-full">
              <Image
                  src={product.image.src}
                  alt={product.image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  data-ai-hint={product.image.hint}
              />
          </div>
        </CardHeader>
      </Link>
      <CardContent className="p-4">
        <Link href={`/product/${product.id}`}>
          <CardTitle className="font-headline text-xl text-primary/90 hover:text-primary">{product.name}</CardTitle>
        </Link>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 pt-0">
        <p className="text-2xl font-bold text-primary">{product.price}</p>
        <Button>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Comprar
        </Button>
      </CardFooter>
    </Card>
  );
}
