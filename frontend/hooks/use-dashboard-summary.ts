import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/components/auth/auth-provider";
import { getDashboardSummary } from "@/services/dashboard";

export function useDashboardSummary() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: () => getDashboardSummary(token),
    enabled: Boolean(token),
    placeholderData: (previous) => previous,
  });
}
