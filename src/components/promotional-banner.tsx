"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";

const bannerImages = PlaceHolderImages.filter(img => img.id.startsWith('banner-'));
const bannerContent = [
    { title: "Promoções", description: "Até 40% OFF em toda a loja!", buttonText: "Conferir", href: "#"},
    { title: "Coleção Sonhos de Lavanda", description: "Conforto e elegância para suas noites.", buttonText: "Descobrir", href: "#"},
    { title: "Durma nas Nuvens", description: "Os pijamas mais macios que você já vestiu.", buttonText: "Ver Coleção", href: "#"},
]

export function PromotionalBanner() {
  return (
    <section className="w-full">
      <Carousel
        className="w-full"
        plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}
        opts={{ loop: true }}
      >
        <CarouselContent>
          {bannerImages.map((image, index) => (
            <CarouselItem key={image.id}>
              <Card className="border-0 rounded-none shadow-none bg-transparent">
                <CardContent className="relative flex aspect-[16/7] items-center justify-center p-0">
                  <Image
                    src={image.imageUrl}
                    alt={image.description}
                    fill
                    className="object-cover brightness-[0.4]"
                    data-ai-hint={image.imageHint}
                    priority={index === 0}
                  />
                  <div className="relative z-10 flex flex-col items-center space-y-4 text-center text-primary-foreground p-4">
                    <h2 className="text-4xl font-headline font-bold drop-shadow-md sm:text-5xl md:text-6xl">
                      {bannerContent[index % bannerContent.length].title}
                    </h2>
                    <p className="max-w-md text-lg drop-shadow">
                      {bannerContent[index % bannerContent.length].description}
                    </p>
                    <Button asChild size="lg" className="font-bold">
                      <Link href={bannerContent[index % bannerContent.length].href}>{bannerContent[index % bannerContent.length].buttonText}</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 text-white hidden sm:flex" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 text-white hidden sm:flex" />
      </Carousel>
    </section>
  );
}
