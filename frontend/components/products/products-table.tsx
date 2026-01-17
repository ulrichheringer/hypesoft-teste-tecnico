import { MoreHorizontal, Pencil, Trash2, Warehouse } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Product } from "@/types/product";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

type ProductsTableProps = {
  products: Product[];
  categoryMap: Record<string, string>;
  onEdit: (product: Product) => void;
  onUpdateStock: (product: Product) => void;
  onDelete: (product: Product) => void;
  canEdit: boolean;
};

export function ProductsTable({
  products,
  categoryMap,
  onEdit,
  onUpdateStock,
  onDelete,
  canEdit,
}: ProductsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white/95 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produto</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Estoque</TableHead>
            <TableHead className="text-right">Preco</TableHead>
            <TableHead className="w-[80px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                Nenhum produto encontrado.
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium text-foreground">{product.name}</TableCell>
                <TableCell>{categoryMap[product.categoryId] || "Categoria"}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      product.stock < 10
                        ? "rounded-full bg-amber-100 text-amber-700"
                        : "rounded-full bg-emerald-100 text-emerald-700"
                    }
                  >
                    {product.stock} un
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-foreground">
                  {formatCurrency(product.price)}
                </TableCell>
                <TableCell className="text-right">
                  {canEdit ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-border">
                        <MoreHorizontal size={16} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(product)}>
                          <Pencil size={14} className="mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onUpdateStock(product)}>
                          <Warehouse size={14} className="mr-2" />
                          Atualizar estoque
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => onDelete(product)}
                        >
                          <Trash2 size={14} className="mr-2" />
                          Remover
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : null}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
