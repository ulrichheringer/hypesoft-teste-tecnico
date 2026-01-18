import { describe, expect, it, vi, beforeEach } from "vitest";
import { screen, waitFor, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CategoryForm } from "@/components/categories/category-form";

describe("CategoryForm Component", () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Validação em tempo real", () => {
    it("deve mostrar erro quando nome é muito curto", async () => {
      const user = userEvent.setup();
      render(<CategoryForm onSubmit={mockOnSubmit} submitLabel="Criar" />);

      const nameInput = screen.getByLabelText("Nome da categoria");
      await user.type(nameInput, "A");
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText("Informe um nome valido.")).toBeInTheDocument();
      });
    });

    it("deve limpar erro quando nome válido é inserido", async () => {
      const user = userEvent.setup();
      render(<CategoryForm onSubmit={mockOnSubmit} submitLabel="Criar" />);

      const nameInput = screen.getByLabelText("Nome da categoria");
      
      await user.type(nameInput, "A");
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText("Informe um nome valido.")).toBeInTheDocument();
      });

      await user.clear(nameInput);
      await user.type(nameInput, "Eletrônicos");
      
      await waitFor(() => {
        expect(screen.queryByText("Informe um nome valido.")).not.toBeInTheDocument();
      });
    });

    it("deve aceitar nome com 2+ caracteres", async () => {
      const user = userEvent.setup();
      render(<CategoryForm onSubmit={mockOnSubmit} submitLabel="Criar" />);

      const nameInput = screen.getByLabelText("Nome da categoria");
      await user.type(nameInput, "OK");
      await user.tab();

      await waitFor(() => {
        expect(screen.queryByText("Informe um nome valido.")).not.toBeInTheDocument();
      });
    });
  });

  describe("Preenchimento de valores padrão", () => {
    it("deve preencher campo quando defaultValues é fornecido", () => {
      render(
        <CategoryForm
          defaultValues={{ name: "Vestuário" }}
          onSubmit={mockOnSubmit}
          submitLabel="Atualizar"
        />
      );

      expect(screen.getByLabelText("Nome da categoria")).toHaveValue("Vestuário");
    });

    it("deve iniciar vazio sem defaultValues", () => {
      render(<CategoryForm onSubmit={mockOnSubmit} submitLabel="Criar" />);

      expect(screen.getByLabelText("Nome da categoria")).toHaveValue("");
    });
  });

  describe("Submissão do formulário", () => {
    it("deve chamar onSubmit com nome da categoria", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      render(<CategoryForm onSubmit={onSubmit} submitLabel="Criar" />);

      await user.type(screen.getByLabelText("Nome da categoria"), "Nova Categoria");
      await user.click(screen.getByRole("button", { name: "Criar" }));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledTimes(1);
      });
      
      expect(onSubmit.mock.calls[0][0]).toEqual({ name: "Nova Categoria" });
    });

    it("não deve submeter com nome vazio", async () => {
      const user = userEvent.setup();
      render(<CategoryForm onSubmit={mockOnSubmit} submitLabel="Criar" />);

      await user.click(screen.getByRole("button", { name: "Criar" }));

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it("não deve submeter com nome muito curto", async () => {
      const user = userEvent.setup();
      render(<CategoryForm onSubmit={mockOnSubmit} submitLabel="Criar" />);

      await user.type(screen.getByLabelText("Nome da categoria"), "A");
      await user.click(screen.getByRole("button", { name: "Criar" }));

      expect(mockOnSubmit).not.toHaveBeenCalled();
      await waitFor(() => {
        expect(screen.getByText("Informe um nome valido.")).toBeInTheDocument();
      });
    });
  });

  describe("Estado do botão de submit", () => {
    it("deve exibir o label correto no botão", () => {
      render(<CategoryForm onSubmit={mockOnSubmit} submitLabel="Salvar Alterações" />);

      expect(screen.getByRole("button", { name: "Salvar Alterações" })).toBeInTheDocument();
    });
  });

  describe("Acessibilidade", () => {
    it("deve ter label associado ao input", () => {
      render(<CategoryForm onSubmit={mockOnSubmit} submitLabel="Criar" />);

      const input = screen.getByLabelText("Nome da categoria");
      expect(input).toHaveAttribute("id", "name");
    });

    it("deve ter placeholder informativo", () => {
      render(<CategoryForm onSubmit={mockOnSubmit} submitLabel="Criar" />);

      expect(screen.getByPlaceholderText("Ex: Acessorios")).toBeInTheDocument();
    });
  });
});
