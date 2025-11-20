"use client";

import Link from "next/link";
import {
  Flower2,
  Instagram,
  Facebook,
  Phone,
  Mail,
  Menu,
  ShoppingCart,
  Baby,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";

const socialLinks = [
  {
    href: "mailto:contato@sonhodeflor.com",
    label: "Email",
    icon: <Mail className="h-4 w-4" />,
  },
  {
    href: "https://wa.me/5511999999999",
    label: "WhatsApp",
    icon: <WhatsAppIcon className="h-4 w-4" />,
  },
  {
    href: "tel:+5511999999999",
    label: "Telefone",
    icon: <Phone className="h-4 w-4" />,
  },
  {
    href: "https://facebook.com",
    label: "Facebook",
    icon: <Facebook className="h-4 w-4" />,
  },
  {
    href: "https://instagram.com",
    label: "Instagram",
    icon: <Instagram className="h-4 w-4" />,
  },
];

const navLinks = [
    { href: "/category/verao", label: "Pijamas de Verão" },
    { href: "/category/inverno", label: "Pijamas de Inverno" },
];

const infantilAges = [2, 4, 6, 8, 10];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="bg-primary/10">
        <div className="container mx-auto flex h-10 items-center justify-center space-x-4 px-4 text-sm font-medium text-primary md:justify-end">
          {socialLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="transition-colors hover:text-primary/80"
            >
              {link.icon}
            </Link>
          ))}
        </div>
      </div>
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Flower2 className="h-8 w-8 text-primary" />
          <span className="font-headline text-2xl font-bold text-primary">
            Sonho de Flor
          </span>
        </Link>

        <nav className="hidden items-center space-x-2 md:flex">
          {navLinks.map((link) => (
             <Button asChild key={link.label} variant="ghost">
                <Link href={link.href}>
                  {link.label}
                </Link>
             </Button>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                🧸 Infantil
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                {infantilAges.map((age) => (
                  <DropdownMenuSub key={age}>
                    <DropdownMenuSubTrigger>
                      <span>{age} anos</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem asChild>
                          <Link href={`/category/infantil/${age}/masculino`}>Masculino</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/category/infantil/${age}/feminino`}>Feminino</Link>
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <Button variant="ghost" size="icon" aria-label="Carrinho de compras">
            <ShoppingCart className="h-6 w-6" />
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="grid gap-6 text-lg font-medium mt-8">
                <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                    <Flower2 className="h-6 w-6 text-primary" />
                    <span className="font-headline text-xl font-bold text-primary">Sonho de Flor</span>
                </Link>
                {navLinks.map((link) => (
                    <Link key={link.label} href={link.href} className="transition-colors hover:text-primary">
                        {link.label}
                    </Link>
                ))}
                 <Link href="/category/infantil" className="transition-colors hover:text-primary">
                    🧸 Infantil
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
