"use client";

import Link from "next/link";
import React from "react";
import { Flower2, Instagram, Facebook, Phone, Mail, User } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";

export function Footer() {
  const [year] = React.useState(new Date().getFullYear());

  return (
    <footer className="border-t bg-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="mb-4 flex items-center space-x-2">
              <Flower2 className="h-8 w-8 text-primary" />
              <span className="font-headline text-2xl font-bold text-primary">
                Sonho de Flor
              </span>
            </Link>
            <p className="text-center text-muted-foreground md:text-left">
              Pijamas de qualidade para noites de sonho.
            </p>
          </div>
          <div className="text-center">
            <h3 className="mb-4 font-headline font-semibold uppercase tracking-wider text-primary">Navegação</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/category/feminino" className="transition-colors hover:text-primary">Feminino</Link>
              <Link href="/category/infantil" className="transition-colors hover:text-primary">Infantil</Link>
              <Link href="/category/masculino" className="transition-colors hover:text-primary">Masculino</Link>
            </nav>
          </div>
          <div className="text-center md:text-right">
            <h3 className="mb-4 font-headline font-semibold uppercase tracking-wider text-primary">Contato</h3>
            <div className="flex justify-center space-x-4 md:justify-end">
              <Link href="mailto:contato@sonhodeflor.com" aria-label="Email" className="text-muted-foreground transition-colors hover:text-primary"><Mail/></Link>
              <Link href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-muted-foreground transition-colors hover:text-primary"><WhatsAppIcon className="h-6 w-6"/></Link>
              <Link href="tel:+5511999999999" aria-label="Telefone" className="text-muted-foreground transition-colors hover:text-primary"><Phone/></Link>
              <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-muted-foreground transition-colors hover:text-primary"><Facebook/></Link>
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted-foreground transition-colors hover:text-primary"><Instagram/></Link>
              <Link href="/admin/login" aria-label="Login do Administrador" className="text-muted-foreground transition-colors hover:text-primary"><User /></Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {year} Sonho de Flor. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
