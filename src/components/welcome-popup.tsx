'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Flower2 } from 'lucide-react';

interface WelcomePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WelcomePopup({ isOpen, onClose }: WelcomePopupProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-background/95">
        <DialogHeader className="items-center text-center">
          <Flower2 className="h-12 w-12 text-primary mb-4" />
          <DialogTitle className="font-headline text-2xl font-bold text-primary">
            Bem-vindo(a) à Sonho de Flor!
          </DialogTitle>
          <DialogDescription className="pt-2 text-foreground/80">
            Explore nossos pijamas feitos com carinho para noites de sonho e conforto.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <Button type="button" onClick={onClose}>
            Começar a Comprar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
