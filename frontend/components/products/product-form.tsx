import { zodResolver } from "@hookform/resolvers/zod";
import type { FocusEvent } from "react";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { CurrencyInput } from "@/components/ui/currency-input";
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
import { useI18n } from "@/components/i18n/i18n-provider";

const productSchema = z.object({
  name: z.string().min(2, "Informe um nome valido."),
  description: z.string().min(6, "Descricao muito curta."),
  price: z.coerce.number().positive("Informe um preco valido."),
  stock: z.coerce.number().int().min(0, "Estoque invalido."),
  categoryId: z.string().min(1, "Selecione uma categoria."),
});

type ProductFormSchema = typeof productSchema;
type ProductFormInput = z.input<ProductFormSchema>;
export type ProductFormValues = z.output<ProductFormSchema>;

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
  const { locale } = useI18n();
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
  } = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialValues as ProductFormInput,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  const handleSelectAll = (event: FocusEvent<HTMLInputElement>) => {
    event.currentTarget.select();
  };

  const normalizeStock = (value: string) => value.replace(/[^\d]/g, "");

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit((values) =>
        onSubmit({
          ...values,
          description: values.description ?? "",
        }),
      )}
    >
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
          <Controller
            control={control}
            name="price"
            render={({ field }) => (
              <CurrencyInput
                id="price"
                value={
                  typeof field.value === "number" && Number.isFinite(field.value)
                    ? field.value
                    : 0
                }
                onValueChange={(next) => field.onChange(Number.isFinite(next) ? next : 0)}
                onBlur={field.onBlur}
                locale={locale}
                placeholder="0,00"
              />
            )}
          />
          {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="stock">Estoque</Label>
          <Controller
            control={control}
            name="stock"
            render={({ field }) => (
              <Input
                id="stock"
                inputMode="numeric"
                placeholder="0"
                className="text-right tabular-nums"
                value={
                  typeof field.value === "number" && Number.isFinite(field.value)
                    ? field.value.toString()
                    : "0"
                }
                onFocus={handleSelectAll}
                onChange={(event) => {
                  const next = normalizeStock(event.target.value);
                  field.onChange(next === "" ? 0 : Number(next));
                }}
                onBlur={field.onBlur}
              />
            )}
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
