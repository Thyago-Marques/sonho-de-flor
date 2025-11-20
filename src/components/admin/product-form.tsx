'use client';

import { useState, useRef } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Image from 'next/image';
import { uploadImageAndGetURL } from '@/firebase/storage';
import { Loader2 } from 'lucide-react';

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
  image: z.instanceof(File, { message: 'A imagem é obrigatória e deve ser um arquivo.' }),
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

// Function to get the cropped image
function getCroppedImg(
  image: HTMLImageElement,
  crop: Crop,
  fileName: string
): Promise<File> {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return Promise.reject(new Error('Failed to get canvas context'));
  }

  const pixelRatio = window.devicePixelRatio;
  canvas.width = crop.width * pixelRatio;
  canvas.height = crop.height * pixelRatio;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.imageSmoothingQuality = 'high';

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty'));
        return;
      }
      const file = new File([blob], fileName, { type: 'image/jpeg' });
      resolve(file);
    }, 'image/jpeg', 0.95);
  });
}


export function ProductForm() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop>();
  const [croppedImageUrl, setCroppedImageUrl] = useState('');
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
      reader.readAsDataURL(e.target.files[0]);
      setIsCropModalOpen(true);
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        3 / 4, // Aspect ratio 3:4
        width,
        height
      ),
      width,
      height
    );
    setCrop(crop);
  }

  async function handleCropConfirm() {
    if (!completedCrop || !imgRef.current) {
      return;
    }
    const originalFile = fileInputRef.current?.files?.[0];
    if (!originalFile) return;

    const croppedFile = await getCroppedImg(imgRef.current, completedCrop, originalFile.name);
    form.setValue('image', croppedFile);
    setCroppedImageUrl(URL.createObjectURL(croppedFile));
    setIsCropModalOpen(false);
  }

  async function onSubmit(values: z.infer<typeof productSchema>) {
    if (!firestore) {
      toast({
        variant: 'destructive',
        title: 'Erro de Conexão',
        description: 'Não foi possível conectar ao banco de dados. Tente novamente.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload image and get URL
      const imageUrl = await uploadImageAndGetURL(values.image);

      // 2. Prepare product data for Firestore
      const productData = {
        name: values.name,
        description: values.description,
        price: values.price,
        stockQuantity: values.stockQuantity,
        imageUrl: imageUrl,
        categoryId: values.category,
        subcategoryId: values.subCategory,
        size: values.size,
      };

      // 3. Add product data to Firestore
      const productsCollection = collection(firestore, 'products');
      await addDoc(productsCollection, productData);

      // 4. Success feedback
      toast({
        title: 'Produto Adicionado!',
        description: `${values.name} foi adicionado com sucesso.`,
      });

      // 5. Reset form and UI state
      form.reset();
      setCroppedImageUrl('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      // 6. Detailed error handling
      console.error('Erro detalhado ao adicionar produto:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao Adicionar Produto',
        description:
          error.code === 'permission-denied'
            ? 'Você não tem permissão para adicionar produtos. Verifique suas credenciais de administrador.'
            : error.message || 'Ocorreu um erro inesperado. Verifique o console para mais detalhes.',
      });
    } finally {
      // 7. ALWAYS turn off loading state
      setIsSubmitting(false);
    }
  }

  return (
    <>
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
            render={() => (
              <FormItem>
                <FormLabel>Foto do Produto</FormLabel>
                <FormControl>
                  <Input type="file" accept="image/*" onChange={onSelectFile} ref={fileInputRef} />
                </FormControl>
                <FormDescription>
                  Envie uma imagem para o produto. Ela será recortada no formato 3:4.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {croppedImageUrl && (
            <div className="space-y-2">
                <p className="text-sm font-medium">Prévia da Imagem</p>
                <div className="relative w-40 h-52 rounded-md overflow-hidden border">
                    <Image src={croppedImageUrl} alt="Prévia da imagem recortada" fill objectFit="cover" />
                </div>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adicionando...
              </>
            ) : (
              'Adicionar Produto'
            )}
          </Button>
        </form>
      </Form>

      <Dialog open={isCropModalOpen} onOpenChange={setIsCropModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Recortar Imagem</DialogTitle>
          </DialogHeader>
          {imgSrc && (
            <ReactCrop
              crop={crop}
              onChange={c => setCrop(c)}
              onComplete={c => setCompletedCrop(c)}
              aspect={3 / 4}
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={imgSrc}
                onLoad={onImageLoad}
                className="w-full"
              />
            </ReactCrop>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCropModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleCropConfirm}>Confirmar Recorte</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
