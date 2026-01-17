import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const categorySchema = z.object({
  name: z.string().min(2, "Informe um nome valido."),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

type CategoryFormProps = {
  defaultValues?: Partial<CategoryFormValues>;
  onSubmit: (values: CategoryFormValues) => Promise<void> | void;
  submitLabel: string;
};

export function CategoryForm({ defaultValues, onSubmit, submitLabel }: CategoryFormProps) {
  const initialValues = useMemo(
    () => ({
      name: defaultValues?.name ?? "",
    }),
    [defaultValues?.name],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
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
        <Label htmlFor="name">Nome da categoria</Label>
        <Input id="name" placeholder="Ex: Acessorios" {...register("name")} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <Button type="submit" className="w-full rounded-2xl" disabled={isSubmitting}>
        {submitLabel}
      </Button>
    </form>
  );
}
