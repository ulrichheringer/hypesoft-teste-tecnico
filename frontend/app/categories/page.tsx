"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/auth-provider";
import { CategoryDialog } from "@/components/categories/category-dialog";
import { CategoriesTable } from "@/components/categories/categories-table";
import { Pagination } from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/components/i18n/i18n-provider";
import { useCategories } from "@/hooks/use-categories";
import { createCategory, deleteCategory, updateCategory } from "@/services/categories";
import type { Category } from "@/types/category";

export default function CategoriesPage() {
  const { token, hasRole } = useAuth();
  const { t } = useI18n();
  const canEdit = hasRole("admin");
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const searchParam = searchParams.get("search") ?? "";

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState(searchParam);

  useEffect(() => {
    setSearch(searchParam);
    setPage(1);
  }, [searchParam]);
  const categoriesQuery = useCategories({
    page,
    pageSize,
    search,
  });

  const categories = categoriesQuery.data?.items ?? [];

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category | undefined>();

  const createMutation = useMutation({
    mutationFn: (values: Parameters<typeof createCategory>[0]) => createCategory(values, token),
    onSuccess: () => {
      toast.success("Categoria criada.");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setCreateOpen(false);
    },
    onError: () => toast.error("Nao foi possivel criar a categoria."),
  });

  const updateMutation = useMutation({
    mutationFn: (values: Parameters<typeof updateCategory>[1]) =>
      activeCategory ? updateCategory(activeCategory.id, values, token) : Promise.resolve(null),
    onSuccess: () => {
      toast.success("Categoria atualizada.");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setEditOpen(false);
      setActiveCategory(undefined);
    },
    onError: () => toast.error("Nao foi possivel atualizar a categoria."),
  });

  const deleteMutation = useMutation({
    mutationFn: (categoryId: string) => deleteCategory(categoryId, token),
    onSuccess: () => {
      toast.success("Categoria removida.");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => toast.error("Nao foi possivel remover a categoria."),
  });

  const handleEdit = (category: Category) => {
    setActiveCategory(category);
    setEditOpen(true);
  };

  const handleDelete = (category: Category) => {
    if (!window.confirm(`Deseja remover ${category.name}?`)) {
      return;
    }
    deleteMutation.mutate(category.id);
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-display text-2xl font-semibold text-foreground">
            {t("categories.title")}
          </p>
          <p className="text-sm text-muted-foreground">{t("categories.subtitle")}</p>
        </div>
        {canEdit ? (
          <Button className="rounded-xl" onClick={() => setCreateOpen(true)}>
            <Plus size={16} className="mr-2" />
            {t("categories.new")}
          </Button>
        ) : null}
      </header>

      <div className="flex w-full items-center gap-3 rounded-xl border border-border bg-white px-4 py-2 shadow-sm lg:max-w-md">
        <Search size={18} className="text-muted-foreground" />
        <Input
          className="border-0 bg-transparent px-0 text-sm focus-visible:ring-0"
          placeholder={t("categories.searchPlaceholder")}
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
        />
      </div>

      <CategoriesTable
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
        canEdit={canEdit}
      />

      <Pagination
        page={page}
        pageSize={pageSize}
        total={categoriesQuery.data?.total ?? 0}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />

      <CategoryDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Nova categoria"
        submitLabel="Criar categoria"
        onSubmit={async (values) => {
          await createMutation.mutateAsync(values);
        }}
      />

      <CategoryDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        title="Editar categoria"
        category={activeCategory}
        submitLabel="Salvar alteracoes"
        onSubmit={async (values) => {
          await updateMutation.mutateAsync(values);
        }}
      />
    </section>
  );
}
