export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  createdAt: string;
};

export type CreateProductInput = {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
};

export type UpdateProductInput = CreateProductInput;

export type UpdateStockInput = {
  stock: number;
};
