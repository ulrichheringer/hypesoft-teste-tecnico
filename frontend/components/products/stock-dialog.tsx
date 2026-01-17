import { zodResolver } from "@hookform/resolvers/zod";
import type { FocusEvent } from "react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const stockSchema = z.object({
  stock: z.coerce.number().int().min(0, "Informe um estoque valido."),
});

type StockValues = z.infer<typeof stockSchema>;

type StockDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultStock: number;
  onSubmit: (values: StockValues) => Promise<void> | void;
};

export function StockDialog({ open, onOpenChange, defaultStock, onSubmit }: StockDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StockValues>({
    resolver: zodResolver(stockSchema),
    defaultValues: { stock: defaultStock },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    reset({ stock: defaultStock });
  }, [defaultStock, reset]);

  const handleSelectAll = (event: FocusEvent<HTMLInputElement>) => {
    event.currentTarget.select();
  };

  const normalizeStock = (value: string) => value.replace(/[^\d]/g, "");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">Atualizar estoque</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <Label htmlFor="stock">Nova quantidade</Label>
            <Controller
              control={control}
              name="stock"
              render={({ field }) => (
                <Input
                  id="stock"
                  inputMode="numeric"
                  className="text-right tabular-nums"
                  value={field.value ?? 0}
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
          <Button type="submit" className="w-full rounded-2xl" disabled={isSubmitting}>
            Salvar estoque
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
