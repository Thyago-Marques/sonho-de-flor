export type Product = {
  id: string;
  name: string;
  price: number; // Changed to number to match schema
  imageUrl: string;
  stockQuantity: number;
  categoryId: string;
  subcategoryId: string;
  size: string;
};
