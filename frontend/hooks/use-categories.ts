import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/components/auth/auth-provider";
import { listCategories, type ListCategoriesParams } from "@/services/categories";

export function useCategories(params: ListCategoriesParams) {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["categories", params],
    queryFn: () => listCategories(params, token),
    enabled: Boolean(token),
    placeholderData: (previous) => previous,
  });
}
