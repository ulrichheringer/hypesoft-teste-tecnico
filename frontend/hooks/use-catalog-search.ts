import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/components/auth/auth-provider";
import { searchCatalog } from "@/services/search";

export function useCatalogSearch(term: string, take = 5) {
  const { token } = useAuth();
  const normalized = term.trim();

  return useQuery({
    queryKey: ["catalog-search", normalized, take],
    queryFn: () => searchCatalog(normalized, token, take),
    enabled: Boolean(token) && normalized.length > 1,
    placeholderData: (previous) => previous,
  });
}
