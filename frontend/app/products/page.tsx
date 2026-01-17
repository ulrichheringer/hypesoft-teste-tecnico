"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/auth-provider";
import { ProductDialog } from "@/components/products/product-dialog";
import { ProductsTable } from "@/components/products/products-table";
import { StockDialog } from "@/components/products/stock-dialog";
import { Pagination } from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/hooks/use-categories";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useProducts } from "@/hooks/use-products";
import {
  createProduct,
  deleteProduct,
  updateProduct,
  updateProductStock,
} from "@/services/products";
import type { Product } from "@/types/product";

export default function ProductsPage() {
  const { token, hasRole } = useAuth();
  const canEdit = hasRole("admin");
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const debouncedSearch = useDebouncedValue(search, 400);

  const categoriesQuery = useCategories({ page: 1, pageSize: 200 });
  const productsQuery = useProducts({
    page,
    pageSize,
    search: debouncedSearch,
    categoryId,
  });

  const categories = categoriesQuery.data?.items ?? [];
  const products = productsQuery.data?.items ?? [];

  const categoryMap = useMemo(() => {
    return categories.reduce<Record<string, string>>((acc, category) => {
      acc[category.id] = category.name;
      return acc;
    }, {});
  }, [categories]);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [stockOpen, setStockOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | undefined>();

  const createMutation = useMutation({
    mutationFn: (values: Parameters<typeof createProduct>[0]) => createProduct(values, token),
    onSuccess: () => {
      toast.success("Produto criado com sucesso.");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setCreateOpen(false);
    },
    onError: () => toast.error("Nao foi possivel criar o produto."),
  });

  const updateMutation = useMutation({
    mutationFn: (values: Parameters<typeof updateProduct>[1]) =>
      activeProduct ? updateProduct(activeProduct.id, values, token) : Promise.resolve(null),
    onSuccess: () => {
      toast.success("Produto atualizado com sucesso.");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setEditOpen(false);
      setActiveProduct(undefined);
    },
    onError: () => toast.error("Nao foi possivel atualizar o produto."),
  });

  const stockMutation = useMutation({
    mutationFn: (values: Parameters<typeof updateProductStock>[1]) =>
      activeProduct ? updateProductStock(activeProduct.id, values, token) : Promise.resolve(null),
    onSuccess: () => {
      toast.success("Estoque atualizado.");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setStockOpen(false);
      setActiveProduct(undefined);
    },
    onError: () => toast.error("Nao foi possivel atualizar o estoque."),
  });

  const deleteMutation = useMutation({
    mutationFn: (productId: string) => deleteProduct(productId, token),
    onSuccess: () => {
      toast.success("Produto removido.");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => toast.error("Nao foi possivel remover o produto."),
  });

  const handleEdit = (product: Product) => {
    setActiveProduct(product);
    setEditOpen(true);
  };

  const handleUpdateStock = (product: Product) => {
    setActiveProduct(product);
    setStockOpen(true);
  };

  const handleDelete = (product: Product) => {
    if (!window.confirm(`Deseja remover ${product.name}?`)) {
      return;
    }
    deleteMutation.mutate(product.id);
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-display text-2xl font-semibold text-foreground">Produtos</p>
          <p className="text-sm text-muted-foreground">
            Controle produtos, estoque e categorizacao.
          </p>
        </div>
        {canEdit ? (
          <Button className="rounded-2xl" onClick={() => setCreateOpen(true)}>
            <Plus size={16} className="mr-2" />
            Novo produto
          </Button>
        ) : null}
      </header>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex w-full items-center gap-3 rounded-2xl border border-border bg-white px-4 py-2 shadow-sm lg:max-w-md">
          <Search size={18} className="text-muted-foreground" />
          <Input
            className="border-0 bg-transparent px-0 text-sm focus-visible:ring-0"
            placeholder="Buscar por nome"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
        </div>
        <Select
          value={categoryId ?? "all"}
          onValueChange={(value) => {
            setCategoryId(value === "all" ? null : value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full rounded-2xl bg-white shadow-sm lg:w-60">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ProductsTable
        products={products}
        categoryMap={categoryMap}
        onEdit={handleEdit}
        onUpdateStock={handleUpdateStock}
        onDelete={handleDelete}
        canEdit={canEdit}
      />

      <Pagination
        page={page}
        pageSize={pageSize}
        total={productsQuery.data?.total ?? 0}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />

      <ProductDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Novo produto"
        categories={categories}
        submitLabel="Criar produto"
        onSubmit={async (values) => {
          await createMutation.mutateAsync(values);
        }}
      />

      <ProductDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        title="Editar produto"
        categories={categories}
        product={activeProduct}
        submitLabel="Salvar alteracoes"
        onSubmit={async (values) => {
          await updateMutation.mutateAsync(values);
        }}
      />

      {activeProduct ? (
        <StockDialog
          open={stockOpen}
          onOpenChange={setStockOpen}
          defaultStock={activeProduct.stock}
          onSubmit={async (values) => {
            await stockMutation.mutateAsync(values);
          }}
        />
      ) : null}
    </section>
  );
}
