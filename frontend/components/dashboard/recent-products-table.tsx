import { Badge } from "@/components/ui/badge";
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

type RecentProductsTableProps = {
  products: Product[];
  categoryMap: Record<string, string>;
};

export function RecentProductsTable({ products, categoryMap }: RecentProductsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white/95 shadow-sm">
      <div className="flex items-center justify-between px-6 pt-5">
        <div>
          <p className="font-display text-base font-semibold text-foreground">Ultimos produtos</p>
          <p className="text-xs text-muted-foreground">Atividades recentes no catalogo</p>
        </div>
        <Badge variant="secondary" className="rounded-full">
          Ultimos 7 dias
        </Badge>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produto</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Estoque</TableHead>
            <TableHead className="text-right">Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                Sem produtos cadastrados.
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
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
