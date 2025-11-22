'use client';

import { PromotionalBanner } from "@/components/promotional-banner";
import { CategoryButtons } from "@/components/category-buttons";
import { ProductGrid } from "@/components/product-grid";
import { WelcomePopup } from "@/components/welcome-popup";
import { useState, useEffect } from "react";

export default function Home() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const popupShown = sessionStorage.getItem('welcomePopupShown');
    if (!popupShown) {
      setIsPopupOpen(true);
      sessionStorage.setItem('welcomePopupShown', 'true');
    }
  }, []);

  return (
    <>
      <WelcomePopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
      <PromotionalBanner />
      <CategoryButtons />
      <ProductGrid />
    </>
  );
}
