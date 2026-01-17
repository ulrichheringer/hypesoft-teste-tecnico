import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const faqs = [
  {
    title: "Como cadastrar um produto?",
    description:
      "Acesse Produtos, clique em Novo produto e preencha nome, preco, estoque e categoria.",
  },
  {
    title: "Como ajustar o estoque?",
    description:
      "Abra o menu do produto na tabela e selecione Atualizar estoque para informar o novo valor.",
  },
  {
    title: "Como criar categorias?",
    description:
      "Entre em Categorias, clique em Nova categoria e informe um nome para o grupo.",
  },
];

export default function HelpPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="font-display text-2xl font-semibold text-foreground">Ajuda</p>
        <p className="text-sm text-muted-foreground">
          Encontre respostas rapidas para as tarefas mais comuns.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {faqs.map((item) => (
          <Card
            key={item.title}
            className="rounded-2xl border border-border bg-white/95 shadow-sm"
          >
            <CardHeader>
              <CardTitle className="font-display text-base">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {item.description}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-2xl border border-border bg-white/95 shadow-sm">
        <CardHeader>
          <CardTitle className="font-display text-base">Precisa de suporte?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Entre em contato com a equipe em suporte@hypesoft.com.</p>
          <p>Horario de atendimento: seg a sex, 9h as 18h.</p>
        </CardContent>
      </Card>
    </section>
  );
}
