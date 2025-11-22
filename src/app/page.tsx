'use client';

import { PromotionalBanner } from "@/components/promotional-banner";
import { CategoryButtons } from "@/components/category-buttons";
import { ProductGrid } from "@/components/product-grid";
import { TestPopup } from "@/components/test-popup";

export default function Home() {
  return (
    <>
      <TestPopup />
      <PromotionalBanner />
      <CategoryButtons />
      <ProductGrid />
    </>
  );
}
