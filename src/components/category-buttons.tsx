import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Baby, Moon } from 'lucide-react';
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

const infantilAges = [2, 4, 6, 8, 10];
const femininoSubCategories = [
    { name: 'Blogueirinha Cropped', href: 'blogueirinha-cropped' },
    { name: 'Blogueirinha Blusa Maior', href: 'blogueirinha-blusa-maior' },
    { name: 'Rendinha', href: 'rendinha' },
    { name: 'Camisolas', href: 'camisolas' },
    { name: 'Senhora Elegante', href: 'senhora-elegante' },
];
const femininoSizes = [
    { name: 'Tamanho Único', href: 'tamanho-unico' },
    { name: 'GG', href: 'gg' },
];

const masculinoSubCategories = [
    { name: 'Samba Canção', href: 'samba-cancao' },
    { name: 'Benjamin', href: 'benjamin' },
];
const masculinoSizes = [
    { name: 'Tamanho Único', href: 'tamanho-unico' },
    { name: 'GG', href: 'gg' },
];

export function CategoryButtons() {
    return (
        <section className="container mx-auto px-4 py-8 sm:py-12">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="lg" variant="outline" className="h-16 w-full text-lg transition-transform hover:scale-105 hover:bg-primary/10 focus:bg-primary/10 focus:ring-2 focus:ring-primary">
                            🌸 Feminino
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuGroup>
                            {femininoSizes.map((size) => (
                            <DropdownMenuSub key={size.name}>
                                <DropdownMenuSubTrigger>
                                <span>{size.name}</span>
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    {femininoSubCategories.map((style) => (
                                        <DropdownMenuItem key={style.name} asChild>
                                            <Link href={`/category/feminino/${size.href}/${style.href}`}>{style.name}</Link>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                            ))}
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="lg" variant="outline" className="h-16 w-full text-lg transition-transform hover:scale-105 hover:bg-primary/10 focus:bg-primary/10 focus:ring-2 focus:ring-primary">
                            <Baby className="mr-2 h-5 w-5" />
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

                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="lg" variant="outline" className="h-16 w-full text-lg transition-transform hover:scale-105 hover:bg-primary/10 focus:bg-primary/10 focus:ring-2 focus:ring-primary">
                            <Moon className="mr-2 h-5 w-5" />
                            💤 Masculino
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuGroup>
                            {masculinoSubCategories.map((subCategory) => (
                                <DropdownMenuSub key={subCategory.name}>
                                    <DropdownMenuSubTrigger>
                                        <span>{subCategory.name}</span>
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            {masculinoSizes.map((size) => (
                                                <DropdownMenuItem key={size.name} asChild>
                                                    <Link href={`/category/masculino/${subCategory.href}/${size.href}`}>{size.name}</Link>
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                            ))}
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </section>
    )
}
