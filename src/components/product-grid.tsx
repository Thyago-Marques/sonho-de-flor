import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const productPlaceholders = PlaceHolderImages.filter(img => img.id.startsWith('product-'));

const products: Product[] = [
    { id: '1', name: 'Pijama de Seda Lavanda', price: 'R$ 249,90', image: { src: productPlaceholders[0]?.imageUrl, alt: 'Pijama de seda na cor lavanda', hint: productPlaceholders[0]?.imageHint } },
    { id: '2', name: 'Pijama de Algodão Verão', price: 'R$ 159,90', image: { src: productPlaceholders[1]?.imageUrl, alt: 'Pijama de algodão para o verão', hint: productPlaceholders[1]?.imageHint } },
    { id: '3', name: 'Pijama Flanelado Inverno', price: 'R$ 289,90', image: { src: productPlaceholders[2]?.imageUrl, alt: 'Pijama de flanela para o inverno', hint: productPlaceholders[2]?.imageHint } },
    { id: '4', name: 'Pijama Floral Elegance', price: 'R$ 199,90', image: { src: productPlaceholders[3]?.imageUrl, alt: 'Pijama com estampa floral', hint: productPlaceholders[3]?.imageHint } },
    { id: '5', name: 'Pijama Infantil Ursinho', price: 'R$ 129,90', image: { src: productPlaceholders[4]?.imageUrl, alt: 'Pijama infantil com estampa de ursinho', hint: productPlaceholders[4]?.imageHint } },
    { id: '6', name: 'Pijama Curto Conforto', price: 'R$ 149,90', image: { src: productPlaceholders[5]?.imageUrl, alt: 'Pijama curto para noites quentes', hint: productPlaceholders[5]?.imageHint } },
].filter(p => p.image.src); // Filter out products without images

export function ProductGrid() {
    if (products.length === 0) {
        return null;
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
