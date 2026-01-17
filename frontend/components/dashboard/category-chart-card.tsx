"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/components/i18n/i18n-provider";

export function CategoryChartCard({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();

  return (
    <Card className="h-full rounded-2xl border border-border bg-white/95 shadow-sm">
      <CardHeader>
        <CardTitle className="font-display text-base">
          {t("dashboard.categoryChart.title")}
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          {t("dashboard.categoryChart.subtitle")}
        </p>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
