import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Category } from "@/types/category";
import { CategoryForm, type CategoryFormValues } from "@/components/categories/category-form";

type CategoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  category?: Category;
  submitLabel: string;
  onSubmit: (values: CategoryFormValues) => Promise<void> | void;
};

export function CategoryDialog({
  open,
  onOpenChange,
  title,
  category,
  submitLabel,
  onSubmit,
}: CategoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">{title}</DialogTitle>
        </DialogHeader>
        <CategoryForm
          defaultValues={category ? { name: category.name } : undefined}
          submitLabel={submitLabel}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
