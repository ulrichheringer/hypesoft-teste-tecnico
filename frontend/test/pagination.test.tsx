import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { Pagination } from "@/components/shared/pagination";

describe("Pagination", () => {
  it("navigates to next page", async () => {
    const onPageChange = vi.fn();
    const onPageSizeChange = vi.fn();
    render(
      <Pagination
        page={1}
        pageSize={10}
        total={30}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />,
    );

    const buttons = screen.getAllByRole("button");
    const nextButton = buttons[1];
    await userEvent.click(nextButton);

    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});
