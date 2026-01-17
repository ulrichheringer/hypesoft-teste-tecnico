import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category } from "@/types/category";

const productSchema = z.object({
  name: z.string().min(2, "Informe um nome valido."),
  description: z.string().min(6, "Descricao muito curta."),
  price: z.coerce.number().positive("Informe um preco valido."),
  stock: z.coerce.number().int().min(0, "Estoque invalido."),
  categoryId: z.string().min(1, "Selecione uma categoria."),
});

export type ProductFormValues = z.infer<typeof productSchema>;

type ProductFormProps = {
  categories: Category[];
  defaultValues?: Partial<ProductFormValues>;
  onSubmit: (values: ProductFormValues) => Promise<void> | void;
  submitLabel: string;
};

export function ProductForm({
  categories,
  defaultValues,
  onSubmit,
  submitLabel,
}: ProductFormProps) {
  const initialValues = useMemo(
    () => ({
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
      price: defaultValues?.price ?? 0,
      stock: defaultValues?.stock ?? 0,
      categoryId: defaultValues?.categoryId ?? "",
    }),
    [
      defaultValues?.name,
      defaultValues?.description,
      defaultValues?.price,
      defaultValues?.stock,
      defaultValues?.categoryId,
    ],
  );

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-2">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" placeholder="Ex: Jaqueta bomber" {...register("name")} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Descricao</Label>
        <Textarea
          id="description"
          rows={3}
          placeholder="Resumo do produto"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="price">Preco</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            placeholder="0,00"
            {...register("price")}
          />
          {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="stock">Estoque</Label>
          <Input
            id="stock"
            type="number"
            step="1"
            min="0"
            placeholder="0"
            {...register("stock")}
          />
          {errors.stock && <p className="text-xs text-destructive">{errors.stock.message}</p>}
        </div>
      </div>

      <div className="grid gap-2">
        <Label>Categoria</Label>
        <Controller
          control={control}
          name="categoryId"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.categoryId && (
          <p className="text-xs text-destructive">{errors.categoryId.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full rounded-2xl" disabled={isSubmitting}>
        {submitLabel}
      </Button>
    </form>
  );
}
