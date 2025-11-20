'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { addDocumentNonBlocking } from '@/firebase';
import { useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';

const productSchema = z.object({
  name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
  description: z.string().min(10, { message: 'A descrição deve ter pelo menos 10 caracteres.'}),
  price: z.preprocess(
    (val) => Number(String(val).replace(/[^0-9,]/g, '').replace(',', '.')),
    z.number().positive({ message: 'O preço deve ser um número positivo.' })
  ),
  stockQuantity: z.preprocess(
    (val) => parseInt(String(val), 10),
    z.number().int().min(0, { message: 'O estoque não pode ser negativo.' })
  ),
  category: z.string({ required_error: 'Selecione uma categoria.' }),
  subCategory: z.string({ required_error: 'Selecione uma subcategoria.' }),
  size: z.string({ required_error: 'Selecione um tamanho/idade.' }),
  image: z.any().refine((files) => files?.length === 1, 'A imagem é obrigatória.'),
});

const categories = {
    feminino: {
        sizes: ['tamanho-unico', 'gg'],
        subCategories: ['blogueirinha-cropped', 'blogueirinha-blusa-maior', 'rendinha', 'camisolas', 'senhora-elegante']
    },
    masculino: {
        sizes: ['tamanho-unico', 'gg'],
        subCategories: ['samba-cancao', 'benjamin']
    },
    infantil: {
        sizes: ['2', '4', '6', '8', '10'],
        subCategories: ['masculino', 'feminino']
    }
}

export function ProductForm() {
  const { toast } = useToast();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stockQuantity: 0,
    },
  });

  const category = form.watch('category');

  function onSubmit(values: z.infer<typeof productSchema>) {
    if (!firestore) {
        toast({
            variant: "destructive",
            title: "Erro de conexão",
            description: "Não foi possível conectar ao banco de dados.",
        });
        return;
    }
    // TODO: Implement image upload to Firebase Storage and get URL
    const imageUrl = 'https://picsum.photos/seed/placeholder/400/500';
    
    const productsRef = collection(firestore, 'products');
    addDocumentNonBlocking(productsRef, {
        name: values.name,
        description: values.description,
        price: values.price,
        stockQuantity: values.stockQuantity,
        imageUrl: imageUrl,
        categoryId: values.category,
        subcategoryId: values.subCategory,
        size: values.size, 
    }).then(() => {
        toast({
            title: 'Produto Adicionado!',
            description: `${values.name} foi adicionado com sucesso.`,
        });
        form.reset();
    }).catch(() => {
         toast({
            variant: "destructive",
            title: "Erro ao adicionar produto",
            description: "Ocorreu um erro ao salvar o produto. Verifique suas permissões.",
        });
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Produto</FormLabel>
              <FormControl>
                <Input placeholder="Pijama de Seda Lavanda" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição do Produto</FormLabel>
              <FormControl>
                <Textarea placeholder="Descreva o produto, material, caimento, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="199,90" {...field} onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9,]/g, '');
                    field.onChange(value);
                  }}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stockQuantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estoque</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="50" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria Principal</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria principal" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="feminino">Feminino</SelectItem>
                  <SelectItem value="infantil">Infantil</SelectItem>
                  <SelectItem value="masculino">Masculino</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {category && (
            <>
                <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{category === 'infantil' ? 'Idade' : 'Tamanho'}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder={`Selecione ${category === 'infantil' ? 'a idade' : 'o tamanho'}`} />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {categories[category as keyof typeof categories].sizes.map(size => (
                            <SelectItem key={size} value={size}>{size === 'tamanho-unico' ? 'Tamanho Único' : size.toUpperCase()}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="subCategory"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Subcategoria</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione a subcategoria" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {categories[category as keyof typeof categories].subCategories.map(sub => (
                            <SelectItem key={sub} value={sub}>{sub.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </>
        )}
        
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Foto do Produto</FormLabel>
              <FormControl>
                <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} />
              </FormControl>
              <FormDescription>
                Envie uma imagem para o produto.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">Adicionar Produto</Button>
      </form>
    </Form>
  );
}
