
'use client';

import { ProductForm } from '@/components/admin/product-form';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
    const auth = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut(auth);
        router.push('/admin/login');
    }

  return (
    <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Painel Administrativo</h1>
            <Button onClick={handleSignOut} variant="outline">Sair</Button>
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h2 className="text-2xl font-semibold mb-4">Adicionar Novo Produto</h2>
                <ProductForm />
            </div>
            <div>
                 <h2 className="text-2xl font-semibold mb-4">Gerenciar Produtos</h2>
                 <p>Em breve: uma lista de produtos para editar, reestocar ou remover.</p>
            </div>
        </div>
    </div>
  );
}
