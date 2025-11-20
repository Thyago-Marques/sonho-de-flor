import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sun, Snowflake, Baby } from 'lucide-react';

const categories = [
    { href: "/category/infantil", label: "🧸 Infantil", icon: <Baby className="mr-2 h-5 w-5" /> },
    { href: "/category/verao", label: "Pijamas de Verão", icon: <Sun className="mr-2 h-5 w-5" /> },
    { href: "/category/inverno", label: "Pijamas de Inverno", icon: <Snowflake className="mr-2 h-5 w-5" /> },
];

export function CategoryButtons() {
    return (
        <section className="container mx-auto px-4 py-8 sm:py-12">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {categories.map((category) => (
                    <Button asChild key={category.label} size="lg" variant="outline" className="h-16 text-lg transition-transform hover:scale-105 hover:bg-primary/10 focus:bg-primary/10 focus:ring-2 focus:ring-primary">
                        <Link href={category.href}>
                            {category.icon}
                            {category.label}
                        </Link>
                    </Button>
                ))}
            </div>
        </section>
    )
}
