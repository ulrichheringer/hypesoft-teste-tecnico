"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/components/i18n/i18n-provider";

export function InsightsCard({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();

  return (
    <Card className="h-full rounded-2xl border border-border bg-white/95 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-display text-base">
            {t("dashboard.insights.title")}
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            {t("dashboard.insights.subtitle")}
          </p>
        </div>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
          {t("dashboard.insights.badge")}
        </span>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
