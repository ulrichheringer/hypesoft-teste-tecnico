import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";
import { ProductForm, type ProductFormValues } from "@/components/products/product-form";

const mapProductToForm = (product?: Product): Partial<ProductFormValues> | undefined => {
  if (!product) {
    return undefined;
  }

  return {
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    categoryId: product.categoryId,
  };
};

type ProductDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  categories: Category[];
  product?: Product;
  submitLabel: string;
  onSubmit: (values: ProductFormValues) => Promise<void> | void;
};

export function ProductDialog({
  open,
  onOpenChange,
  title,
  categories,
  product,
  submitLabel,
  onSubmit,
}: ProductDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">{title}</DialogTitle>
        </DialogHeader>
        <ProductForm
          categories={categories}
          defaultValues={mapProductToForm(product)}
          onSubmit={onSubmit}
          submitLabel={submitLabel}
        />
      </DialogContent>
    </Dialog>
  );
}
