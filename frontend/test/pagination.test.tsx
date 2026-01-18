import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination } from "@/components/shared/pagination";

describe("Pagination Component", () => {
  const defaultProps = {
    page: 1,
    pageSize: 10,
    total: 50,
    onPageChange: vi.fn(),
    onPageSizeChange: vi.fn(),
  };

  describe("Navegação de páginas", () => {
    it("deve chamar onPageChange com página seguinte ao clicar em próxima", async () => {
      const onPageChange = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Pagination {...defaultProps} onPageChange={onPageChange} />
      );

      const nextButton = screen.getByLabelText("Pagina seguinte");
      await user.click(nextButton);

      expect(onPageChange).toHaveBeenCalledWith(2);
      expect(onPageChange).toHaveBeenCalledTimes(1);
    });

    it("deve chamar onPageChange com página anterior ao clicar em anterior", async () => {
      const onPageChange = vi.fn();
      const user = userEvent.setup();
      
      render(
        <Pagination {...defaultProps} page={3} onPageChange={onPageChange} />
      );

      const prevButton = screen.getByLabelText("Pagina anterior");
      await user.click(prevButton);

      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it("deve desabilitar botão anterior na primeira página", () => {
      render(<Pagination {...defaultProps} page={1} />);

      const prevButton = screen.getByLabelText("Pagina anterior");
      expect(prevButton).toBeDisabled();
    });

    it("deve desabilitar botão próxima na última página", () => {
      render(<Pagination {...defaultProps} page={5} total={50} pageSize={10} />);

      const nextButton = screen.getByLabelText("Pagina seguinte");
      expect(nextButton).toBeDisabled();
    });
  });

  describe("Exibição de informações", () => {
    it("deve calcular total de páginas para números não exatos", () => {
      render(<Pagination {...defaultProps} total={25} pageSize={10} />);

      // 25 itens / 10 por página = 3 páginas (arredondado para cima)
      expect(screen.getByText(/3/)).toBeInTheDocument();
    });
  });
});
