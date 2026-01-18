"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/components/i18n/i18n-provider";
import type { MessageKey } from "@/lib/i18n";

const faqs: Array<{ titleKey: MessageKey; descriptionKey: MessageKey }> = [
  {
    titleKey: "help.faq.product",
    descriptionKey: "help.faq.product.desc",
  },
  {
    titleKey: "help.faq.stock",
    descriptionKey: "help.faq.stock.desc",
  },
  {
    titleKey: "help.faq.category",
    descriptionKey: "help.faq.category.desc",
  },
];

export default function HelpPage() {
  const { t } = useI18n();

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="font-display text-2xl font-semibold text-foreground">{t("help.title")}</p>
        <p className="text-sm text-muted-foreground">{t("help.subtitle")}</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {faqs.map((item) => (
          <Card
            key={item.titleKey}
            className="rounded-2xl border border-border bg-white/95 shadow-sm"
          >
            <CardHeader>
              <CardTitle className="font-display text-base">{t(item.titleKey)}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {t(item.descriptionKey)}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
