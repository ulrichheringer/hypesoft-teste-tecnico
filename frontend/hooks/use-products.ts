import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/components/auth/auth-provider";
import { listProducts, type ListProductsParams } from "@/services/products";

export function useProducts(params: ListProductsParams) {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["products", params],
    queryFn: () => listProducts(params, token),
    enabled: Boolean(token),
    placeholderData: (previous) => previous,
  });
}
