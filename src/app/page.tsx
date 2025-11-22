'use client';

import { PromotionalBanner } from "@/components/promotional-banner";
import { CategoryButtons } from "@/components/category-buttons";
import { ProductGrid } from "@/components/product-grid";

export default function Home() {
  return (
    <>
      <PromotionalBanner />
      <CategoryButtons />
      <ProductGrid />
    </>
  );
}
