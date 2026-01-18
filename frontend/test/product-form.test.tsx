import { describe, expect, it, vi, beforeEach } from "vitest";
import { screen, waitFor, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductForm } from "@/components/products/product-form";
import { createCategory } from "./factories";

vi.mock("@/components/i18n/i18n-provider", () => ({
  useI18n: () => ({
    locale: "pt-BR",
    t: (key: string) => key,
  }),
}));

describe("ProductForm Component", () => {
  const categories = [
    createCategory({ id: "cat-1", name: "Eletrônicos" }),
    createCategory({ id: "cat-2", name: "Vestuário" }),
  ];
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Validação em tempo real", () => {
    it("deve mostrar erro quando nome é muito curto", async () => {
      const user = userEvent.setup();
      render(
        <ProductForm
          categories={categories}
          onSubmit={mockOnSubmit}
          submitLabel="Salvar"
        />
      );

      const nameInput = screen.getByLabelText("Nome");
      await user.type(nameInput, "A");
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText("Informe um nome valido.")).toBeInTheDocument();
      });
    });

    it("deve mostrar erro quando descrição é muito curta", async () => {
      const user = userEvent.setup();
      render(
        <ProductForm
          categories={categories}
          onSubmit={mockOnSubmit}
          submitLabel="Salvar"
        />
      );

      const descriptionInput = screen.getByLabelText("Descricao");
      await user.type(descriptionInput, "Curta");
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText("Descricao muito curta.")).toBeInTheDocument();
      });
    });

    it("deve limpar erro quando campo é corrigido", async () => {
      const user = userEvent.setup();
      render(
        <ProductForm
          categories={categories}
          onSubmit={mockOnSubmit}
          submitLabel="Salvar"
        />
      );

      const nameInput = screen.getByLabelText("Nome");
      
      await user.type(nameInput, "A");
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText("Informe um nome valido.")).toBeInTheDocument();
      });

      await user.clear(nameInput);
      await user.type(nameInput, "Produto Válido");
      
      await waitFor(() => {
        expect(screen.queryByText("Informe um nome valido.")).not.toBeInTheDocument();
      });
    });
  });

  describe("Preenchimento de valores padrão", () => {
    it("deve preencher campos quando defaultValues é fornecido", async () => {
      render(
        <ProductForm
          categories={categories}
          defaultValues={{
            name: "Notebook Dell",
            description: "Laptop de alta performance",
            price: 3500.50,
            stock: 25,
            categoryId: "cat-1",
          }}
          onSubmit={mockOnSubmit}
          submitLabel="Atualizar"
        />
      );

      expect(screen.getByLabelText("Nome")).toHaveValue("Notebook Dell");
      expect(screen.getByLabelText("Descricao")).toHaveValue("Laptop de alta performance");
      expect(screen.getByLabelText("Estoque")).toHaveValue("25");
    });
  });

  describe("Submissão do formulário", () => {
    it("deve preencher campos corretamente", async () => {
      const user = userEvent.setup();
      render(
        <ProductForm
          categories={categories}
          onSubmit={mockOnSubmit}
          submitLabel="Criar"
        />
      );

      await user.type(screen.getByLabelText("Nome"), "Produto Novo");
      await user.type(screen.getByLabelText("Descricao"), "Descrição detalhada do produto");
      await user.type(screen.getByLabelText("Estoque"), "50");

      expect(screen.getByLabelText("Nome")).toHaveValue("Produto Novo");
      expect(screen.getByLabelText("Estoque")).toHaveValue("50");
    });

    it("não deve submeter formulário com erros de validação", async () => {
      const user = userEvent.setup();
      render(
        <ProductForm
          categories={categories}
          onSubmit={mockOnSubmit}
          submitLabel="Criar"
        />
      );

      const submitButton = screen.getByRole("button", { name: "Criar" });
      await user.click(submitButton);

      await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe("Renderização de categorias", () => {
    it("deve renderizar campo de categoria", async () => {
      render(
        <ProductForm
          categories={categories}
          onSubmit={mockOnSubmit}
          submitLabel="Salvar"
        />
      );

      expect(screen.getByText("Categoria")).toBeInTheDocument();
    });

    it("deve exibir botão de submit com label correto", () => {
      render(
        <ProductForm
          categories={categories}
          onSubmit={mockOnSubmit}
          submitLabel="Salvar Produto"
        />
      );

      expect(screen.getByRole("button", { name: "Salvar Produto" })).toBeInTheDocument();
    });
  });
})});
